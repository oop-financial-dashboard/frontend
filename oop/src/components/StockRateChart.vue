<template>
  <div class="card bg-white min-h-min rounded-xl" style="width: 392px; height:570px">
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