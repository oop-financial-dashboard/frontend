<template>
  <div class="card w-68 h-56 bg-white border-1 min-h-min rounded-xl">
    <div class="card-body flex flex-col space-y-3">
      <p class="text-lg font-bold">{{ title }}</p>
      <p v-if="details" class="text-lg">{{ name }}</p>

      <hr
        class="mb-0 mt-0 rounded header-line"
        :style="{ borderColor: getTitleColor() }"
      />
      <p class="text-lg">Portfolio Name</p>
      <div class="flex flex-row justify-between">
        <p class="text-blue-600">${{ portfolioValue }}</p>
        <p
          v-if="details"
          :class="[change > 0 ? 'text-green-600' : 'text-red-600']"
        >
          {{ displayPercentageChange }}
        </p>
      </div>

      <portfolio-performance-chart :portfolio-id="name" />
    </div>
  </div>
</template>
<script>
import PortfolioPerformanceChart from "@/components/Analytics/PortfolioPerformanceChart.vue";

export default {
  name: "PortfolioPerformanceCard",
  components: { PortfolioPerformanceChart },
  props: {
    title: String,
    details: Array,
    value: Number,
  },
  created() {
    this.name = this.details[0];
    this.change = this.details[1];
    this.displayPortfolioValue(this.value);
  },
  data() {
    return {
      name: "",
      change: 0,
      portfolioValue: 0,
    };
  },
  methods: {
    displayPortfolioValue(value) {
      // value = Number((value).toFixed(0));
      // this.portfolioValue = (value).toLocaleString();
      this.portfolioValue = value;
    },
  },
  computed: {
    displayPercentageChange() {
      if (this.change > 0) {
        return "+" + this.change.toFixed(2) + "%";
      }
      return this.change.toFixed(2) + "%";
      // portfolio: Object;
    },
    methods: {
      getTitleColor() {
        if (this.title === "Best Performing Portfolio") {
          return "#29CC97"; // Green color
        } else if (this.title === "Worst Performing Portfolio") {
          return "#FF616B"; // Red color
        } else {
          // Default color if neither of the conditions is met
          return "#000000"; // Black color
        }
      },
    },
  },
};
</script>

<style scoped>
.header-line {
  width: 40px;
  border-top: 3px solid;
  opacity: 1;
}
</style>
