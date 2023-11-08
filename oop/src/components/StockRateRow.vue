<template>
  <div class="flex flex-row my-2.5 " style="height: 38px">
    <div v-if="name.length === 0" class="bg-slate-200 animate-pulse h-8 w-8 my-1"></div>
    <img v-else class="my-1.5" :src="require(`@/assets/${symbol}.svg`)" style="height: 30px;width: 30px" alt=""/>
    <div class="flex-fill ml-1">
      <div class="flex flex-col" :class="[name.length === 0 ? 'space-y-3' : 'space-y-0.5']">
        <div class="d-flex flex-row justify-content-between min-h-min">
          <div v-if="name.length === 0" class="bg-slate-200 animate-pulse rounded-sm h-4 text-transparent">Name is loading...</div>
          <p v-else class="text-base">{{ name }}</p>
          <div v-if="name.length === 0" class="bg-slate-200 animate-pulse rounded-sm h-4 text-transparent">Price.....</div>
          <p v-else class="text-base">${{ price }}</p>
        </div>
        <div class="d-flex flex-row justify-content-between min-h-min">
          <div v-if="name.length === 0" class="bg-slate-200 animate-pulse rounded-sm h-3 text-transparent">Ticker</div>
          <p v-else class="text-sm font-medium text-slate-500">{{ symbol }}</p>
          <div v-if="name.length === 0" class="bg-slate-200 animate-pulse rounded-sm h-3 text-transparent">%Chg</div>
          <p v-else class="text-sm" :class="[change > 0 ? 'text-green-600' : 'text-red-600']">{{ change }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "StockRateRow",
  props: {
    stock: Array,
  },
  created() {
    this.getDate('today');
    this.getDate('yesterday');
    this.symbol = this.stock[0];
    const token = sessionStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.all([
      axios.post("/stock/price", { "symbol": this.stock[0], "timestamp": "2023-11-07" }, config),
      axios.post("/stock/price", { "symbol": this.stock[0], "timestamp": "2023-11-06" }, config),
      axios.get(`/stock/description/${this.stock[0]}`, config)
    ]).then(axios.spread((currentDayInfo, previousDayInfo, stockDescription) => {
      // Both requests are now complete
      this.price = parseFloat(currentDayInfo.data.close).toFixed(2);
      this.change = this.calculcateChange(currentDayInfo.data, previousDayInfo.data);
      this.name = stockDescription.data.name;
    }));
  },
  data() {
    return {
      name: '',
      price: 0,
      symbol: '',
      change: 0,
    }
  },
  methods : {
    getDate(day) {
      // TODO: Return 30/31 of previous month when today is 1st
      const current = new Date();
      const yyyy = current.getFullYear();
      let mm = current.getMonth() + 1; // Months start at 0!
      let dd = current.getDate() -1;
      let yd = current.getDate()-2;

      if (day === 'today') {
        if (dd < 10) dd = '0' + dd;
      } else if (day === 'yesterday') {
        if (dd < 10) dd = '0' + yd;
      }
      if (mm < 10) mm = '0' + mm;
      return yyyy + '-' + mm + '-' + dd;
    },
    calculcateChange(currentData, previousData) {
      const currentPrice = parseFloat(currentData.close);
      const previousPrice = parseFloat(previousData.close);
      const change = Number((currentPrice-previousPrice)*100 / previousPrice).toFixed(2)
      return change > 0 ? '+' + change : change;
    }
  }
}
</script>
<style scoped>

</style>