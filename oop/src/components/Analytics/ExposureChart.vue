<template>
  <highcharts
      class="h-50"
      :options="chartOptions"
  >
  </highcharts>
</template>

<script>
  import axios from "axios";
  import Highcharts from "highcharts";

  export default {
    name: "exposureChart",
    props: {portfolioStocks: Object},
    created() {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let sectorExposureData = {};
      this.portfolioStocks.forEach(stock => {
        axios.get(`/stock/description/${stock.symbol}`, config)
            .then((response) => {
              if (response.status === 200) {
                const stockSector = response.data.sector;
                if (stockSector in sectorExposureData) {
                  sectorExposureData[stockSector] += 1;
                } else {
                  sectorExposureData[stockSector] = 1;
                }
              }
            })
            .then(() => {
              this.chartOptions.xAxis.categories = Object.keys(sectorExposureData);
              this.chartOptions.series[0].data = Object.values(sectorExposureData);
            });
      })
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
          xAxis: {
            categories: null
          },
          series: [{
            name: "Number of Unique Stocks",
            data: null,
          color: Highcharts.getOptions().colors[6],

          }]
        }
      }
    }
  }
</script>

<style scoped>

</style>

