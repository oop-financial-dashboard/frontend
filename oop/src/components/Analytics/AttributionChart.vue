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
            // console.log("portoflio stocks", portfolioStocks);

            this.stocks = portfolioStocks.stocks.sort(
              (a, b) => b.value - a.value
            );
            this.stockSymbol = this.stocks[0]["symbol"];
            // const endDate = 1685967600;
            axios
              .post(
                `/stock/historicals`,
                {
                  symbol: this.stockSymbol,
                  start: "2023-01-01",
                  end: "2023-11-03",
                },
                config
              )
              .then((response) => {
                if (response.status === 200) {
                  console.log("stock-historicals", response.data);

                  for (let i = 0; i < response.data.length; i++) {
                    this.stockPlot.push([
                      new Date(response.data[i]["timestamp"]).getTime(),
                      parseFloat(response.data[i]["close"]),
                    ]);
                  }

                  console.log("STOCKPLOT", this.stockPlot);
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
  },
  watch: {},
};
</script>

<style scoped></style>
