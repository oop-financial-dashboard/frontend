<template>
  <main class="portfolioPage">
    <div class="border rounded mb-2 bg-light">
      <p class="text-l font-medium m-1 pl-2">
        Portfolio Name: <b class="text-primary">{{ portfolioId }}</b>
      </p>
    </div>
      <div class="row-section d-flex justify-content-between">
        <data-box
          title="Price Return"
          :displayValue="percentageData"
          :value="value"
        >
        </data-box>
        <data-box title="Standard Deviation" :displayValue="stdDev"> </data-box>
        <data-box title="Sharpe Ratio" :displayValue="sharpeRatio"> </data-box>
        <data-box
          title="Active Return"
          :displayValue="activeReturn"
          :bench-mark="benchMark"
        >
        </data-box>
      </div>

      <div class="time-series-graph data-box bg-white p-4">
        <!--      <header class="mb-1">Time Series Graph</header>-->
        <portfolio-value-chart class="rounded" :portfolio-id="portfolioId" />
      </div>

      <div class="d-flex h-auto justify-content-between">
        <!-- this exposure chart should be part of the div for all the alignments and padding to apply -->
        <exposure-chart class="rounded" :portfolio-stocks="portfolio.stocks" />

        <!-- <div class="bg-white data-box p-4"> -->
        <!-- <header class="mb-1">Assets Pie Chart</header> -->
        <assets-pie-chart class="rounded" :portfolio="portfolio"/>
      </div>
      <!-- </div> -->
      <div class="time-series-graph data-box bg-white p-4">
        <attribution-chart/>
      </div>

      <div class="stocks border data-box">
        <stocks-table class="rounded" :portfolio-stocks="portfolio.stocks" />
      </div>
    <!-- </div> -->
    

  </main>
</template>

<script>
import dataBox from "@/components/dataBox.vue";
import ExposureChart from "@/components/Analytics/ExposureChart.vue";
import stocksTable from "@/components/Analytics/StocksTable.vue";
import PortfolioValueChart from "@/components/Analytics/PortfolioValueChart.vue";
import AssetsPieChart from "@/components/Analytics/AssetsPieChart.vue";
import AttributionChart from "@/components/Analytics/AttributionChart.vue";
import axios from "axios";

export default {
  components: {
    AttributionChart,
    PortfolioValueChart,
    dataBox,
    ExposureChart,
    stocksTable,
    AssetsPieChart,
  },
  data() {
    return {
      portfolioId: sessionStorage.getItem("portfolioId"),
      portfolio: JSON.parse(sessionStorage.getItem("portfolio")),
      percentageData: 0,
      value: 0,
      stdDev: 15.43,
      sharpeRatio: 2.5,
      activeReturn: 159,
      benchMark: "S&P stock name info",
      userid: sessionStorage.getItem("user_id"),
      priceReturnList: [],
      priceReturn: 0,
      portfolioList: JSON.parse(sessionStorage.getItem("portfolioList")),
      initialPrice: 0,
      token: sessionStorage.getItem("token"),
      stdData: {}
    };
  },
  mounted() {
    this.calculatePriceReturn();
    this.calculatePortfolioSD();
    this.calculateSharpeRatio();
    this.calculateActiveReturn();
  },
  methods: {
    formatTotalValue(totalValue) {
      return totalValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    calculatePriceReturn() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      axios
        .get(
          `/portfolio/get-historicals/${this.userid}/${this.portfolioId}`,
          config
        )
        .then((response) => {
          if (response.status === 200) {
            this.priceReturnList = response.data;
            for (const key in response.data) {
              for (const k in response.data[key]) {
                this.priceReturnList = response.data[key][k];
              }
            }

            for (const portfolio in this.portfolioList) {
              if (portfolio == this.portfolioId) {
                this.initialPrice += this.portfolioList[portfolio].totalValue;
              }
            }
            // (summing all individual stocks in the portfolio then subtracting the last stock price) -1

            //TO DO : UNCOMMENT THIS OUT!!
            this.priceReturn =
              this.priceReturnList[this.priceReturnList.length - 1][1];
            this.percentageData = Number(
              (this.priceReturn - this.initialPrice - 1).toFixed(2)
            );
            this.value = this.formatTotalValue(
              this.priceReturn - this.initialPrice
            );
          }
        });
    },

    getYesterdayDate() {
      const today = new Date(); // Create a new Date instance with the current date and time
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Subtract one day
      const year = yesterday.getFullYear();
      const month = (yesterday.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so we add 1
      const day = yesterday.getDate().toString().padStart(2, "0");
      const timestamp = `${year}-${month}-${day}`;
      return timestamp;
    },

    calculateStockSD(closeArray) {

      // Step 1: Calculate the mean
      const mean = closeArray.reduce((acc, val) => acc + val, 0) / closeArray.length;

      // Step 2: Calculate the variance for each data point
      const variances = closeArray.map(x => x - mean);

      // Step 3: Square the variances
      const squaredVariances = variances.map(variance => Math.pow(variance, 2));

      // Step 4: Sum of squared variance values
      const sumOfSquaredVariances = squaredVariances.reduce((sum, variance) => sum + variance, 0);

      // Step 5: Calculate the sample standard deviation
      const standardDeviation = Math.sqrt(sumOfSquaredVariances / (closeArray.length - 1));

      return standardDeviation;
    },

    calculateStockWeight(stockValue) {
      // get weights
      const initialCapital = this.portfolio.totalValue;
      return stockValue/initialCapital;
    },
    
    calculatePortfolioVariance(stdData) {
      // Initialize the portfolio variance
      let portfolioVariance = 0;

      // Calculate the portfolio variance
      for (const stockSymbol in stdData) {
        const stdv = stdData[stockSymbol].stdDev;
        const weight = stdData[stockSymbol].weight;
        // Assume no correlation
        portfolioVariance += (weight ** 2) * (stdv ** 2);
      }
      return portfolioVariance;
    },

    async calculatePortfolioSD() {
      let portfolioVariance = 0;
      const stockPromises = [];

      for (const stock of this.portfolio.stocks) {
        const stockSymbol = stock.symbol;
        const stockAdded = stock.dateAdded;
        const timestamp = this.getYesterdayDate();

        const config = {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        };

        const stockPromise = axios.post(`/stock/historicals`, {
          symbol: stockSymbol,
          end: timestamp,
          start: stockAdded,
        }, config);

        stockPromises.push(stockPromise);
      }

      try {
        const responses = await Promise.all(stockPromises);

        for (const response of responses) {
          if (response.status === 200) {
            const closeArray = response.data.map(item => parseFloat(item.close));
            const stockStd = this.calculateStockSD(closeArray);

            // Add stock weight
            for (const stock of this.portfolio.stocks) {
              const stockWeight = this.calculateStockWeight(stock.value);
              this.stdData[stock.symbol] = { stdDev: stockStd, weight: stockWeight };
            }

            // Calculate portfolio variance
            portfolioVariance = this.calculatePortfolioVariance(this.stdData);
          }
        }

        const portfolioStdv = Math.sqrt(portfolioVariance);
        this.stdDev = parseFloat(portfolioStdv * 100).toFixed(2) + "%"; // This sets the portfolio standard deviation
      } catch (error) {
        // Handle errors here
        console.log("Failed to calculate portfolio standard deviation.")
      }
    },

    calculateSharpeRatio() {
      // TODO
      // sharpe ratio
      // ROR = curr - initial/initial x 100
      // Enter the current value and expected rate of return for each investment. (7%)
      // Indicate the weight of each investment.
      // Multiply the weight by its expected return
      // Sum these all up

      // axios
      //     .post(
      //       `/stock/price`,
      //         {
      //           symbol: stockSymbol,
      //           timestamp: "2023-11-03", // date should be yesterday date
      //         },
      //         config
      //     )
      //     .then((response) => {
      //       if (response.status === 200) {
      //         // calculate weights per stock
              
      //       }
      //     });

    },

    calculateActiveReturn() {
      // TODO
      // Risk-free Rate of Return = [(1 + Government Bond Rate)/(1 + Inflation Rate)] – 1
      // inflation rate = 3.7
      // govt bond rate = 4.577
    },
  },
};
</script>

<style scoped>
.portfolioPage {
  background: #f5f7ff;
}
.data-box {
  margin: 10px 0 10px 0;
  padding: 5px;
  border-radius: 5px;
}
/* .portfoliopage {
  background-color: #f5f7ff;
  
} */


</style>
