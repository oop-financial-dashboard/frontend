<template>
  <main class="homepage">
    <div>
      <h1>My Portfolio</h1>
    </div>

    <div class="d-flex justify-content-end">
      <button class="btn btn-dark">Trade</button>
    </div>

    <div class="profile mt-3 p-5">
      <p><b>Total Assets (SGD) *need API to populate this</b></p>
      <p style="font-size: 30px">100,745</p>
      <button @click="openPortfolio" class="btn btn-dark">Open Portfolio Page</button>
    </div>

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
        <tbody>
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
              <font-awesome-icon class="clickable" @click="navigateToEditPortfolio(portfolio, key)" :icon="['fas', 'pencil']" style="color: #007bff"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import axios from "axios";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashCan, faPencil } from "@fortawesome/free-solid-svg-icons";
library.add(faTrashCan, faPencil)

export default {
  data() {
    return {
      portfolioList: [],
    }
  },
  mounted() {
    // call the method when the component is mounted i.e. first thing is loaded
    this.getAllPortfolios();
    // console.log(sessionStorage.getItem("user_id"));
  },
  methods: {
    navigateToDetails(selectedPortfolio, portfolioId) {
      // save the data
      sessionStorage.setItem("portfolioId", portfolioId)
      sessionStorage.setItem("portfolio", JSON.stringify(selectedPortfolio))
      this.$router.push({name: `portfolio_detail_page`})
      
      // this.$router.push({ name: 'portfolio_detail_page', params: { portfolio: JSON.stringify(selectedPortfolio), portfolioId: portfolioId } });
    },
    getAllPortfolios() {
      // need to get specific user from login
      axios.get("/portfolio/get-all/1")
      //axios.get("/portfolio/get-all/" + sessionStorage.getItem("user_id"))
        .then((response) => {
          if (response.status === 200) {
            this.portfolioList = response.data.portfolios;
          }
        })
        .catch((err) => {
          console.error(err);
        })
    },
    formatTotalValue(totalValue) {
      // Calculate and return the total value of stocks
      return totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    navigateToEditPortfolio(selectedPortfolio, portfolioId) {
      sessionStorage.setItem("portfolioId", portfolioId)
      sessionStorage.setItem("portfolio", JSON.stringify(selectedPortfolio))
      this.$router.push({name: `edit_portfolio_page`})
    },
    deletePortfolio(portfolioId) {
      const userId = sessionStorage.getItem("user_id");
      const deleteParams =  {"userId": userId, "portfolioId": portfolioId}
      axios.post("/portfolio/delete", deleteParams)
        .then((response) => {
          if (response.status === 200) {
            // refresh the page
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error(err);
        })
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