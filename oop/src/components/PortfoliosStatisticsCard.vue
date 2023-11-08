<template>
  <div class="card w-68 h-56 bg-white rounded-xl min-h-min">
    <div class="card-body flex flex-col space-y-3">
      <p class="text-lg font-medium">Overall Portfolio Statistics</p>
      <hr class="mb-0 mt-0 rounded header-line" />

      <div class="flex flex-row justify-between">
        <p class="">Total Value</p>
        <p class="font-medium">${{ totalValue }}</p>
      </div>

      <div class="flex flex-row justify-between">
        <p>Number of Portfolios</p>
        <p>{{ numOfPortfolios }}</p>
      </div>

      <div class="flex flex-row justify-between">
        <p>Change</p>
        <p :class="[change > 0 ? 'text-green-600' : 'text-red-600']">{{ setPercentageChange }}%</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "PortfoliosStatisticsCard",
  props: {
    portfolios: Object,
    change: Number,
    assetsValue: Object
  },
  data() {
    return {
      totalValue: 0,
      numOfPortfolios: 0,
      percentageChange: 0,
      totalPnL: 0,
    };
  },
  created() {
    this.numOfPortfolios = Object.entries(this.portfolios).length;
    this.setTotalValue(this.assetsValue);
  },
  methods: {
    setTotalValue(latestPrices) {
      const currentAssetsValue = Object.values(latestPrices);
      let value = 0;
      currentAssetsValue.forEach((asset) => {
        value += asset[1];
      });
      value = Number((value).toFixed(0));
      this.totalValue = (value).toLocaleString();
    }
  },
  computed: {
    setPercentageChange() {
      if (this.change > 0) {
       return '+' + Number((this.change).toFixed(2));
      } else {
        return Number((this.change).toFixed(2));
      }
    }
  }
}
</script>

<style scoped>
.header-line {
  width: 40px;
  border-top: 3px solid #5e6eff;
  opacity: 1;
}
</style>
