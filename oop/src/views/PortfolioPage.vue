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
        title="Price Return"
        :displayValue="percentageData"
        :value="value"
        class="rounded-xl"
      >
      </data-box>
      <data-box
        title="Standard Deviation"
        :displayValue="stdDev"
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
        title="Active Return"
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
      stdDev: 15.43,
      sharpeRatio: 2.5,
      activeReturn: 159,
      benchMark: "S&P stock name info",
      userid: sessionStorage.getItem("user_id"),
      priceReturnList: [],
      priceReturn: 0,
      portfolioList: JSON.parse(sessionStorage.getItem("portfolioList")),
      initialPrice: 0,
    };
  },
  mounted() {
    this.calculatePriceReturn();
    this.calculateSD();
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
            this.priceReturnList = response.data;
            for (const key in response.data) {
              console.log(response.data[key]);
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

    calculateSD() {},
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
}
/* .portfoliopage {
  background-color: #f5f7ff;
  
} */

.table-container {
  overflow-x: auto; /* Add horizontal scroll on smaller screens */
}

</style>
