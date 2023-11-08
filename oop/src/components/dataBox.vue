<template>
  <div
    class="databox rounded border d-flex flex-column py-auto align-items-center justify-content-center"
  >
    <header>{{ title }}</header>
    <p class="percentage-data" :class="getColour()" style="font-weight: bold">
      {{ addUnits ? `${displayValue} %` : displayValue }}
    </p>
    <p class="bench-mark">{{ benchMark }}</p>
    <p class="value" :class="getColour()">{{ value }}</p>
  </div>
</template>

<script>
export default {
  name: "data-box",
  props: {
    title: String,
    displayValue: Number,
    benchMark: String,
    value: Number,
  },
  data() {
    return {
      addUnits: false,
    };
  },
  methods: {
    getColour() {
      if (this.title == "Standard Deviation" || this.title == "Sharpe Ratio") {
        return "text-dark";
      } else if (this.displayValue > 0) {
        return "text-success";
      } else if (this.displayValue < 0) {
        return "text-danger";
      }
    },
  },
  created() {
    if (this.title === "Price Return / Year" || this.title === "Compound Annual Growth Rate" || this.title === "Active Return / Year") {
      this.addUnits = true;
    }
  },
};
</script>
<style scoped>
.databox {
  width: 300px;
  height: 100px;
  text-align: center;
  background-color: white;
}
p {
  margin: 0;
  font-size: medium;
  font-weight: bold;
}
.percentage-data {
  font-size: x-large;
}
header {
  font-size: medium;
}
.bench-mark {
  font-weight: normal;
  color: gray;
}
</style>
