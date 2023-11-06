<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">Symbol | Name</th>
        <th scope="col">Quantity</th>
        <th scope="col">Avg. Price</th>
        <th scope="col">Value</th>
        <th scope="col">Unrealised PnL</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(stock, key) in portfolioStocks" :key="key">
        <td>{{stock.symbol}}</td>
        <td>{{stock.quantity}}</td>
        <td>{{(stock.averagePrice).toFixed(2)}}</td>
        <td>{{(stock.value).toFixed(0)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "stocks-table",
  props: {portfolioStocks: Object}
};
</script>

<style scoped></style>
