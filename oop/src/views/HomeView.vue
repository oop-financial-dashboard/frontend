<template>
  <main class="homepage">
    <div>
      <p class="text-xl font-bold m-2">Welcome back!</p>
    </div>

    <div class="d-flex flex-row mt-3 justify-between">
      <div class="profile p-5 m-2"></div>

      <div>
        <stock-rate-chart
          class="m-2 border mr-2"
          :popular-stocks="popularStocks.slice(0, 5)"
        />
      </div>
    </div>

    <div class="flex flex-row my-4 space-x-4 ml-4">
      <portfolios-statistics-card :portfolios="portfolioList" :key="portfolioList"/>
      <portfolio-performance-card title="Best Performing Portfolio" />
      <portfolio-performance-card title="Worst Performing Portfolio" />
    </div>


    <div style="background-color: white; border-radius: 10px" class="p-4 m-2 border">
      <div class="d-flex justify-content-between mb-3">

        <p class="text-xl font-bold my-2">My Portfolios</p>

        <button class="btn btn-dark" @click="createPortfolio">
          Create Portfolio
        </button>
      </div>

      <table class="table table-hover border">
        <thead class="bg-success" style="height: 45px">
          <tr>
            <th class="table-heading" scope="col">Portfolio Name</th>
            <th class="table-heading" scope="col">Number of Stocks</th>
            <th class="table-heading" scope="col">Total Stock Amount</th>
            <th class="table-heading" scope="col" style="width: 250px">
              Last Created/Updated
            </th>
            <th class="table-heading" scope="col" style="width: 80px"></th>
            <th class="table-heading" scope="col" style="width: 80px"></th>
            <th class="table-heading" scope="col" style="width: 160px"></th>
          </tr>
        </thead>
        <tbody v-if="this.display == true">
          <tr v-for="(portfolio, key) in portfolioList" :key="key">
            <!-- key should link to view details -->
            <td>
              <b>
                <a
                  href="#"
                  style="text-decoration: none"
                  class="text-primary"
                  @click="navigateToDetails(portfolio, key)"
                  >{{ key }}</a
                ></b
              >
            </td>
            <td>{{ portfolio.stocks.length }}</td>
            <td>{{ formatTotalValue(portfolio.totalValue) }}</td>
            <td>{{ portfolio.createdAt }}</td>
            <td>
              <font-awesome-icon
                class="clickable"
                @click="deletePortfolio(key)"
                :icon="['fas', 'trash-can']"
                style="color: #dc3545"
              />
            </td>
            <td>
              <font-awesome-icon
                class="clickable"
                @click="navigateToEditPortfolio(key, portfolio)"
                :icon="['fas', 'pencil']"
                style="color: #007bff"
              />
            </td>
            <td>
              <button
                @click="navigateToDetails(portfolio, key)"
                class="btn btn-dark"
              >
                View Portfolio
              </button>
            </td>
          </tr>
        </tbody>
        
      </table>
      <div class="my-5" v-if="display === false">
        <div class="text-center">
          <img src="@/assets/emptyState.svg" class="mx-auto" style="width: 100px;" alt="" />
        </div>
        <div class="text-center text-lg font-normal" style="color:#BAB9B9">
          No portfolios, please start by creating!
        </div>
      </div>
      </div>
  </main>
</template>

<script>
import axios from "axios";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashCan, faPencil } from "@fortawesome/free-solid-svg-icons";
library.add(faTrashCan, faPencil);

import { notify } from "@kyvg/vue3-notification";
import PortfolioPerformanceCard from "@/components/PortfolioPerfomanceCard.vue";
import StockRateChart from "@/components/StockRateChart.vue";
import PortfoliosStatisticsCard from "@/components/PortfoliosStatisticsCard.vue";

export default {
  components: {
    PortfoliosStatisticsCard,
    StockRateChart,
    PortfolioPerformanceCard,
  },
  data() {
    return {
      portfolioList: [],
      display: false,
      totalAsset: 0,
      popularStocks: [],
      isDataLoaded: true
    };
  },
  async created() {
    // this.getAllPortfolios();
    await this.retrieveUserDetails();
  },
  methods: {
    checkPortfolioExists(portfolios) {
      // Check if at least one portfolio ID exists
      const portfolioIds = Object.keys(portfolios);

      if (portfolioIds.length > 0) {
        this.display = true;

        let popularStocksInPortfoliosObj = {};
        Object.values(portfolios).forEach((portfolio) => {
          portfolio.stocks.forEach((stock) => {
            if (stock.symbol in popularStocksInPortfoliosObj) {
              popularStocksInPortfoliosObj[stock.symbol] += 1;
            } else {
              popularStocksInPortfoliosObj[stock.symbol] = 1;
            }
          });
        });
        this.popularStocks = Object.entries(popularStocksInPortfoliosObj).sort(
          (a, b) => b[1] - a[1]
        );
      } else {
        this.display = false;
      }
    },
    navigateToDetails(selectedPortfolio, portfolioId) {
      // save the data
      sessionStorage.setItem("portfolioId", portfolioId);
      sessionStorage.setItem("portfolio", JSON.stringify(selectedPortfolio));
      this.$router.push({ name: `portfolio_page` });
    },
    async retrieveUserDetails() {
      const data = {
        email: sessionStorage.getItem("email"),
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
          // Now that the user-details API has completed, call getAllPortfolios
          await this.getAllPortfolios();
        }
      } catch (error) {
        console.error(error);
        // Handle the error here
        this.showNotification(
          "notification",
          "Error",
          "Failed to retrieve user details. Please try again later.",
          "error"
        );
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

      axios
        .get(`/portfolio/get-all/${user_id}`, config)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.portfolioList = response.data.portfolios;
            this.checkPortfolioExists(this.portfolioList);
            for (const key in this.portfolioList) {
              console.log(this.portfolioList[key]);
              this.totalAsset += this.portfolioList[key].totalValue;
            }
            sessionStorage.setItem(
              "portfolioList",
              JSON.stringify(this.portfolioList)
            );
          }
        })
        .catch((err) => {
          console.error(err);
          this.showNotification(
            "notification",
            "Error",
            "Failed to retrieve portfolios. Please try again later.",
            "error"
          );
        });
    },
    formatTotalValue(totalValue) {
      // Calculate and return the total value of stocks
      return totalValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    navigateToEditPortfolio(portfolioId, selectedPortfolio) {
      sessionStorage.setItem("portfolioId", portfolioId);
      sessionStorage.setItem("portfolio", JSON.stringify(selectedPortfolio));
      this.$router.push({ name: `edit_portfolio_page` });
    },
    deletePortfolio(portfolioId) {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const userId = sessionStorage.getItem("user_id");
      const deleteParams = { userId: userId, portfolioId: portfolioId };
      axios
        .post("/portfolio/delete", deleteParams, config)
        .then((response) => {
          if (response.status === 200) {
            this.showNotification(
              "notification",
              "Success",
              `Portfolio ${portfolioId} successfully deleted.`,
              "success"
            );
            setTimeout(() => {
              location.reload();
            }, 1500);
          }
        })
        .catch((err) => {
          console.error(err);
          this.showNotification(
            "notification",
            "Error",
            "Failed to delete the portfolio. Please try again later.",
            "error"
          );
        });
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
    openPortfolio() {
      this.$router.push("/homepage/portfolio_page");
    },
  },
  computed: {
    getPortfolioList() {
      console.log("Computing portfolio list length ---->", this.portfolioList);
      return this.portfolioList;
    }
  },
};
</script>

<style scoped>
.homepage {
  background-color: #f5f7ff;
}
.profile {
  background-color: white;
  border-radius: 15px;
}
.clickable {
  cursor: pointer;
}

.table tr td {
  vertical-align: middle;
}
</style>
