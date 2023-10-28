<template>
  <main>
    <div>
      <h1>Portfolio 1</h1>
    </div>

    <div class="row-section border data-box">
      component of boxes for stats should be here
    </div>

    <div class="time-series-graph border data-box">time series graph</div>

    <div
      class="row-exposusure-and-assets border data-box d-flex justify-content-between"
    >
      <div>exposure</div>
      <div>assets pie chart</div>
    </div>

    <div class="performance-attribution-graph border data-box"> performance-attribution-graph</div>

    <div class="stocks border data-box">stocks</div>
  </main>
</template>

<script>
export default {
  methods: {},
};
</script>

<style scoped>
.data-box {
  margin: 10px 0 10px 0;
  padding: 5px;
  border-radius: 5px;
}
</style>
