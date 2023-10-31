<template>
  <highcharts
      class="h-100"
      :constructor-type="'stockChart'"
      :options="stockOptions"
  >
  </highcharts>
</template>

<script>


export default {
  name: "PortfolioValueChart",
  data() {
    return {
      chartData: null,
      stockOptions: {
        title: {
          text: "Portfolio Name"
        },
        series: [{
          data: this.chartData,
          tooltip: {
            valueDecimals: 2
          }
        }]
      }
    }
  }
}
</script>
<style scoped>

</style>