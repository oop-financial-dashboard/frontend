<template>
  <main class="portfolioPage">
    <div class="border rounded mb-2 bg-light" >
      <p class="text-l font-medium m-1 pl-2">Portfolio Name: <b class="text-primary">{{portfolioId}}</b></p>
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
      portfolioId: sessionStorage.getItem('portfolioId'),
      portfolio: JSON.parse(sessionStorage.getItem('portfolio')),
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
  mounted(){
    this.calculatePriceReturn();
    this.calculateSD();
  },
  methods:{
    formatTotalValue(totalValue) {
      return totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    calculatePriceReturn(){
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      axios.get(`/portfolio/get-historicals/${this.userid}/${this.portfolioId}`, config)
      .then((response) => {
        if (response.status === 200) {
          this.priceReturnList = response.data;  
          for(const key in response.data){
            console.log(response.data[key]);
            for(const k in response.data[key]){
              this.priceReturnList = response.data[key][k]
            }
          }

          for(const portfolio in this.portfolioList){
            if(portfolio == this.portfolioId){
              this.initialPrice += this.portfolioList[portfolio].totalValue;
            }
          }
          // (summing all individual stocks in the portfolio then subtracting the last stock price) -1 

          //TO DO : UNCOMMENT THIS OUT!!
          this.priceReturn = this.priceReturnList[this.priceReturnList.length-1][1];
          this.percentageData = Number(((this.priceReturn - this.initialPrice) - 1).toFixed(2));
          this.value = this.formatTotalValue(this.priceReturn - this.initialPrice);
        }
      })
    },

    calculateSD(){

    }
  }

  
};
</script>

<style scoped>
.portfolioPage{
  background: #F5F7FF;
}
.data-box {
  margin: 10px 0 10px 0;
  padding: 5px;
  border-radius: 5px;
}
</style>
