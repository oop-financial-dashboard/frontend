<template>
  <main class="homepage">
    <div>
      <h1>Latest News</h1>
    </div>
    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="../assets/laptop.jpeg" class="d-block w-100" alt="...">
          <div class="carousel-caption center-caption">
            <h3 class="caption-title">{{ articleTitles[0] }}</h3>
            <h5 class="caption-title truncated-summary">{{ articleSummary[0] }}</h5>
            <!-- <a :href="articleURLs[0]" target="_blank">Read more</a> -->
            <button @click="openArticle(articleURLs[0])" class="btn btn-primary btncolor">More Info</button>
          </div>
        </div>
        <div class="carousel-item">
          <img src="../assets/screen.jpeg" class="d-block w-100" alt="...">
          <div class="carousel-caption center-caption">
            <h3 class="caption-title">{{ articleTitles[1] }}</h3>
            <h5 class="caption-title truncated-summary">{{ articleSummary[1] }}</h5>
            <button @click="openArticle(articleURLs[1])" class="btn btn-primary btncolor">More Info</button>
          </div>
        </div>
        <div class="carousel-item">
          <img src="../assets/bitcoin-to-usd.jpeg" class="d-block w-100" alt="...">
          <div class="carousel-caption center-caption">
            <h3 class="caption-title">{{ articleTitles[2] }}</h3>
            <h5 class="caption-title truncated-summary">{{ articleSummary[2] }}</h5>
            <button @click="openArticle(articleURLs[2])" class="btn btn-primary btncolor">More Info</button>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        
      </button>
      
    </div>

    <div>
      <h1>My Portfolio</h1>
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
              <font-awesome-icon class="clickable" @click="navigateToEditPortfolio(key, portfolio)" :icon="['fas', 'pencil']" style="color: #007bff"/>
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

import { notify } from "@kyvg/vue3-notification";

export default {
  data() {
    return {
      portfolioList: [],
      articleTitles: [],
      articleURLs: [],
      articleSummary: [],
    }
  },
  mounted() {
    //this.getAllPortfolios();
    this.retrieveUserDetails();
    this.populateCarousel();
  },
  methods: {
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
    },

    async populateCarousel() {
      axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&financial_markets&sort=LATEST&apikey=769DTIWCBUJZZAYW`)
      .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.data = response.data.feed;
            // console.log(this.data[0]); // array of articles
            // console.log(this.data[0].title); // title of first article
            // console.log(this.data[0].url); //url of first article
            // Extract the top 3 articles
            this.articleTitles = this.data.slice(0, 3).map((article) => article.title);
            this.articleURLs = this.data.slice(0, 3).map((article) => article.url);
            this.articleSummary = this.data.slice(0, 3).map((article) => article.summary);

            console.log(this.articleTitles);
            console.log(this.articleURLs);
            console.log(this.articleSummary);

          }
        })
        .catch((err) => {
          console.error(err);
          // this.showNotification("notification", "Error", "Failed to retrieve portfolios. Please try again later.", "error");
        })
    },

    openArticle(articleURL) {
      // Open the article URL in a new tab or window
      window.open(articleURL, '_blank');
    },


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

.center-caption {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 70%;
}

.caption-title {
  color: black; /* Set the text color to black */
}

/* Add a class to style truncated article summaries */
.truncated-summary {
  max-height: 2.8em; /* Adjust as needed to allow 2 lines of text */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Number of lines to display */
  -webkit-box-orient: vertical;
  color: #2b2b2b;
}

.btncolor{
  background-color: #1c2b36;
  border-color: #1c2b36;
}
</style>