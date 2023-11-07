<template>
  <div class="card w-68 h-56 bg-white border-1 min-h-min rounded-xl">
    <div class="card-body flex flex-col space-y-3">
      <p class="text-lg font-bold">{{ title }}</p>
      <p class="text-lg ">Portfolio Name</p>

      <div class="flex flex-row justify-between">
        <p class="text-blue-600">$12,345,6789</p>
        <p class="">2.65%</p>
      </div>

      <portfolio-performance-chart portfolio-id="CheckAMA" />
    </div>
  </div>
</template>
<script>
import PortfolioPerformanceChart from "@/components/Analytics/PortfolioPerformanceChart.vue";

export default {
  name: "PortfolioPerformanceCard",
  components: {PortfolioPerformanceChart},
  props: {
    title: String,
    portfolio: Object
  }
}
</script>

<style scoped>

</style>