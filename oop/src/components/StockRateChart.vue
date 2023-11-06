<template>
  <div class="card bg-white border-1" style="width: 315px; height: 428px">
    <div class="card-body">
<!--      <div style="width: 100%; height: 100%; background: white; border-radius: 12px; border: 0.70px #DFE5F9 solid"></div>-->
      <p class="fs-4 fw-medium ms-2">Stock Rates</p>
      <div>
        <stock-rate-row />
      </div>
    </div>
  </div>
</template>

<script>
import StockRateRow from "@/components/StockRateRow.vue";

export default {
  name: "StockRateChart",
  components: {StockRateRow}
}
</script>

<style scoped>

</style>