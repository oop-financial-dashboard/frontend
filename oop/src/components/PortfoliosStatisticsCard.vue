<template>
  <div class="card w-68 h-56 bg-white border-1 min-h-min shadow-xl shadow-slate-400">
    <div class="card-body flex flex-col space-y-3">
      <p class="text-lg font-bold">Overall Portfolio Statistics</p>

      <div class="flex flex-row justify-between">
        <p class="">Total Value</p>
        <p class="font-medium">$123,456,789</p>
      </div>

      <div class="flex flex-row justify-between">
        <p>Number of Portfolio</p>
        <p>18</p>
      </div>

      <div class="flex flex-row justify-between">
        <p>% Change</p>
        <p>2.54</p>
      </div>

      <div class="flex flex-row justify-between">
        <p>Total PnL</p>
        <p>123,456</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "PortfoliosStatisticsCard"
}
</script>

<style scoped>

</style>