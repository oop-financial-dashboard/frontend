<template>
  <div class="card bg-white border-1 min-h-min shadow-xl shadow-slate-400" style="width: 315px">
    <div class="card-body">
      <p class="fs-4 fw-medium ms-2">Stock Rates</p>
      <div v-for="stock in popularStocks" :key="stock">
        <stock-rate-row :stock="stock"/>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import StockRateRow from "@/components/StockRateRow.vue";

export default {
  name: "StockRateChart",
  props: {
    popularStocks: Array
  },
  components: {StockRateRow},
}
</script>

<style scoped>

</style>