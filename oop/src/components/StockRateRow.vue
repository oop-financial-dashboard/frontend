<template>
  <div class="flex flex-row" style="height: 38px">
    <img class="my-1.5" src="../assets/apple.svg" style="height: 30px;width: 30px" alt=""/>
    <div class="flex-fill ml-1">
      <div class="flex flex-col space-y-0.5">
        <div class="d-flex flex-row justify-content-between min-h-min">
          <p class="text-base">Apple</p>
          <p class="text-base">$105</p>
        </div>
        <div class="d-flex flex-row justify-content-between min-h-min">
          <p class="text-sm text-slate-500">APPL</p>
          <p class="text-sm">-3.4%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StockRateRow"
}
</script>
<style scoped>

</style>