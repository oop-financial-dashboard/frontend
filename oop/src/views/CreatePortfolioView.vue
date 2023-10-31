<template>
  <main class="aboutpage">
    <h1>Create portfolio</h1>
    <div class="row">
      <div class="col">
        <p><b>Enter portfolio name:</b></p>
        <input class="textbox p-3" v-model="portfolioName" />

        <p class="mt-3"><b>Enter description (strategy):</b></p>
        <textarea required class="textbox p-3" v-model="portfolioDesc"></textarea>

        <p class="mt-3"><b>Specify capital amount (USD):</b></p>
        <input required type="number" class="textbox p-3" v-model="portfolioCapital"/>
      </div>
      <div class="col">
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedStocks" :key="index">
              <td>{{ item.name }}</td>

              <!-- calender to pick date: disabled for default -->
              <td>
                <VueDatePicker @input="onDateChange(item, index)" :start-date="startDate" focus-start-date no-today :max-date="maxDate" :key="'selectedDate_' + index" type="date" v-model="item.selectedDate" :enable-time-picker="false"></VueDatePicker>
                <!-- <VueDatePicker v-model="date" :start-date="startDate2" focus-start-date /> -->
              </td>

              <!-- price -->
              <td>
                <!-- <input :key="'selectedPrice_' + index" :disabled="item.disableFields" :value="item.selectedPrice" type="number" class="table-input" /> -->
                <!-- <input :key="'selectedPrice_' + index" v-model="userEditedPrices[item.name]" :disabled="item.disableFields" type="number" class="table-input" /> -->
                <input :key="'selectedPrice_' + index" :disabled="item.disableFields" v-model="item.selectedPrice" :placeholder="item.defaultPrice" type="number" class="table-input" />
                <!-- <input type="text" v-model="item.selectedPrice" @focus="clearDefault" /> -->
              </td>

              <!-- qty to purchase per stock -->
              <td>
                <input :key="'selectedQty_' + index" v-model="item.selectedQty" :disabled="item.disableFields" type="number" class="table-input" />
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

// import _ from 'lodash';

export default {
  components: {
    MultiSelect, VueDatePicker
  },
  watch: {
    'selectedStocks': {
      deep: true, // this is causing the unnecessary loop
      handler: (function (newVal) {
        newVal.forEach((item) => {
          this.getStockPrice(item.name, item.symbol, item.selectedDate, newVal.indexOf(item));
        });
      }),
    },
  },
  data() {
    return {
      stocks: ref(),
      selectedStocks: ref(),
      portfolioName: '',
      portfolioDesc: '',
      portfolioCapital: 0,
      selectedPriceType: null,
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
      nullErrMessages: {}
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

    // if (this.nullErrMessages) {
    //   for (let stockName in this.nullErrMessages) {
    //     const nullErrMessage = this.nullErrMessages[stockName];
    //     this.showNotification("notification", "Error", nullErrMessage, "error");
    //     // Assuming you want to remove the nullErrMessage from the list after displaying it
    //     delete this.nullErrMessages[stockName];
    //   }
    // }
  },
  methods: {
    onDateChange(item, index) {
      // Call getStockPrice when the date is selected
      console.log("IN");
      this.getStockPrice(item.name, item.symbol, item.selectedDate, index);
    },
    // Update the user-edited price in the userEditedPrices object
    updateUserEditedPrice(stockName, newPrice) {
      this.userEditedPrices[stockName] = newPrice;
    },
    // remove stocks from the dropdown list
    removeStock(stockName) {
      if (this.selectedStocks) {
        this.selectedStocks = this.selectedStocks.filter(stock => stock.name !== stockName);
      }
    },
    getAllPortfolios() {
      // need to get specific user from login
      axios.get("/portfolio/get-all/1")
      //axios.get("/portfolio/get-all/" + sessionStorage.getItem("user_id"))
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
      // need to get specific user from login
      axios.get("/stock/available-stocks")
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
      if (typeof timestamp !== 'undefined') {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const stockParams = { "symbol": symbol, "timestamp": formattedDate };
        
        axios.post("/stock/price", stockParams)
          .then((response) => {
            if (response.status === 200) {
              if (response.data == null) {
                // null e.g. no stock data for this date e.g. closing price
                const nullErrMessage = `No price for ${name} on ${formattedDate}, please select a different date.`; // Customize this error message as needed
                
                this.showNotification("notification", "Error", nullErrMessage, "error");

                if (!this.nullErrMessages[name]) {
                  this.nullErrMessages[name] = nullErrMessage;
                }

                // let count = 0;
                // for (let stockName in this.nullErrMessages) {
                //   const nullErrMessage = this.nullErrMessages[stockName];
                //   if (count = 0) {
                //     this.showNotification("notification", "Error", nullErrMessage, "error");
                //   } 
                  
                //   // Assuming you want to remove the nullErrMessage from the list after displaying it
                //   delete this.nullErrMessages[stockName];
                // }

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

      // Validate selected stocks
      if (this.selectedStocks.length === 0) {
        this.showNotification("notification", "Error", "Select at least one stock for your portfolio.", "error");
        return;
      }

      for (const stock of this.selectedStocks) {
        if (stock.selectedQty <= 0) {
          this.showNotification("notification", "Error", "Stock quantity cannot be 0.", "error");
          return;
        }
        
        if ((stock.selectedPrice === null || isNaN(stock.selectedPrice)) && 
            (stock.selectedPrice < stock.customLow || stock.selectedPrice > stock.customHigh)) {
          this.showNotification("notification", "Error", `Invalid price. ${stock.name} Price should be ${stock.defaultPrice} or between ${stock.customLow} and ${stock.customHigh}.`, "error");
          return;
        }

        if (this.totalPriceComputed > this.portfolioCapital) {
          this.showNotification("notification", "Error", `Total price is more than capital price.`, "error");
          return;
        }

        // formulate string
        const date = new Date(); // get today date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
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
            price: stock.selectedPrice === null || isNaN(stock.selectedPrice)  ? stock.defaultPrice : stock.selectedPrice,
          })),
          createdAt: formattedDate, 
        };

        console.log(portfolioData);
        
        // try {
        //   const response = await axios.post("/portfolio/create", portfolioData);
        //   if (response.status === 200) {
        //     this.showNotification("notification", "Success", "Portfolio created successfully!", "success");
        //     // Reload the page to the homepage after 3 seconds
        //     setTimeout(() => {
        //       window.location.href = "/homepage";
        //     }, 3000); 
        //   }
        // } catch (error) {
        //   console.error(error);
        //   this.showNotification("notification", "Error", "Failed to create the portfolio", "error");
        // }
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
