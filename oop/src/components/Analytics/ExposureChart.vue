<template>
  <highcharts
      class="h-50"
      :options="chartOptions"
  >
  </highcharts>
</template>

<script>
  export default {
    name: "exposureChart",
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

