<template>
  <main class="aboutpage">
    <h1>Create portfolio</h1>
    <div class="row">
      <div class="col-4">
        <p><b>Enter portfolio name:</b></p>
        <input class="textbox p-3" v-model="portfolioName" />

        <p class="mt-3"><b>Enter description (strategy):</b></p>
        <textarea class="textbox p-3" v-model="portfolioDesc"></textarea>

        <p class="mt-3"><b>Specify capital amount (USD):</b></p>
        <input type="number" class="textbox p-3" v-model="portfolioCapital"/>
      </div>
      <div class="col-8">
        <p>
          <b>Select desired stocks (can select multiple):</b>
          <span style="float: right;">Total: {{totalPriceComputed}}</span>
        </p>
        <MultiSelect
          id="multiselect"
          filter
          :maxSelectedLabels="3"
          v-model="selectedStocks"
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
            <tr v-for="(item, index) in selectedStocks" :key="index">
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
                <font-awesome-icon class="clickable" @click="removeStock(item.name)" :icon="['fas', 'x']"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="fixed-container">
      <div class="btn-container">
        <button class="btn btn-outline-dark" @click="submitPortfolio">
          Submit
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
      selectedStocks: ref(),
      portfolioName: '',
      portfolioDesc: '',
      portfolioCapital: 0,
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
      allPortolios: '',
    };
  },
  computed: {
    totalPriceComputed() {
      let total = 0;

      if (this.selectedStocks) {
        for (const stock of this.selectedStocks) {
          if (stock.selectedPrice === null || isNaN(stock.selectedPrice)) {
            // Use defaultPrice if selectedPrice is null
            total += stock.defaultPrice * stock.selectedQty;
          } else {
            total += stock.selectedPrice * stock.selectedQty;
          }
        }
      }
      if (isNaN(total)) {
        return "Calculating...";
      } else {
        return total.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  },
  mounted() {
    this.getAllAvailStocks();
    this.getAllPortfolios();
  },
  methods: {
    capitalPerComputed(price, quantity) {
      let result = "N.A.";
      if (this.portfolioCapital > 0) {
        result = parseFloat(((price * quantity) / this.portfolioCapital) * 100).toFixed(2) + "%";
      }
      return result;
    },
    updateDate(item, index, modelData) {
      // modelData refers to the selected/updated date
      this.getStockPrice(item.name, item.symbol, modelData, index);
    },
    // remove stocks from the dropdown list
    removeStock(stockName) {
      if (this.selectedStocks) {
        this.selectedStocks = this.selectedStocks.filter(stock => stock.name !== stockName);
      }
    },
    getAllPortfolios() {
      const token = sessionStorage.getItem("token");
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

      // need to get specific user from login
      //axios.get("/portfolio/get-all/1")
      const user_id = sessionStorage.getItem("user_id");
      axios.get(`/portfolio/get-all/${user_id}`, config)
        .then((response) => {
          if (response.status === 200) {
            this.allPortolios = response.data.portfolios;
          }
        })
        .catch((err) => {
          console.error(err);
        })
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
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const stockParams = { "symbol": symbol, "timestamp": formattedDate };
        
        axios.post("/stock/price", stockParams, config)
          .then((response) => {
            if (response.status === 200) {
              if (response.data == null) {
                // null e.g. no stock data for this date e.g. closing price
                const nullErrMessage = `No price for ${name} on ${formattedDate}, please select a different date.`; // Customize this error message as needed
                
                this.showNotification("notification", "Error", nullErrMessage, "error");

                // disable the fields
                this.selectedStocks[index].disableFields = true;
                this.selectedStocks[index].defaultPrice = 0;
                this.selectedStocks[index].selectedQty = 0;
              } else {
                // enable the fields because there is stock data for this date e.g. closing, high, and low price
                this.selectedStocks[index].disableFields = false;
                this.selectedStocks[index].defaultPrice = parseFloat(response.data.close).toFixed(2); // set as placeholder
                // this.selectedStocks[index].selectedPrice = parseFloat(response.data.close).toFixed(2);
                this.selectedStocks[index].customHigh = parseFloat(response.data.high).toFixed(2); 
                this.selectedStocks[index].customLow = parseFloat(response.data.low).toFixed(2); 
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
    async submitPortfolio() {

      // Validate portfolio information
      if (!this.portfolioName) {
        this.showNotification("notification", "Error", "Portfolio name is required.", "error");
        return;
      }

      if (this.allPortolios[this.portfolioName]) {
        this.showNotification("notification", "Error", "Portfolio name must be unique.", "error");
        return;
      }

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

      // Validate selected stocks
      if (typeof this.selectedStocks === 'undefined' || this.selectedStocks.length === 0) {
        this.showNotification("notification", "Error", "Select at least one stock for your portfolio.", "error");
        return;
      }

      // Initialize an array to store valid stocks
      const errorMessages = [];

      for (let stock of this.selectedStocks) {
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

      // All error messages are false, meaning there are no errors
      if (errorMessages.every(errorMessage => errorMessage === false)) {
        
        // Format portfolioData and send the request
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        const portfolioData = {
          userId: sessionStorage.getItem("user_id"),
          portfolioId: this.portfolioName,
          description: this.portfolioDesc,
          initialCapital: this.portfolioCapital,
          stocks: this.selectedStocks.map(stock => ({
              symbol: stock.symbol,
              quantity: stock.selectedQty,
              dateAdded: stock.selectedDate,
              price: stock.selectedPrice === null || isNaN(stock.selectedPrice) || stock.selectedPrice === ""  ? stock.defaultPrice : stock.selectedPrice })),
          createdAt: formattedDate,
        };

        try {
          const token = sessionStorage.getItem("token");
          const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

          //console.log(portfolioData);
          const response = await axios.post("/portfolio/create", portfolioData, config);
          if (response.status === 200) {
            this.showNotification("notification", "Success", "Portfolio created successfully!", "success");
            // Delay navigating to the homepage by 1.5 seconds
            setTimeout(() => {
              window.location.href = "/homepage";
            }, 1500);

            // Delay reloading the homepage by 3 seconds (to give time for the redirect to complete)
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        } catch (error) {
          console.error(error);
          this.showNotification("notification", "Error", "Failed to create the portfolio", "error");
        }
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

/* .fixed-container {
  background-color: white;
  width: 100%;
  height: 12vh;
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 1;
} */

.btn-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background-color: white;
}

</style>
