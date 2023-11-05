<template>
  <select v-model="seriesToShow">
    <option value="attribution">Attribution</option>
    <option value="allocation">Allocation</option>
    <option value="selection">Selection</option>
    <option value="interaction">Interaction</option>
  </select>
  <highcharts
      class="h-100"
      :options="chartOptions"
  >
  </highcharts>
</template>

<script>

import Highcharts from "highcharts";
export default {
  name: "AttributionChart",
  created() {
    const fetchAppleCData = async() => {
      const data = await fetch('https://demo-live-data.highcharts.com/aapl-c.json')
          .then(response => response.json());
      this.seriesData[0].data = data;
      this.chartOptions.series[0].data = data;
    }
    const fetchAppleVData = async() => {
      this.seriesData[1].data = await fetch('https://demo-live-data.highcharts.com/aapl-v.json')
          .then(response => response.json());
    }
    const fetchAppleOData = async() => {
      this.seriesData[2].data = await fetch('https://demo-live-data.highcharts.com/aapl-c.json')
          .then(response => response.json());
    }
    fetchAppleCData();
    fetchAppleVData();
    fetchAppleOData();
  },
  data() {
    return {
      seriesToShow: "attribution",
      seriesData: [{
        name: 'Attribution Data',
        id: 'attribution',
        data: null,
        color: Highcharts.getOptions().colors[0]
      }, {
        name: 'Allocation Data',
        id: 'allocation',
        data: null,
        color: Highcharts.getOptions().colors[1]
      }, {
        name: 'Selection Data',
        id: 'selection',
        data: null,
        color: Highcharts.getOptions().colors[2]
      }, {
        name: 'Interaction Data',
        id: 'interaction',
        data: null,
        color: Highcharts.getOptions().colors[3]
      }],
      chartOptions: {
        title: {
          text: "Attribution Effect"
        },
        plotOptions: {
          series: {
            animation: {
              duration: 3000
            }
          }
        },
        navigator: {
          enabled: false
        },
        series: [{
          name: 'Attribution Data',
          id: 'attribution',
          data: null,
          color: Highcharts.getOptions().colors[0]
        }]
      }
    }
  },
  methods: {
    updateSeries(updatedSeries) {
      this.chartOptions.series = [updatedSeries];
    }
  },
 watch: {
    seriesToShow(newValue) {
      switch (newValue){
        case("allocation"):
          this.updateSeries(this.seriesData[1]);
          this.chartOptions.title.text = "Allocation Effect";
          break;
        case ("interaction"):
          this.updateSeries(this.seriesData[2]);
          this.chartOptions.title.text = "Interaction Effect";
          break;
        default:
          this.updateSeries(this.seriesData[0]);
          this.chartOptions.title.text = "Attribution Effect";
      }
    }
  }
}
</script>

<style scoped>

</style>