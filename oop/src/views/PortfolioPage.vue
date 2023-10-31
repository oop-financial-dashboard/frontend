<template>
  <main>
    <div>
      <h1>Portfolio 1</h1>
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

<<<<<<< HEAD
    <div class="time-series-graph border data-box">time series graph</div>

    <div class="border d-flex h-auto">
      <exposure-chart/>
      <div>assets pie chart</div>
    </div>

    <div class="performance-attribution-graph border data-box">
      performance-attribution-graph
=======
    <div class="time-series-graph data-box bg-white p-4">
<!--      <header class="mb-1">Time Series Graph</header>-->
      <portfolio-value-chart class="rounded" />
    </div>

    <div class="d-flex h-auto justify-content-between">
      <!-- this exposure chart should be part of the div for all the alignments and padding to apply -->
      <exposure-chart class="rounded" />

      <div class="bg-white data-box p-4">
        <header class="mb-1">Assets Pie Chart</header>
      </div>
>>>>>>> 88e0400 (Registerd HighCharts to App.vue instead and implemented portfolio value chart without data)
    </div>

    <div class="stocks border data-box">stocks</div>
  </main>
</template>

<script>
<<<<<<< HEAD
import dataBox from "@/components/dataBox.vue";
<<<<<<< HEAD
=======
import ExposureChart from "@/components/Analytics/ExposureChart.vue";
import StocksTable from "@/components/Analytics/StocksTable.vue";
import PortfolioValueChart from "@/components/Analytics/PortfolioValueChart.vue";

>>>>>>> 88e0400 (Registerd HighCharts to App.vue instead and implemented portfolio value chart without data)
export default {
  data() {
    return {
      percentageData: -258,
      value: "$3,252,737.08",
      stdDev: 15.43,
      sharpeRatio: 2.5,
      activeReturn: 159,
      benchMark: "S&P stock name info",
    };
  },
  components: {
    PortfolioValueChart,
    dataBox,
  },
=======
import ExposureChart from "@/components/Analytics/ExposureChart.vue";

export default {
  components: {ExposureChart},
>>>>>>> 183a730 (Implemented sample chart for exposure and installed highcharts-vue)
  methods: {},
};
</script>

<style scoped>
.data-box {
  margin: 10px 0 10px 0;
  padding: 5px;
  border-radius: 5px;
}
</style>
