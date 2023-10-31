<template>
  <highcharts
      class="h-100"
      :constructor-type="'stockChart'"
      :options="stockOptions"
  >
  </highcharts>
</template>

<script>

import Highcharts from "highcharts";

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
        plotOptions: {
          series: {
            animation: {
              duration: 1500
            }
          }
        },
        navigator: {
          enabled: false
        },
        series: [{
          data: null,
          type: 'area',
          threshold: null,
          tooltip: {
            valueDecimals: 2
          },
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          }
        }]
      }
    }
  }
}
</script>
<style scoped>

</style>