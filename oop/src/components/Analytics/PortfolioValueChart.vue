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
 created() {
    const fetchPortfolioData = async() => {
      const data = await fetch('https://demo-live-data.highcharts.com/aapl-c.json')
                          .then(response => response.json());
      this.stockOptions.series[0].data = data;
      this.stockOptions.title.text = "AAPL";
    }
    fetchPortfolioData();
  },
  data() {
    return {
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