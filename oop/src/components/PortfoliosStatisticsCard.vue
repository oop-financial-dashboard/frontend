<template>
  <div class="card w-68 h-56 bg-white rounded-xl min-h-min">
    <div class="card-body flex flex-col space-y-3">
      <p class="text-lg font-bold">Overall Portfolio Statistics</p>

      <div class="flex flex-row justify-between">
        <p class="">Total Value</p>
        <p class="font-medium">${{ totalValue }}</p>
      </div>

      <div class="flex flex-row justify-between">
        <p>Number of Portfolios</p>
        <p>{{ numOfPortfolios }}</p>
      </div>

      <div class="flex flex-row justify-between">
        <p>% Change</p>
        <p>{{ percentageChange }}</p>
      </div>

      <div class="flex flex-row justify-between">
        <p>Total PnL</p>
        <p>{{ totalPnL }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PortfoliosStatisticsCard",
  props: {
    portfolios: Object,
  },
  data() {
    return {
      totalValue: 0,
      numOfPortfolios: 0,
      percentageChange: 0,
      totalPnL: 0
    }
  },
  created() {
    this.numOfPortfolios = Object.entries(this.portfolios).length;
    this.setTotalValue(this.portfolios);
  },
  methods: {
    setTotalValue(portfolios) {
      const portfoliosData = Object.values(portfolios);
      let value = 0;
      portfoliosData.forEach(data => {
        value += data.totalValue;
      });
      value = Number((value).toFixed(0));
      this.totalValue = (value).toLocaleString();
    }
  }
}
</script>

<style scoped></style>
