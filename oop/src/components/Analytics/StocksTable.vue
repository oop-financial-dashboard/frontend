User
<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">Symbol | Name</th>
        <th scope="col">Quantity</th>
        <th scope="col">Avg. Price</th>
        <th scope="col">Total Value</th>
        <th scope="col">Unrealised PnL</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(stock, key) in stocks" :key="key">
        <td>{{stock.symbol}} {{ getStockName(stock.symbol) }}</td>
        <td>{{stock.quantity}}</td>
        <td>${{formatPrice(stock.averagePrice)}}</td>
        <td>${{formatPrice(stock.value)}}</td>
        <td :style="updateProfitLossColour(stock.pl)">{{ stock.pl }}%</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from "axios";

export default {
  name: "stocks-table",
  props: { portfolioStocks: Object },
  data() {
    return {
      profitLossData: {},
      stocks: {}, // Create a copy of the prop
    };
  },
  created() {
    this.stocks = JSON.parse(JSON.stringify(this.portfolioStocks)); // Create a deep copy of the prop

    const token = sessionStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // An array to store the results for each stock
    const stockDataPromises = [];

    // Loop through each stock in the portfolioStocks array
    this.stocks.forEach(stock => {

      // Create an Axios request to fetch the closing price for each stock
      const closingPriceRequest = axios.post("/stock/price", { "symbol": stock.symbol, "timestamp": this.getYesterdayDate() }, config);

      // Create an Axios request to get available stocks
      const getAvailableStocksRequest = axios.get("/stock/available-stocks", config);
      
      // Use Promise.all to handle the request for each stock
      stockDataPromises.push(
        Promise.allSettled([
          closingPriceRequest,
          getAvailableStocksRequest
        ]).then(responses => {

          console.log(responses);

          // Find the index of the stock based on its symbol
          const stockIndex = this.stocks.findIndex(s => s.symbol === stock.symbol);

          if (stockIndex !== -1) {

            // Check if responses[0].data is null - no price available for yesterday closing price
            if (responses[0].status === 'fulfilled' && responses[0].value.data) {
              // Process the closing price for each stock here
              console.log(responses[0]);
              const closePrice = responses[0].value.data.close;
              //console.log("Close price:" + closePrice);
              const initialPrice = this.stocks[stockIndex].averagePrice;
              const profitLoss = this.calculateProfitLoss(initialPrice, closePrice);
              let formattedNumber = (profitLoss > 0 ? '+' : '') + profitLoss;
              this.stocks[stockIndex].pl = formattedNumber;
              this.updateProfitLossColour(profitLoss);
            } else {
              this.stocks[stockIndex].pl = 'N.A';
            }

            if (responses[1].status === 'fulfilled' && responses[1].value.data) {
              const availableStocks = responses[1].value.data;
              const stockSymbol = this.stocks[stockIndex].symbol;
              const stockName = this.getStockName(availableStocks, stockSymbol);
              this.stocks[stockIndex].symbol = stockSymbol + " | " + stockName;
            } else {
              console.log("Failed to fetch available stocks or no data available.");
            }
          }
        })
      );
    });

    // Use Promise.all to wait for all stock data requests to complete
    Promise.allSettled(stockDataPromises)
      .catch(error => {
        console.error("Error fetching closing prices for stocks:", error);
      });
  },
  methods: {
    getYesterdayDate() {
      // Construct the timestamp dynamically based on yesterday date and time
      const today = new Date(); // Create a new Date instance with the current date and time
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Subtract one day

      const year = yesterday.getFullYear();
      const month = (yesterday.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1
      const day = yesterday.getDate().toString().padStart(2, '0');

      const timestamp = `${year}-${month}-${day}`;

      return timestamp;
    },
    getStockName(stockList, stockSymbol) {
      if (Array.isArray(stockList)) {
        const stock = stockList.find((item) => item.symbol === stockSymbol);
        if (stock) {
          return stock.name;
        }
      }
    },
    formatPrice(price) {
      return Number(price).toLocaleString();
    },
    calculateProfitLoss(initialPrice, purchasePrice) {
      const profitLoss = ((initialPrice - purchasePrice)/purchasePrice) * 100;
      if (profitLoss > 0) {
        return parseFloat(profitLoss).toFixed(2);
      }
      return parseFloat(profitLoss).toFixed(2);
    },
    updateProfitLossColour(profitLoss) {
      if (profitLoss > 0) {
        return { color: '#16A34A' }; // Positive profit, set text color to green
      } else if (profitLoss < 0) {
        return { color: '#DC2626' }; // Negative profit, set text color to red
      }
      return {} // 0 change in profit
    }
  }
};
</script>
