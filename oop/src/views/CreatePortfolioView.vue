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
          <span style="float: right;">Total: ${{totalPriceComputed}}</span>
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
              <th class="table-heading" scope="col">Type of Price</th>
              <th class="table-heading" scope="col">Pick a Date</th>
              <th class="table-heading" scope="col">Price</th>
              <th class="table-heading" scope="col">Enter Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedStocks" :key="index">
              <td>{{ item.name }}</td>
              
              <!-- dropdown list to select: default price, historical price or custom price -->
              <td>
                <select required class="table-input" v-model="item.selectedPriceType">
                  <option disabled value="">Select a price type:</option>
                  <option value="Default Price">Default price</option>
                  <option value="Historical Price">Historical price</option>
                  <option value="Custom Price">Custom price</option>
                </select>
              </td>

              <!-- calender to pick date: disabled for default -->
              <td>
                <VueDatePicker :disabled="item.selectedPriceType === 'Default Price'" :max-date="maxDate" :key="'selectedDate_' + index" type="date" :enable-time-picker="false" v-model="item.selectedDate">{{item.selectedDate}}</VueDatePicker>
              </td>

              <!-- price -->
              <td>
                <input :disabled="item.selectedPriceType === 'Default Price'" :key="'selectedPrice_' + index" v-model="item.selectedPrice" type="number" class="table-input" />
              </td>

              <!-- qty to purchase per stock -->
              <td>
                <input :key="'selectedQty_' + index" v-model="item.selectedQty" type="number" class="table-input" />
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

import { ref } from "vue";

import { notify } from "@kyvg/vue3-notification";

export default {
  components: {
    MultiSelect, VueDatePicker
  },
  watch: {
    'selectedPrice': {
      handler: function () {
          this.calculateTotalPrice();
        }
      },
    'selectedStocks': {
      handler: function (newVal) {
        // Update the selectedDate to the default date when "Default Price" is selected
        newVal.forEach((item) => {
          if (item.selectedPriceType === 'Default Price') {
            item.selectedDate = new Date().setDate(new Date().getDate() - 1);
            item.selectedPrice = 0;
            item.selectedQty = 0;
          } else if (item.selectedPriceType === 'Historical Price') {
            // Call the getStockPrice method when Historical Price is selected
            this.getStockPrice(item.name, item.symbol, item.selectedDate, newVal.indexOf(item));
          } else if (item.selectedPriceType === 'Custom Price') {
            // Call the getStockPrice method for Custom Price without setting selectedPrice
            this.getStockPrice(item.name, item.symbol, item.selectedDate, newVal.indexOf(item), false);
          }
        });
      },
      deep: true
    },
  },
  data() {
    return {
      totalPriceData: 0,
      stocks: ref(),
      selectedStocks: ref(),
      portfolioName: '',
      portfolioDesc: '',
      portfolioCapital: 0,
      selectedPriceType: null,
      selectedDate: null,
      maxDate: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
      selectedPrice: 0,
      customHigh:0,
      customLow: 0,
      selectedQty: 0,
    };
  },
  computed: {
    totalPriceComputed() {
      let total = 0;

      if (this.selectedStocks) {
        for (const stock of this.selectedStocks) {
          // Check if selectedPrice and selectedQty are valid numbers.
          if (stock.selectedPrice > 0 && stock.selectedQty > 0) {
            // Calculate the total price for each selected stock and add it to the total.
            total += stock.selectedPrice * stock.selectedQty;
          }
        }
      }
      return total;
    }
  },
  mounted() {
    this.getAllAvailStocks();
  },
  methods: {
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
    getStockPrice(name, symbol, timestamp, index, setPrice = true) {
      
      if (typeof timestamp !== 'undefined') {

        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const stockParams =  {"symbol": symbol, "timestamp": formattedDate}
        // console.log(stockParams)
        axios.post("/stock/price", stockParams)
          .then((response) => {
            if (response.status === 200) {
              if (response.data == null) {
                this.showNotification(
                "notification",
                "Error",
                `No price for ${name} on ${formattedDate}, please try a historical or custom price`,
                "error");
                this.selectedStocks[index].selectedPrice = 0;
                this.selectedStocks[index].selectedQty = 0;
              }
              else {
                if (setPrice) {
                  this.selectedStocks[index].selectedPrice = response.data.close;
                }
                // Set customLow and customHigh when "Custom Price" is selected
                if (this.selectedStocks[index].selectedPriceType === "Custom Price") {
                  this.selectedStocks[index].customHigh = response.data.high;
                  this.selectedStocks[index].customLow = response.data.low;
                }
              }
            }
          })
          .catch((err) => {
            console.error(err);
          })
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
        this.showNotification("notification", "Error", "Portfolio name is required", "error");
        return;
      }

      if (!this.portfolioDesc) {
        this.showNotification("notification", "Error", "Portfolio description is required", "error");
        return;
      }

      if (this.portfolioCapital <= 0) {
        this.showNotification("notification", "Error", "Capital amount must be greater than 0", "error");
        return;
      }

      // Validate selected stocks
      if (this.selectedStocks.length === 0) {
        this.showNotification("notification", "Error", "Select at least one stock for your portfolio", "error");
        return;
      }

      for (const stock of this.selectedStocks) {
        if (stock.selectedQty <= 0) {
          this.showNotification("notification", "Error", "Stock quantity cannot be 0", "error");
          return;
        }
        
        if (stock.selectedPriceType === "Custom Price" && (stock.selectedPrice < stock.customLow || stock.selectedPrice > stock.customHigh)) {
          this.showNotification("notification", "Error", `Invalid custom price. Custom price should be between ${stock.customLow} and ${stock.customHigh}.`, "error");
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
            price: stock.selectedPrice,
          })),
          createdAt: formattedDate, 
        };
        try {
          const response = await axios.post("/portfolio/create", portfolioData);
          if (response.status === 200) {
            this.showNotification("notification", "Success", "Portfolio created successfully!", "success");
            // Reload the page to the homepage after 3 seconds
            setTimeout(() => {
              window.location.href = "/homepage";
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
