<template>
  <highcharts
    class="h-100"
    :constructor-type="'stockChart'"
    :options="stockOptions"
  >
  </highcharts>
</template>

<script>
import axios from "axios";
import Highcharts from "highcharts";
export default {
  name: "stock-analysis",
  created() {
    this.getTopStocks();
  },

  data() {
    return {
      stockOptions: {
        title: {
          text: `Most Valued Stock Analysis`,
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
            name: "Value",
            id: "topstock",
            data: null,
            color: Highcharts.getOptions().colors[8],
            threshold: null,
            tooltip: {
              valueDecimals: 2,
            },
            lineWidth: 3,
          },
        ],
      },

      stocks: [],
      stockSymbol: "",

      stockPlot: [],
    };
  },
  methods: {
    getTopStocks() {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const user_id = sessionStorage.getItem("user_id");
      const portfolioId = sessionStorage.getItem("portfolioId");

      axios
        .get(`/portfolio/get-all/${user_id}`, config)
        .then((response) => {
          if (response.status === 200) {
            // console.log("portfolio data", response.data);

            let portfolioStocks = response.data.portfolios[portfolioId];
            console.log("portoflio stocks", portfolioStocks);

            this.stocks = portfolioStocks.stocks.sort(
              (a, b) => b.value - a.value
            );
            this.stockSymbol = this.stocks[0]["symbol"];
            this.stockDateAdded = this.stocks[0]["dateAdded"];
            // const endDate = 1685967600;
            axios
              .post(
                `/stock/historicals`,
                {
                  symbol: this.stockSymbol,
                  start: this.stockDateAdded,
                  end: this.getDate('today'),
                },
                config
              )
              .then((response) => {
                if (response.status === 200) {

                  for (let i = 0; i < response.data.length; i++) {
                    this.stockPlot.push([
                      new Date(response.data[i]["timestamp"]).getTime(),
                      parseFloat(response.data[i]["close"]),
                    ]);
                  }

                  this.stockOptions.series[0].data = this.stockPlot;
                  this.stockOptions.title.text = `Most Valued Stock Analysis for ${this.stockSymbol}`;
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getDate(day) {
      // TODO: Return 30/31 of previous month when today is 1st
      const current = new Date();
      const yyyy = current.getFullYear();
      let mm = current.getMonth() + 1; // Months start at 0!
      let dd = current.getDate() -1;
      let yd = current.getDate()-2;

      if (day === 'today') {
        if (dd < 10) dd = '0' + dd;
      } else if (day === 'yesterday') {
        if (dd < 10) dd = '0' + yd;
      }
      if (mm < 10) mm = '0' + mm;
      return yyyy + '-' + mm + '-' + dd;
    },
  },
  watch: {},
};
</script>

<style scoped></style>
