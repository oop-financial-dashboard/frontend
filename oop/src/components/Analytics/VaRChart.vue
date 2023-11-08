<template>
  <div/>
</template>

<script>
import axios from "axios";

export default {
  name: "VaRChart",
  props: {portfolioStocks: Array},
  async created() {
    const historicalStocksPrices = await this.getAllStocksHistoricals(this.portfolioStocks);
    const stocksDailyWeightedReturn = [];
    this.stockWeights = this.calculateStockWeights(this.portfolioStocks);
    historicalStocksPrices.forEach((stockPrice, index) => {
      Promise.resolve(stocksDailyWeightedReturn.push(this.calculateDailyReturns(stockPrice.value, this.stockWeights[index])));
    })
    console.log("portfolio daily returns",stocksDailyWeightedReturn);
    this.portfolioWeightedReturn = this.calculatePortfolioDailyWeightedReturn(stocksDailyWeightedReturn);
    // this.chartOptions.series[1].data = this.calculatePortfolioDailyWeightedReturn(stocksDailyWeightedReturn);
    console.log("portfolio weighted return",this.portfolioWeightedReturn);
  },
  data() {
    return {
      portfolioValue: 0,
      stockWeights: [],
      portfolioWeightedReturn: [],
      chartOptions: {
        chart: {
          type: "column"
        },
        title: {
          text: "Value at Risk ($)"
        },
        xAxis: {
          categories: null
        },
        series: [{
          name: 'Histogram',
          type: 'histogram',
          xAxis: 1,
          yAxis: 1,
          baseSeries: 's1',
          zIndex: -1
        }, {
          data: null,
          id: 's1',
        }]
      }
    }
  },
  methods: {
    async getAllStocksHistoricals(stocks) {
      const stockTickers = [];
      stocks.forEach(stock => {
        stockTickers.push(stock.symbol)
      });

      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const stocksHistoricalValues = await Promise.allSettled(stockTickers.map(sId => axios.post(`/stock/historicals`, {
        symbol: sId, "end": "2023-11-03",
        "start": "2013-11-04"
      }, config).then(({data}) => data)));
      return stocksHistoricalValues;
    },
    calculateDailyReturns(stockPricesSeries, weight) {
      let dailyReturn = [];
      for (let i = stockPricesSeries.length - 1; i > 0; i--) {
        const current = stockPricesSeries[i].close;
        const previous = stockPricesSeries[i - 1].close;
        const returnRate = ((current - previous) / previous);
        const weightedReturnRate = weight * returnRate;
        dailyReturn.push(parseFloat(weightedReturnRate.toPrecision(5)));
      }
      return dailyReturn;
    },
    calculateStockWeights(stocks) {
      let totalPortfolioValue = 0;
      let stockValues = [];
      let stockWeights = [];
      stocks.forEach(stock => {
        totalPortfolioValue += stock.value;
        stockValues.push(stock.value);
      });

      stockValues.forEach(value => {
        let weight = value/totalPortfolioValue;
        stockWeights.push(parseFloat(weight.toPrecision(5)));
      });
      console.log(stockWeights);
      this.portfolioValue = totalPortfolioValue;
      return stockWeights;
    },
    calculatePortfolioDailyWeightedReturn(stocksWeightReturn) {
      // const numOfStocks = stocksWeightReturn.length;
      // const numOfDays = stocksWeightReturn[0].length;
      let portfolioDailyWeightedReturn = [];
      // loop through each day
      for(let i=0; i < stocksWeightReturn[0].length; i++) {
        let combinedStockDailyReturns = 0;
        // loop through each stock weighted return
        for (let j=0; j < stocksWeightReturn.length; j++) {
          // stockWeights[0-4][0-2157]
          combinedStockDailyReturns += stocksWeightReturn[j][i];
        }
        // multiply aggregated weighted returns with portfolio value for Daily Portfolio Returns
        const dailyWeightedReturn = combinedStockDailyReturns * this.portfolioValue;
        portfolioDailyWeightedReturn.push(Math.round(dailyWeightedReturn * 100) / 100)
      }
      return portfolioDailyWeightedReturn;
    }
  }
}
</script>

<style scoped>

</style>