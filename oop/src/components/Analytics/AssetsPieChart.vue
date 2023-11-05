<template>
  <highcharts class="h-50" :options="chartOptions"> </highcharts>
</template>

<script>
export default {
  name: "assetsPieChart",
  props: {portfolio: Object},
  created() {
    const portfolioValue = this.portfolio.totalValue;
    let assetProportionData = [];
    this.portfolio.stocks.forEach(stock => {
      const percentage = parseFloat((stock.value * 100/portfolioValue).toPrecision(4));
      assetProportionData.push({
        name: stock.symbol,
        y: percentage
      })
    })
    this.chartOptions.series[0].data = assetProportionData;
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "pie",
        },
        title: {
          text: "Asset Allocation",
        },
        tooltip: {
          valueSuffix: "%",
        },
        plotOptions: {
          series: {
            animation: {
              duration: 1500,
            },
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: [
              {
                enabled: true,
                distance: 20,
              },
              {
                enabled: true,
                distance: -40,
                format: "{point.percentage:.1f}%",
                style: {
                  fontSize: "1.2em",
                  textOutline: "none",
                  opacity: 0.7,
                },
                filter: {
                  operator: ">",
                  property: "percentage",
                  value: 10,
                },
              },
            ],
          },
        },
        // colors: ["#BAAFFF", "#BCE29E", "#FF9EC8", "#87E1FE", "#FFF59C"],
        series: [
          {
            name: "Percentage",
            colorByPoint: true,
            data: [
              {
                name: "META",
                y: 55.02,
              },
              {
                name: "AAPL",
                y: 26.71,
              },
              {
                name: "TSLA",
                y: 1.09,
              },
              {
                name: "AMZN",
                y: 15.5,
              },
              {
                name: "GOOGL",
                y: 1.68,
              },
            ],
          },
        ],
      },
    };
  },
};
</script>

<style scoped></style>
