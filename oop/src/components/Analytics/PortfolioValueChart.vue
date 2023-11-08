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
  name: "PortfolioValueChart",
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
      // console.log("portfolio historical ----->", data.data.data[this.portfolioId]);
      this.stockOptions.series[0].data = data.data.data[this.portfolioId];
      this.stockOptions.title.text = `${this.portfolioId} Value`;
    };
    fetchPortfolioData();
  },
  data() {
    return {
      stockOptions: {
        title: {
          text: "Portfolio Name",
        },
        plotOptions: {
          series: {
            animation: {
              duration: 3000,
            },
          },
        },
        navigator: {
          enabled: false,
        },
        series: [
          {
            name: "Stock Price",
            data: null,
            type: "area",
            threshold: null,
            tooltip: {
              valueDecimals: 2,
            },
            lineWidth: 2,
            color:Highcharts.getOptions().colors[0],
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                  1,
                  Highcharts.color(Highcharts.getOptions().colors[0])
                    .setOpacity(0)
                    .get("rgba"),
                ],
              ],
            },
          },
        ],
      },
    };
  },
};
</script>
<style scoped></style>
