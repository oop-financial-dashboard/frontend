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

    <div class="time-series-graph border data-box">time series graph</div>

    <div class="border d-flex h-auto">
      <exposure-chart/>
      <div>assets pie chart</div>
    </div>

    <div class="performance-attribution-graph border data-box">
      performance-attribution-graph
    </div>

    <div class="stocks border data-box">stocks</div>
  </main>
</template>

<script>
<<<<<<< HEAD
import dataBox from "@/components/dataBox.vue";
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
