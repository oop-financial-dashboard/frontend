<template>
  <main class="portfolioPage">
    <div class="border rounded mb-2 bg-light">
      <p class="text-l font-medium m-1 pl-2">
        Portfolio Name: <b class="text-primary">{{ portfolioId }}</b>
      </p>
    </div>
    <h1>mean of stock</h1>
    {{ this.stockMeans }}

    <h1>historical closing price</h1>
    {{ this.histClosingPrice }}

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
      symbolArray: [],
      // historicalList: [],
      dateAdded: [],
      valueArray: [],
      weightsArray: [],
      stockPriceArray: [],
      histClosingPrice: [],
      stockMeans: [],
    };
  },
  mounted() {
    this.calculatePriceReturn();
    this.calculateSD();
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

    calculateSD() {
      const today = new Date(); // Create a new Date instance with the current date and time
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Subtract one day
      const year = yesterday.getFullYear();
      const month = (yesterday.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so we add 1
      const day = yesterday.getDate().toString().padStart(2, "0");
      const timestamp = `${year}-${month}-${day}`;

      // get historicals
      const stocksArray = this.portfolio.stocks;
      for (const stock of stocksArray) {
        this.symbolArray.push(stock.symbol);
        this.dateAdded.push(stock.dateAdded);
        this.valueArray.push(stock.value);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      var counter = 0;
      for (const symbol of this.symbolArray) {
        axios
          .post(
            `/stock/historicals`,
            {
              symbol: symbol,
              end: timestamp,
              start: this.dateAdded[counter],
            },
            config
          )
          .then((response) => {
            if (response.status === 200) {
              let totalClose = 0;
              for (const key in response.data) {
                // this.historicalList.push(response.data[key]);
                const close = parseFloat(response.data[key].close);
                console.log("close", close);
                this.histClosingPrice.push(close);
                totalClose += close; // getting the mean for each stock
                console.log("total", totalClose);
              }
              const meanClose = totalClose / response.data.length;
              console.log("data length", response.data.length);
              this.stockMeans.push(meanClose);
              counter += 1;

              // calculate the portfolio SD when all data is collected
              // summation of (x - mean / n-1)
              // SD of 1 stock this.Histclosingprice - mean / this.Histclosingprice.length - 1 (?)              

              // if (counter === this.symbolArray.length) {
              //   let sumOfVariance = 0;
              //   for (const mean of this.stockMeans) {
              //     const variance = mean - this.priceReturn; // this shouldnt be priceReturn, should be the historical closing price
              //     const squaredVariance = variance ** 2;
              //     sumOfVariance += squaredVariance;
              //   }
              //   const sampleStandardDeviation = Math.sqrt(
              //     sumOfVariance / (this.stockMeans.length - 1)
              //   );
              //   this.stdDev = sampleStandardDeviation.toFixed(2);
              // }
            }
          });
        axios
          .post(
            `/stock/price`,
            {
              symbol: symbol,
              timestamp: "2023-11-03",
            },
            config
          )
          .then((response) => {
            if (response.status === 200) {
              this.stockPriceArray.push(response.data);
            }
          });
      }

      // get weights
      var capital = this.portfolio.initialCapital;
      for (const value of this.valueArray) {
        this.weightsArray.push(value / capital);
      }

      // array A - push all closing point to an array [done]
      // mean - sum of total closing price / length of array A, 1mean 1 stock [done]

      // # Sample data points (replace with your data)

      // data_points = [12, 15, 18, 21, 24]

      // # Step 1: Calculate the mean
      // mean = sum(data_points) / len(data_points)

      // # Step 2: Calculate the variance for each data point
      // variances = [(x - mean) for x in data_points]

      // # Step 3: Square the variances
      // squared_variances = [variance ** 2 for variance in variances]

      // # Step 4: Sum of squared variance values
      // sum_of_squared_variances = sum(squared_variances)

      // # Step 5: Calculate the sample standard deviation
      // sample_standard_deviation = math.sqrt(sum_of_squared_variances / (len(data_points) - 1))

      // print("Mean:", mean)
      // print("Sample Standard Deviation:", sample_standard_deviation)

      // weights - how much $ (value/initial captial) - each stock
      // start date - date of creation of portfolio
      // end date - today

      //rate of return (current-initial)/initial

      // sharpe ratio
      // Enter the current value and expected rate of return for each investment. (7%)
      // Indicate the weight of each investment.
      // Multiply the weight by its expected return
      // Sum these all up

      // Risk-free Rate of Return = [(1 + Government Bond Rate)/(1 + Inflation Rate)] – 1
      // inflation rate = 3.7
      // govt bond rate = 4.577
    },

    calculateSharpeRatio() {
      // TODO
    },

    calculateActiveReturn() {
      // TODO
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
