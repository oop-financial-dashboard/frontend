<template>
  <main class="homepage">
    <div>
      <h1>My Portfolio</h1>
    </div>

    <div class="d-flex flex-row mt-3 justify-between">
      <div class="profile p-5">
        <!-- <p><b>Total Assets (SGD) *need API to populate this</b></p>
        <p style="font-size: 30px">100,745</p> -->
        <p><b>Total Assets You Have (USD)</b></p> 
      <p style="font-size: 30px">{{formatTotalValue(totalAsset)}}</p>
        <button @click="openPortfolio" class="btn btn-dark">Open Portfolio Page</button>
      </div>

      <div>
        <stock-rate-chart :popular-stocks="popularStocks.slice(0,5)"/>
      </div>
    </div>

    <portfolio-performance-card />
    <div class="mt-5">
      <div class="d-flex justify-content-between">
        <b>Click portfolio name to view portfolio details</b>

        <button class="btn btn-outline-dark" @click="createPortfolio">
          Create Portfolio
        </button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th class="table-heading" scope="col">Portfolio Name</th>
            <th class="table-heading" scope="col">Number of Stocks</th>
            <th class="table-heading" scope="col">Total Stock Amount</th>
            <th class="table-heading" scope="col">Last Created/Updated</th>
            <th class="table-heading" scope="col"></th>
            <th class="table-heading" scope="col"></th>
          </tr>
        </thead>
        <tbody v-if="this.display == true">
          <tr v-for="(portfolio, key) in portfolioList" :key="key">
            <!-- key should link to view details -->
            <td>
              <a href="#" style="text-decoration: none" @click="navigateToDetails(portfolio, key)">{{key}}</a>
            </td>
            <td>{{portfolio.stocks.length}}</td>
            <td>{{formatTotalValue(portfolio.totalValue)}}</td>
            <td>{{portfolio.createdAt}}</td>
            <td>
              <font-awesome-icon class="clickable" @click="deletePortfolio(key)" :icon="['fas', 'trash-can']" style="color: #dc3545"/>
            </td>
            <td>
              <font-awesome-icon class="clickable" @click="navigateToEditPortfolio(key, portfolio)" :icon="['fas', 'pencil']" style="color: #007bff"/>
            </td>
          </tr>
        </tbody>
        <div class="mt-3" v-else>
          No portfolios, please start by creating!
        </div>
      </table>
    </div>
  </main>
</template>

<script>
import axios from "axios";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashCan, faPencil } from "@fortawesome/free-solid-svg-icons";
library.add(faTrashCan, faPencil)

import { notify } from "@kyvg/vue3-notification";
import PortfolioPerformanceCard from "@/components/PortfolioPerformanceCard.vue";
import StockRateChart from "@/components/StockRateChart.vue";

export default {
  components: {StockRateChart, PortfolioPerformanceCard},
  data() {
    return {
      portfolioList: [],
      display: false,
      totalAsset: 0,
      popularStocks: [],
    }
  },
  mounted() {
    //this.getAllPortfolios();
    this.retrieveUserDetails();
  },
  methods: {
    checkPortfolioExists(portfolios) {
      // Check if at least one portfolio ID exists
      const portfolioIds = Object.keys(portfolios);

      if (portfolioIds.length > 0) {
        this.display = true;

        let popularStocksInPortfoliosObj = {}
        Object.values(portfolios).forEach(portfolio => {
          portfolio.stocks.forEach(stock => {
              if (stock.symbol in popularStocksInPortfoliosObj) {
                popularStocksInPortfoliosObj[stock.symbol] += 1;
              } else {
                popularStocksInPortfoliosObj[stock.symbol] = 1;
              }
          })
        })
        this.popularStocks = Object.entries(popularStocksInPortfoliosObj).sort((a, b) => b[1] - a[1]);
      } else {
        this.display = false;
      }
    },
    navigateToDetails(selectedPortfolio, portfolioId) {
      // save the data
      sessionStorage.setItem("portfolioId", portfolioId)
      sessionStorage.setItem("portfolio", JSON.stringify(selectedPortfolio))
      this.$router.push({name: `portfolio_page`})
    },
    async retrieveUserDetails() {
      const data = {
        email: sessionStorage.getItem("email")
      };

      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.post(`/users/user-details`, data, config);

        if (response.status === 200) {
          sessionStorage.setItem("user_id", response.data.id);
          console.log(sessionStorage.getItem("user_id"));
          // Now that user-details API has completed, call getAllPortfolios
          await this.getAllPortfolios();
        }
      } catch (error) {
        console.error(error);
        // Handle the error here
        this.showNotification("notification", "Error", "Failed to retrieve user details. Please try again later.", "error");
      }
    },    
    async getAllPortfolios() {

      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const user_id = sessionStorage.getItem("user_id");

      console.log("ID:" + user_id);

      axios.get(`/portfolio/get-all/${user_id}`, config)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.portfolioList = response.data.portfolios;
            this.checkPortfolioExists(this.portfolioList);
            for(const key in this.portfolioList){
              console.log(this.portfolioList[key]);
              this.totalAsset += this.portfolioList[key].totalValue;
            }
            sessionStorage.setItem("portfolioList", JSON.stringify(this.portfolioList));
          }
        })
        .catch((err) => {
          console.error(err);
          this.showNotification("notification", "Error", "Failed to retrieve portfolios. Please try again later.", "error");
        })
    },
    formatTotalValue(totalValue) {
      // Calculate and return the total value of stocks
      return totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    navigateToEditPortfolio(portfolioId,selectedPortfolio) {
      sessionStorage.setItem("portfolioId", portfolioId)
      sessionStorage.setItem("portfolio", JSON.stringify(selectedPortfolio))
      this.$router.push({name: `edit_portfolio_page`})
    },
    deletePortfolio(portfolioId) {
      const token = sessionStorage.getItem("token");
      const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

      const userId = sessionStorage.getItem("user_id");
      const deleteParams =  {"userId": userId, "portfolioId": portfolioId}
      axios.post("/portfolio/delete", deleteParams, config)
        .then((response) => {
          if (response.status === 200) {
            this.showNotification("notification", "Success", `Portfolio ${portfolioId} successfully deleted.`, "success");
            setTimeout(() => {
              location.reload();
            }, 1500);
          }
        })
        .catch((err) => {
          console.error(err);
          this.showNotification("notification", "Error", "Failed to delete the portfolio. Please try again later.", "error");
        })
    },
    showNotification(group, title = "", text, type = "") {
      notify({
        group,
        title,
        type,
        text,
      });
    },
    createPortfolio() {
      this.$router.push("/homepage/create_portfolio");
    },
    openPortfolio(){
      this.$router.push("/homepage/portfolio_page");
    }
  },
};
</script>

<style scoped>
.profile {
  background-color: rgba(217, 217, 217, 0.4);
  border-radius: 15px;
}
.table-heading {
  color: #9d9d9d;
  font-weight: normal;
  font-size: small;
}
.clickable {
  cursor: pointer;
}
</style>