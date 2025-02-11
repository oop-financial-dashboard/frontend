<template>
  <main class="portfolioPage">
    <div class="flex mb-2">
      <div class="border flex rounded bg-white w-3/4 mr-1">
        <p class="text-xl font-medium m-3 pl-2">
          Portfolio Name: <b class="text-primary">{{ portfolioId }}</b>
        </p>
      </div>
      <div class="bg-white rounded border ml-3 text-center" style="width: 300px">
        <p class="text-xl font-normal m-3">Total Value: <b class="text-black">{{ formatTotalValue(portfolioValue)}}</b></p>
      </div>
    </div>

    <div class="row-section d-flex justify-content-between">
      <data-box
        title="Price Return / Year"
        :displayValue="percentageData"
        :value="value"
        class="rounded-xl"
      >
      </data-box>
      <!-- <data-box
        title="Standard Deviation"
        :displayValue="stdDev"
        class="rounded-xl"
      >
      </data-box> -->
      <data-box
        title="Compound Annual Growth Rate"
        :displayValue="cagr"
        class="rounded-xl"
      >
      </data-box>
      <data-box
        title="Sharpe Ratio"
        :displayValue="sharpeRatio"
        class="rounded-xl"
      >
      </data-box>
      <data-box
        title="Active Return / Year"
        :displayValue="activeReturn"
        :bench-mark="benchMark"
        class="rounded-xl"
      >
      </data-box>
    </div>

    <div class="time-series-graph data-box bg-white p-4 rounded-xl border">
      <!--      <header class="mb-1">Time Series Graph</header>-->
      <portfolio-value-chart :portfolio-id="portfolioId" />
    </div>

    <div class="flex space-x-4 my-4">
      <!-- this exposure chart should be part of the div for all the alignments and padding to apply -->
      <exposure-chart
        class="rounded-xl border w-5/6"
        :portfolio-stocks="portfolio.stocks"
      />
      <assets-pie-chart
        class="rounded-xl border w-5/6"
        :portfolio="portfolio"
      />
      <va-r-chart class="rounded-xl" :portfolio-stocks="portfolio.stocks" />
    </div>
    <!-- </div> -->
    <div class="time-series-graph data-box bg-white p-4 rounded-xl border">
      <attribution-chart />
    </div>

    <div class="stocks border data-box bg-white rounded-xl">
      <p class="text-xl font-bold m-4">Portfolio Stocks</p>
      <div class="table-container">
        <stocks-table
          class="rounded m-4 "
          style="width: 1200px"
          :portfolio-stocks="portfolio.stocks"
        />
      </div>
    </div>
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
import VaRChart from "@/components/Analytics/VaRChart.vue";

export default {
  components: {
    VaRChart,
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
      // portfolioValue: sessionStorage.getItem("portfolio").totalValue,
      portfolioValue: JSON.parse(sessionStorage.getItem("portfolio"))
        .totalValue,
      portfolio: JSON.parse(sessionStorage.getItem("portfolio")),
      percentageData: 0,
      value: 0,
      stdDev: 0,
      cagr: 0,
      sharpeRatio: 0,
      activeReturn: 0,
      benchMark: "S&P 500", // S&P stock name info
      userid: sessionStorage.getItem("user_id"),
      priceReturnList: [],
      priceReturn: 0,
      portfolioList: [this.portfolio],
      initialPrice: 0,
      token: sessionStorage.getItem("token"),
      stdData: {},
      ror: 0,
    };
  },
  mounted() {
    this.calculatePriceReturn();
    this.calculatePortfolioSD();
    //this.calculateSharpeRatio(this.value, this.stdDev);
    // this.calculateActiveReturn();
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
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .get(
          `/portfolio/get-historicals/${this.userid}/${this.portfolioId}`,
          config
        )
        .then((response) => {
          if (response.status === 200) {
            this.calculateCAGR(response.data.data[this.portfolioId]); // send portfolio historicals
            this.priceReturnList = response.data;
            this.portfolioValue = response.data.data[this.portfolioId][response.data.data[this.portfolioId].length-1][1];
            for (const key in response.data) {
              for (const k in response.data[key]) {
                this.priceReturnList = response.data[key][k];
              }
            }

            for (const portfolio in this.portfolioList) {
              if (this.portfolio.stocks[0].portfolioId == this.portfolioId) {
                console.log(portfolio);
                this.initialPrice += this.portfolio.totalValue;
              }
            }
            // (summing all individual stocks in the portfolio then subtracting the last stock price) -1

            this.priceReturn = this.priceReturnList[this.priceReturnList.length - 1][1];
            this.percentageData = Number(((
              (this.priceReturn/this.initialPrice) - 1) * 100).toFixed(2)
            );
            this.value = this.formatTotalValue(
              this.priceReturn - this.initialPrice
            );
            this.calculateActiveReturn(this.percentageData);
            this.calculatePortfolioSD(this.percentageData);
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

    async calculatePortfolioSD(ror) {
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

        // call the method to calculate sharpe ratio
        this.calculateSharpeRatio(ror, portfolioStdv);

      } catch (error) {
        // Handle errors here
        console.log("Failed to calculate portfolio standard deviation.")
      }
    },

    calculateSharpeRatio(ror, stdDev) {
      // sharpe ratio
      // Risk-free Rate of Return = [(1 + Government Bond Rate)/(1 + Inflation Rate)] – 1
      // inflation rate = 3.7% https://www.cnbc.com/2023/10/12/heres-the-inflation-breakdown-for-september-2023-in-one-chart.html#:~:text=The%20consumer%20price%20index%20rose,rate%20over%20the%20long%20term.
      // govt bond rate = 4.5796% https://www.worldgovernmentbonds.com/country/united-states/
      const inflationRate = 3.7/100;
      const govtBondRate = 4.5796/100;
      let riskFreeRate = ((1 + govtBondRate)/(1 + inflationRate)) - 1;
      let sharpeRatio = ((ror/100) - riskFreeRate)/(stdDev/100)
      this.sharpeRatio = sharpeRatio.toFixed(2);
    },

    calculateActiveReturn(pData) {

      // S&P 500 link https://www.fool.com/investing/2023/11/02/you-shocked-learn-sp-500-2023-magnificent-7-stocks/#:~:text=The%20benchmark%20S%26P%20500%20index%20has%20delivered%20a%20return%20of,dubbed%20the%20%22Magnificent%20Seven.%22
      // with reference to the link above, S&P 500 has delivered a return of about 8.5% so far in 2023.
      // ROR = curr - initial/initial x 100
      // ROR - benchmark = active return
      this.activeReturn = (pData - 8.5).toFixed(2);
    },

    getDifferenceInYears(timestamp1, timestamp2){
      const date1 = new Date(parseInt(timestamp1, 10));
      const date2 = new Date(parseInt(timestamp2, 10));
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs / (1000 * 60 * 60 * 24 * 365.25);
    },

    calculateCAGR(portfolioHistoricals) {
      const start = portfolioHistoricals[0]; // earlier
      const end = portfolioHistoricals[portfolioHistoricals.length - 1]; // latest/current
      const numYears = this.getDifferenceInYears(start[0], end[0]);
      const cagr = ((end[1]/start[1])**(1/numYears)-1) * 100;
      if (cagr > 200) {
        this.cagr = "Insufficient Data";
      } else {
        this.cagr = cagr.toFixed(2);
      }
    }
  }
}
</script>

<style scoped>
.portfolioPage {
  background: #f5f7ff;
}
.data-box {
  margin: 10px 0 10px 0;
  padding: 5px;
}

.table-container {
  overflow-x: auto; /* Add horizontal scroll on smaller screens */
}

</style>
