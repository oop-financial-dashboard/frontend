<template>
  <main class="aboutpage">
    <h1>{{portfolioName}}</h1>
    <div class="row">
      <div class="col-4">

        <p><b>Enter description (strategy):</b></p>
        <textarea class="textbox p-3" v-model="portfolioDesc"></textarea>

        <p class="mt-3"><b>Specify capital amount (USD):</b></p>
        <input type="number" class="textbox p-3" v-model="portfolioCapital"/>

      </div>
      <div class="col-8">
        <p>
          <b>Add existing/new stocks (can select multiple):</b>
          <span style="float: right;">Total: {{totalPriceComputed}}</span>
        </p>
        <MultiSelect
          id="multiselect"
          filter
          :maxSelectedLabels="3"
          v-model="newSelectedStocks"
          :options="stocks"
          optionLabel="name"
          placeholder="Select stocks"
          class="textbox p-3"
        />
        
        <table class="table mt-3">
          <thead>
            <tr>
              <th class="table-heading" scope="col">Stocks Selected</th>
              <th class="table-heading" scope="col">Pick a Date</th>
              <th class="table-heading" scope="col">Price</th>
              <th class="table-heading" scope="col">Enter Quantity</th>
              <th class="table-heading" scope="col">Capital %</th>
            </tr>
          </thead>
          <tbody>
            <!-- ######## EXISTING STOCKS ######## -->
            <tr v-for="(item, index) in existingStocks" :key="index">
              <td>{{ getStockName(item.symbol) }}</td>

              <!-- calender to pick date -->
              <td>
                <VueDatePicker
                  disabled
                  :unique-identifier="index" 
                  :key="'existingDate_' + index"
                  type="date"
                  v-model="item.dateAdded"
                  :enable-time-picker="false"            
                />
              </td>

              <!-- price -->
              <td>
                <input :key="'existingPrice_' + index" disabled v-model="item.averagePrice" type="number" class="table-input" />
              </td>

              <!-- qty to purchase per stock -->
              <td>
                <input :key="'existingQty_' + index" v-model="item.quantity" @change="changeQty(item)" type="number" class="table-input" />
              </td>

              <td>
                {{ capitalPerComputed(item.averagePrice, item.quantity) }}
              </td>

              <td>
                <font-awesome-icon class="clickable" @click="removeExistingStock(item.symbol, item)" :icon="['fas', 'x']"/>
              </td>
            </tr>

            <!-- ######## ADD NEW/EXISTING STOCKS ######## -->
            <tr v-for="(item, index) in newSelectedStocks" :key="index">
              <td>{{ item.name }}</td>

              <!-- calender to pick date: disabled for default -->
              <td>
                <VueDatePicker
                  :start-date="startDate" 
                  focus-start-date 
                  no-today 
                  :max-date="maxDate"
                  :unique-identifier="index" 
                  :key="'selectedDate_' + index"
                  type="date"
                  v-model="item.selectedDate"
                  :model-value="item.selectedDate"
                  @update:model-value="updateDate(item, index, $event)"
                  :enable-time-picker="false"
                />
              </td>

              <!-- price -->
              <td>
                <input :key="'selectedPrice_' + index" :disabled="item.disableFields" v-model="item.selectedPrice" :placeholder="item.defaultPrice" type="number" class="table-input" />
              </td>

              <!-- qty to purchase per stock -->
              <td>
                <input :key="'selectedQty_' + index" v-model="item.selectedQty" :disabled="item.disableFields" type="number" class="table-input" />
              </td>

              <td>
                {{ capitalPerComputed(item.selectedPrice === null || isNaN(item.selectedPrice) || item.selectedPrice === ""  ? item.defaultPrice : item.selectedPrice, item.selectedQty) }}
              </td>

              <td>
                <font-awesome-icon class="clickable" @click="removeNewStock(item.name)" :icon="['fas', 'x']"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="fixed-container">
      <div class="btn-container">
        <button class="btn btn-outline-dark" @click="updatePortfolio">
          Update
        </button>
      </div>
    </div>

    </main>
</template>

<script>
import axios from "axios";

import MultiSelect from "primevue/multiselect";
import "primevue/resources/themes/saga-blue/theme.css";

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faX } from "@fortawesome/free-solid-svg-icons";
library.add(faX);

import { ref } from "vue";

import { notify } from "@kyvg/vue3-notification";

export default {
  components: {
    MultiSelect, VueDatePicker
  },
  data() {
    return {
      stocks: ref(),
      newSelectedStocks: ref(),
      // originalStocks: ref(JSON.parse(sessionStorage.getItem("portfolio")).stocks),
      existingStocks: ref(),
      portfolioName: sessionStorage.getItem("portfolioId"),
      portfolioDesc: JSON.parse(sessionStorage.getItem("portfolio")).description,
      portfolioCapital: JSON.parse(sessionStorage.getItem("portfolio")).initialCapital,
      selectedDate: null,
      startDate: ref(new Date(new Date().setDate(new Date().getDate() - 1))),
      maxDate: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
      userEditedPrices: {}, // Object to hold user-edited prices by stock name
      selectedPrice: 0,
      defaultPrice: 0,
      customHigh:0,
      customLow: 0,
      closePrice: 0,
      selectedQty: 0,
      quantity: 0,
      allPortolios: '',
      removeExistingStocks: []
    };
  },
  computed: {
    totalPriceComputed() {
      let total = 0;
      let existingStocksTotal = this.calculateTotalForStocks(this.existingStocks, true);
      let newSelectedStocksTotal = this.calculateTotalForStocks(this.newSelectedStocks, false);

      if (existingStocksTotal === null || isNaN(existingStocksTotal)) {
        existingStocksTotal = 0;
      }

      if (newSelectedStocksTotal === null || isNaN(newSelectedStocksTotal)) {
        newSelectedStocksTotal = 0;
      }
      total = existingStocksTotal + newSelectedStocksTotal
      return total.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
  },
  mounted() {
    this.getAllAvailStocks();
    this.updateOGQuantity();
  },
  methods: {
    formatDate(date) {
      const originalDate = new Date(date);
      const year = originalDate.getFullYear();
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const day = originalDate.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
    capitalPerComputed(price, quantity) {
      let result = "N.A.";
      if (this.portfolioCapital > 0) {
        result = parseFloat(((price * quantity) / this.portfolioCapital) * 100).toFixed(2) + "%";
      }
      return result;
    },
    findDuplicateStocks(arr, propertyToCompare) {
      const uniqueValues = new Set();
      const duplicates = [];

      for (const item of arr) {
        const propertyValue = item[propertyToCompare];

        if (uniqueValues.has(propertyValue)) {
          duplicates.push(item);
        } else {
          uniqueValues.add(propertyValue);
        }
      }

      return duplicates;
    },
    updateOGQuantity() {
      this.existingStocks = JSON.parse(sessionStorage.getItem("portfolio")).stocks;
      this.existingStocks.forEach(stock => {
        stock.ogQuantity = stock.quantity;
      });
    },
    getStockName(stockSymbol) {
      if (this.stocks) {
        const stock = this.stocks.find(item => item.symbol === stockSymbol);

        if (stock) {
          return stock.name;
        }
      }
    },
    calculateTotalForStocks(stockList, isExisting) {
      let total = 0;
      if (stockList) {
        if (isExisting) {
          for (const stock of stockList) {
            total += stock.averagePrice * stock.quantity;
          }
        }
        else {
          for (const stock of stockList) {
            if (stock.selectedPrice === null || isNaN(stock.selectedPrice)) {
              // Use defaultPrice if selectedPrice is null
              total += stock.defaultPrice * stock.selectedQty;
            } else {
              total += stock.selectedPrice * stock.selectedQty;
            }
          }
        }
      }
      return total;
    },
    changeQty(item) {
      if (item.quantity < item.ogQuantity) {
        this.showNotification("notification", "Error", `Edited quantity must be more than or equal to original quantity ${item.ogQuantity}.`, "error");
      } 
    },
    updateDate(item, index, modelData) {
      // modelData refers to the selected/updated date
      this.getStockPrice(item.name, item.symbol, modelData, index);
    },
    // remove stocks from EXISTING stocks
    removeExistingStock(stockSymbol, removedStock) {
      if (this.existingStocks) {
        this.existingStocks = this.existingStocks.filter(stock => stock.symbol !== stockSymbol);
        this.removeExistingStocks.push(removedStock);
      }
    },
    // remove stocks from NEWLY ADDED stocks
    removeNewStock(stockName) {
      if (this.newSelectedStocks) {
        this.newSelectedStocks = this.newSelectedStocks.filter(stock => stock.name !== stockName);
      }
    },
    mergeStocks() {
      if (this.newSelectedStocks) {
        return [...this.existingStocks, ...this.newSelectedStocks];
      } else {
        return this.existingStocks;
      }
    },
    getAllAvailStocks() {
      const token = sessionStorage.getItem("token");
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

      // need to get specific user from login
      axios.get("/stock/available-stocks", config)
        .then((response) => {
          if (response.status === 200) {
            this.stocks = ref(response.data);
          }
        })
        .catch((err) => {
          console.error(err);
        })
    },
    getStockPrice(name, symbol, timestamp, index) {
      const token = sessionStorage.getItem("token");
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

      if (typeof timestamp !== 'undefined') {

        const formattedDate = this.formatDate(timestamp);
        const stockParams = { "symbol": symbol, "timestamp": formattedDate };
        
        axios.post("/stock/price", stockParams, config)
          .then((response) => {
            if (response.status === 200) {
              if (response.data == null) {
                // null e.g. no stock data for this date e.g. closing price
                const nullErrMessage = `No price for ${name} on ${formattedDate}, please select a different date.`; // Customize this error message as needed
                
                this.showNotification("notification", "Error", nullErrMessage, "error");

                // disable the fields
                this.newSelectedStocks[index].disableFields = true;
                this.newSelectedStocks[index].defaultPrice = 0;
                this.newSelectedStocks[index].selectedQty = 0;
              } else {
                // enable the fields because there is stock data for this date e.g. closing, high, and low price
                this.newSelectedStocks[index].disableFields = false;
                this.newSelectedStocks[index].defaultPrice = parseFloat(response.data.close).toFixed(2); // set as placeholder
                this.newSelectedStocks[index].customHigh = parseFloat(response.data.high).toFixed(2); 
                this.newSelectedStocks[index].customLow = parseFloat(response.data.low).toFixed(2); 
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    showNotification(group, title = "", text, type = "") {
      notify({
        group,
        title,
        type,
        text,
      });
    },
    async updatePortfolio() {

      // Validate portfolio information
      if (!this.portfolioDesc) {
        this.showNotification("notification", "Error", "Portfolio description is required.", "error");
        return;
      }

      if (this.portfolioCapital <= 0) {
        this.showNotification("notification", "Error", "Capital amount must be greater than 0.", "error");
        return;
      }

      let totalPriceComputed = this.totalPriceComputed;
      var priceMatch = totalPriceComputed.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/); // match up to a billion e.g. $1,234,567,890.12
      if (priceMatch) {
  
        // Extracted price as a string, e.g., "$25.99"
        var priceString = priceMatch[0];

        // Remove the "$" and "," sign and convert it to a double
        var priceTotal = priceString.replace("$", "");
        priceTotal = priceTotal.replace(",", "");
      
        if (parseFloat(priceTotal) > this.portfolioCapital) {
          this.showNotification("notification", "Error", `Total price cannot be more than capital price.`, "error");
          return; 
        }
      }

      // Validate quantity of stocks in a portfolio
      if (this.mergeStocks().length === 0) {
        this.showNotification("notification", "Error", "Add at least one stock to your portfolio.", "error");
        return;
      }

      // Initialize an array to store valid stocks
      const errorMessages = [];

      if (this.existingStocks) {
        for (let stock of this.existingStocks) {
          let hasError = false;
          
          // Check if user went ahead to leave qty field blank or 0 or less than ogQty despite the error message
          if (typeof stock.quantity === 'undefined' || stock.quantity <= 0 || stock.quanity < stock.ogQuantity) {
            hasError = true;
            errorMessages.push(hasError);
            this.showNotification("notification", "Error", `Invalid stock quantity, please check again.`, "error");
            return;
          } 
          else {
            hasError = false;
            errorMessages.push(hasError);
          }
        }
      }

      if (this.newSelectedStocks) {
        for (let stock of this.newSelectedStocks) {
          let hasError = false;

          if (stock.disableFields || stock.selectedQty <= 0 || typeof stock.selectedQty === 'undefined') {
            hasError = true;
            errorMessages.push(hasError);
            this.showNotification("notification", "Error", `Stock quantity for ${stock.name} cannot be empty, 0 or less.`, "error");
            return;
          } 
          else {
            hasError = false;
            errorMessages.push(hasError);
          }

          if (stock.selectedPrice !== null && !isNaN(stock.selectedPrice) && stock.selectedPrice !== "") {
            if (stock.selectedPrice < stock.customLow || stock.selectedPrice > stock.customHigh) {
              hasError = true;
              errorMessages.push(hasError);
              this.showNotification(
                "notification",
                "Error",
                `Invalid price. ${stock.name} Price should be between ${stock.customLow} and ${stock.customHigh}.`,
                "error"
              );
              return;
            }
          }
          else {
            hasError = false;
            errorMessages.push(hasError);
          }
        }
      }

      // All error messages are false, meaning there are no errors
      if (errorMessages.every(errorMessage => errorMessage === false)) {

        // console.log(this.existingStocks);
        // console.log(this.newSelectedStocks);
        // console.log(this.removeExistingStocks);
        
        // Format portfolioData and send the request
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const todayDate = `${year}-${month}-${day}`;
        
        const portfolioData = {
          userId: sessionStorage.getItem("user_id"),
          portfolioId: this.portfolioName,
          action: null,
          stocks: null,
          description: this.portfolioDesc,
          initialCapital: this.portfolioCapital,
          editedAt: todayDate,
        };

        // Remove existing stocks
        if (this.removeExistingStocks && this.removeExistingStocks.length > 0) {
          portfolioData.action = 'Remove';
          portfolioData.stocks = this.removeExistingStocks.map(stock => ({
            symbol: stock.symbol,
            quantity: stock.ogQuantity,
            dateAdded: stock.dateAdded,
            price: stock.averagePrice 
          }));

          // call the api
          await this.updatePortfolioAPI(portfolioData, 'Remove');
        }

        // Increase quantity of existing stocks and new stocks that are existing stocks
        if (this.existingStocks && this.existingStocks.length > 0) {
          portfolioData.action = 'Increase';
          const stocksWithQuantityChange = [];

          this.existingStocks.forEach(stock => {
            const quantityChange = stock.quantity - stock.ogQuantity;
            if (quantityChange !== 0) {
              stocksWithQuantityChange.push({
                symbol: stock.symbol,
                quantity: quantityChange,
                dateAdded: this.formatDate(stock.dateAdded),
                price: stock.averagePrice
              });
            }
          })

          // find existing stock (should be a value that appear twice in mergeStocks)
          const duplicateStocks = this.findDuplicateStocks(this.mergeStocks(), "symbol");
          duplicateStocks.forEach(stock => {
            stocksWithQuantityChange.push({
              symbol: stock.symbol,
              quantity: stock.selectedQty,
              dateAdded: this.formatDate(stock.selectedDate),
              price: stock.selectedPrice === null || isNaN(stock.selectedPrice) || stock.selectedPrice === ""  ? stock.defaultPrice : stock.selectedPrice
            })
          });

          // Add new stocks and does not exist in existing stocks
          if (this.newSelectedStocks && this.newSelectedStocks.length > 0) {
            portfolioData.action = 'Add';
            portfolioData.stocks = this.newSelectedStocks.map(stock => ({
                symbol: stock.symbol,
                quantity: stock.selectedQty,
                dateAdded: this.formatDate(stock.selectedDate),
                price: stock.selectedPrice === null || isNaN(stock.selectedPrice) || stock.selectedPrice === ""  ? stock.defaultPrice : stock.selectedPrice
            }));

            //call the api
            await this.updatePortfolioAPI(portfolioData, 'Add');
          }

          // Check if any stocks had quantity changes
          if (stocksWithQuantityChange.length > 0) {
            portfolioData.stocks = stocksWithQuantityChange;

            //console.log(portfolioData);

            // Call the API to update the portfolio
            await this.updatePortfolioAPI(portfolioData, 'Increase');
          }
        }

        // Reload to the home page after all the api has executed
        // setTimeout(() => {
        //   window.location.href = "/homepage";
        // }, 3000);
      }

    },
    async updatePortfolioAPI(portfolioData, action) {
      const token = sessionStorage.getItem("token");
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

     //console.log(token);

      try {
        console.log(portfolioData);
        const response = await axios.post("/portfolio/update", portfolioData, config);
        if (response.status === 200) {
          if (action == "Increase") {
            this.showNotification("notification", "Success", `Quantity was increased successfully!`, "success");
          }
          if (action == "Add") {
            this.showNotification("notification", "Success", `Stocks was added to the portfolio successfully!`, "success");
          }
          if (action == "Remove") {
            this.showNotification("notification", "Success", `Existing stocks was removed successfully.`, "success");
          }
        }
      } catch (error) {
        console.error(error);
        if (action == "Increase") {
            this.showNotification("notification", "Error", `Failed to increase quantity. Please try again later.`, "error");
          }
          if (action == "Add") {
            this.showNotification("notification", "Error", `Failed to add to the portfolio. Please try again later.`, "error");
          }
          if (action == "Remove") {
            this.showNotification("notification", "Error", `Failed to remove existing stocks. Please try again later.`, "error");
          }
        //this.showNotification("notification", "Error", "Failed to update the portfolio. Please try again later.", "error");
      }
    }
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

.textbox {
  border-radius: 15px;
  border: solid 1px !important;
  width: 100%;
}

.table-input {
  border-radius: 5px;
  border: solid 1px #D8D8D8;
  width: 100%;
  padding: 6px;
}

.table-input:hover {
  border: solid 1px #A0A5AE;
}

.table-input:disabled {
  background-color: #F5F5F5;
}

.table-heading {
  color: #9d9d9d;
  font-weight: normal;
  font-size: small;
}

.btn-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background-color: white;
}

</style>
