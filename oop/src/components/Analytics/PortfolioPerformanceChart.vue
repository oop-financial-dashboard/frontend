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
import axios from "axios";

export default {
  name: "PortfolioPerformanceChart",
  props: ['portfolioId'],
  created() {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("user_id");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchPortfolioData = async() => {
      const data = await axios.get(`/portfolio/get-historicals/${userId}/${this.portfolioId}`, config);
      console.log("portfolio historical ----->", data.data.data[this.portfolioId]);
      this.stockOptions.series[0].data = data.data.data[this.portfolioId];
    }
    fetchPortfolioData();
  },
  data() {
    return {
      stockOptions: {
        plotOptions: {
          series: {
            animation: {
              duration: 3000
            },
            enableMouseTracking: false
          }
        },
        navigator: {
          enabled: false
        },
        series: [{
          name: "Stock Price",
          data: null,
          type: 'area',
          threshold: null,
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
        }],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 100
            },
            chartOptions: {
              chart: {
                height: 300
              },
              subtitle: {
                text: null
              },
              navigator: {
                enabled: false
              }
            }
          }]
        },
        xAxis: {
          visible: false
        },
        yAxis: {
          visible: false
        },
        scrollbar: {
          enabled: false
        },
        rangeSelector: {
          enabled: false
        },
        chart : {
          zooming: {
            mouseWheel: false
          },
          setSize: 200
        },
        tooltip: {
          enabled: false
        },
      }
    }
  }
}
</script>

<style scoped>

</style>
