<template>
  <chart
      class="h-50"
      :options="chartOptions">
  </chart>
</template>

<script>

  import {Chart} from "highcharts-vue";

  export default {
    name: "exposureChart",
    components: {
      chart: Chart
    },
    data() {
      return  {
        chartOptions: {
          chart: {
            type: "column"
          },
          title: {
            text: "Sector Exposure"
          },
          series: [{
            data: [1, 2, 3] // sample data
          }]
        }
      }
    }
  }
</script>

<style scoped>

</style>

