<template>
  <div class="border bg-white rounded-xl" style="width: 650px">
    <p class="fw-bold text-center text-lg mt-2">Value at Risk (VaR)</p>
    <div class="w-2/3 align-items mx-auto mt-5">
      <label
        for="price"
        class="block text-sm font-medium leading-6 text-gray-900"
        >Confidence Level</label
      >
      <div class="relative mt-2 rounded-md shadow-sm">
        <input
          type="number"
          name="confidence-level"
          style="height: 50px"
          id="confidence-level"
          class="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="90"
          @keyup="calculatePercentile"
          @input="validateInput"
          v-model="confidenceLevelInput"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <span class="text-gray-500 sm:text-sm">%</span>
        </div>
      </div>
      <p class="text-sm text-danger mt-1" v-if="showError">
        Invalid percentage!
      </p>
    </div>
    <div class="w-2/3 align-items mx-auto mt-3">
      <label
        for="price"
        class="block text-sm font-medium leading-6 text-gray-900"
        >Risk Amount</label
      >
      <div class="relative mt-2 rounded-md shadow-sm">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <span class="text-gray-500 sm:text-sm">$</span>
        </div>

        <input
          v-model="calculatedRiskOutput"
          disabled
          type="number"
          name="risk-amount"
          style="height: 50px"
          id="confidence-level"
          class="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Calculated Risk"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "VaRChart",
  props: { portfolioStocks: Array },
  async created() {
    const historicalStocksPrices = await this.getAllStocksHistoricals(
      this.portfolioStocks
    );
    const stocksDailyWeightedReturn = [];
    this.stockWeights = this.calculateStockWeights(this.portfolioStocks);
    historicalStocksPrices.forEach((stockPrice, index) => {
      Promise.resolve(
        stocksDailyWeightedReturn.push(
          this.calculateDailyReturns(stockPrice.value, this.stockWeights[index])
        )
      );
    });
    this.portfolioWeightedReturn = this.calculatePortfolioDailyWeightedReturn(
      stocksDailyWeightedReturn
    );
    // this.chartOptions.series[1].data = this.calculatePortfolioDailyWeightedReturn(stocksDailyWeightedReturn);
    this.calculatePercentile();
  },
  data() {
    return {
      showError: false,
      confidenceLevelInput: 0,
      calculatedRiskOutput: 0,
      portfolioValue: 0,
      stockWeights: [],
      portfolioWeightedReturn: [],
      chartOptions: {
        chart: {
          type: "column",
        },
        title: {
          text: "Value at Risk ($)",
        },
        xAxis: {
          categories: null,
        },
        series: [
          {
            name: "Histogram",
            type: "histogram",
            xAxis: 1,
            yAxis: 1,
            baseSeries: "s1",
            zIndex: -1,
          },
          {
            data: null,
            id: "s1",
          },
        ],
      },
    };
  },
  methods: {
    validateInput() {
      const input = parseFloat(this.confidenceLevelInput);
      if (input < 0 || input > 100) {
        this.showError = true;
      } else {
        this.showError = false;
      }
    },
    async getAllStocksHistoricals(stocks) {
      const stockTickers = [];
      stocks.forEach((stock) => {
        stockTickers.push(stock.symbol);
      });
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const stocksHistoricalValues = await Promise.allSettled(
        stockTickers.map((sId) =>
          axios
            .post(
              `/stock/historicals`,
              {
                symbol: sId,
                end: "2023-11-03",
                start: "2013-11-04",
              },
              config
            )
            .then(({ data }) => data)
        )
      );
      return stocksHistoricalValues;
    },
    calculateDailyReturns(stockPricesSeries, weight) {
      let dailyReturn = [];
      for (let i = stockPricesSeries.length - 1; i > 0; i--) {
        const current = stockPricesSeries[i].close;
        const previous = stockPricesSeries[i - 1].close;
        const returnRate = (current - previous) / previous;
        const weightedReturnRate = weight * returnRate;
        dailyReturn.push(parseFloat(weightedReturnRate.toPrecision(5)));
      }
      return dailyReturn;
    },
    calculateStockWeights(stocks) {
      let totalPortfolioValue = 0;
      let stockValues = [];
      let stockWeights = [];
      stocks.forEach((stock) => {
        totalPortfolioValue += stock.value;
        stockValues.push(stock.value);
      });
      stockValues.forEach((value) => {
        let weight = value / totalPortfolioValue;
        stockWeights.push(parseFloat(weight.toPrecision(5)));
      });
      this.portfolioValue = totalPortfolioValue;
      return stockWeights;
    },
    calculatePortfolioDailyWeightedReturn(stocksWeightReturn) {
      // const numOfStocks = stocksWeightReturn.length;
      // const numOfDays = stocksWeightReturn[0].length;
      let portfolioDailyWeightedReturn = [];
      // loop through each day
      for (let i = 0; i < stocksWeightReturn[0].length; i++) {
        let combinedStockDailyReturns = 0;
        // loop through each stock weighted return
        for (let j = 0; j < stocksWeightReturn.length; j++) {
          // stockWeights[0-4][0-2157]
          combinedStockDailyReturns += stocksWeightReturn[j][i];
        }
        // multiply aggregated weighted returns with portfolio value for Daily Portfolio Returns
        const dailyWeightedReturn =
          combinedStockDailyReturns * this.portfolioValue;
        portfolioDailyWeightedReturn.push(
          Math.abs(Math.round(dailyWeightedReturn * 100) / 100)
        );
      }
      return portfolioDailyWeightedReturn;
    },
    calculatePercentile() {
      const percentile = require("percentile");
      // console.log(
      //   "calculating VAR",
      //   percentile(0, this.portfolioWeightedReturn)
      // );
      if(!this.showError){
        this.calculatedRiskOutput = percentile(
          this.confidenceLevelInput,
          this.portfolioWeightedReturn
        );
      }
    },
  },
};
</script>

<style scoped></style>
