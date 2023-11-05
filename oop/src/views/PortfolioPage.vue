<template>
  <main>
    <div>
      <h1>{{portfolioId}}</h1>
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

export default {
  data() {
    return {
      portfolioId: sessionStorage.getItem('portfolioId'),
      portfolio: JSON.parse(sessionStorage.getItem('portfolio')),
      percentageData: -258,
      value: "$3,252,737.08",
      stdDev: 15.43,
      sharpeRatio: 2.5,
      activeReturn: 159,
      benchMark: "S&P stock name info",
    };
  },
  components: {
    AttributionChart,
    PortfolioValueChart,
    dataBox,
    ExposureChart,
    stocksTable,
    AssetsPieChart,
  },
};
</script>

<style scoped>
.data-box {
  margin: 10px 0 10px 0;
  padding: 5px;
  border-radius: 5px;
}
</style>
