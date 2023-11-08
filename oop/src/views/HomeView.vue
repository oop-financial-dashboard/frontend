<template>

  <main class="homepage">
    <div>
      <!-- <h1>My Portfolio</h1> -->
      <h3 class="text-xl font-bold m-3">Welcome back!</h3>
    </div>

    <div class="flex flex-row">
      <!-- Container of News + Information Cards -->
      <div class="flex flex-col space-y-4 " style="width:824px">
        <div class="mx-3 rounded-xl">
          <div
            id="carouselExampleAutoplaying"
            class="carousel slide rounded-xl"
            data-bs-ride="carousel"
          >
            <div class="carousel-inner rounded-xl">
              <div
                class="carousel-item active rounded-xl"
                data-bs-interval="5000"
              >
                <img
                  src="../assets/laptop.jpeg"
                  class="d-block w-100 rounded-xl"
                  alt="..."
                />
                <div class="carousel-caption text-start" v-if="!articleDataLoading">
                  <h3
                    class="caption-title truncated-title font-bold text-3xl mb-2"
                  >
                    {{ articleTitles[0] }}
                  </h3>
                  <h5 class="caption-title truncated-summary mb-3 w-2/3" >
                    {{ articleSummary[0] }}
                  </h5>
                  <!-- <a :href="articleURLs[0]" target="_blank">Read more</a> -->
                  <button
                    @click="openArticle(articleURLs[0])"
                    class="btn btn-light"
                  >
                    View Article
                  </button>
                </div>

                <div class="carousel-caption text-start"  v-else> 
                  <!-- Display loading spinner or skeleton UI while data is loading -->
                  <div class="mb-2 flex animate-pulse">
                    <div class="w-full">
                      <h3 class="h-5 bg-gray-400 rounded-full dark:bg-gray-500" style="width: 80%;"></h3>
                      <h5 class="mt-4 h-5 bg-gray-400 rounded-full dark:bg-gray-500" style="width: 40%;"></h5>
                      <h5 class="mt-4 h-5 bg-gray-400 rounded-full dark:bg-gray-500" style="width: 20%;"></h5>
                    </div>
                  </div>
                </div>

              </div>
              <div class="carousel-item" data-bs-interval="5000">
                <img
                  src="../assets/screen.jpeg"
                  class="d-block w-100"
                  alt="..."
                />
                <div class="carousel-caption text-start" v-if="!articleDataLoading">
                  <h3
                    class="caption-title truncated-title font-bold text-3xl mb-2"
                  >
                    {{ articleTitles[1] }}
                  </h3>
                  <h5 class="caption-title truncated-summary mb-3 w-2/3" >
                    {{ articleSummary[1] }}
                  </h5>
                  <!-- <a :href="articleURLs[0]" target="_blank">Read more</a> -->
                  <button
                    @click="openArticle(articleURLs[1])"
                    class="btn btn-light"
                  >
                    View Article
                  </button>
                </div>

                <div class="carousel-caption text-start"  v-else> 
                  <!-- Display loading spinner or skeleton UI while data is loading -->
                  <div class="mb-2 flex animate-pulse">
                    <div class="w-full">
                      <h3 class="h-5 bg-gray-200 rounded-full dark:bg-gray-700" style="width: 80%;"></h3>
                      <h5 class="mt-4 h-5 bg-gray-200 rounded-full dark:bg-gray-700" style="width: 40%;"></h5>
                      <h5 class="mt-4 h-5 bg-gray-200 rounded-full dark:bg-gray-700" style="width: 20%;"></h5>
                    </div>
                  </div>
                </div>
              </div>
              <div class="carousel-item" data-bs-interval="5000">
                <img
                  src="../assets/bitcoin-to-usd.jpeg"
                  class="d-block w-100"
                  alt="..."
                />
                <div class="carousel-caption text-start" v-if="!articleDataLoading">
                  <h3
                    class="caption-title truncated-title font-bold text-3xl mb-2"
                  >
                    {{ articleTitles[2] }}
                  </h3>
                  <h5 class="caption-title truncated-summary mb-3 w-2/3" >
                    {{ articleSummary[2] }}
                  </h5>
                  <!-- <a :href="articleURLs[0]" target="_blank">Read more</a> -->
                  <button
                    @click="openArticle(articleURLs[2])"
                    class="btn btn-light"
                  >
                    View Article
                  </button>
                </div>

                <div class="carousel-caption text-start"  v-else> 
                  <!-- Display loading spinner or skeleton UI while data is loading -->
                  <div class="mb-2 flex animate-pulse">
                    <div class="w-full">
                      <h3 class="h-5 bg-gray-200 rounded-full dark:bg-gray-700" style="width: 80%;"></h3>
                      <h5 class="mt-4 h-5 bg-gray-200 rounded-full dark:bg-gray-700" style="width: 40%;"></h5>
                      <h5 class="mt-4 h-5 bg-gray-200 rounded-full dark:bg-gray-700" style="width: 20%;"></h5>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <!-- Statistics and Performance Cards -->
        <div class="flex flex-row my-4 space-x-4 ml-4">
          <blank-component class="border" v-if="allPercentageChanges.length === 0" />
          <portfolios-statistics-card :portfolios="portfolioList" :change="totalPercentageChange" :assets-value="currentAssetValue" :key="portfolioList" v-else class="border"/>
          <portfolio-performance-card title="Best Performing Portfolio" :details="allPercentageChanges[0]" :value="bestPortfolioValue"  v-if="allPercentageChanges.length > 0" class="border"/>
          <portfolio-performance-card title="Worst Performing Portfolio" :details="allPercentageChanges[allPercentageChanges.length-1]" :value="worstPortfolioValue" v-if="allPercentageChanges.length > 1" class="border"/>
        </div>
      </div>
      <!-- Container of Stock Rate Chart -->
      <div class="w-1/3">
        <stock-rate-chart
          class="border ml-2"
          :popular-stocks="popularStocks.slice(0, 8)"
        />
      </div>
    </div>

    <div
      style="background-color: white; border-radius: 10px"
      class="p-4 mx-3 border"
    >
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
            <th class="table-heading" scope="col" style="width: 230px">
              Last Created/Updated
            </th>
            <th class="table-heading" scope="col" style="width: 160px"></th>
            <th class="table-heading" scope="col" style="width: 50px"></th>
            <th class="table-heading" scope="col" style="width: 50px"></th>
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
              <button
                @click="navigateToDetails(portfolio, key)"
                class="btn btn-dark"
              >
                View Portfolio
              </button>
            </td>
            <td class="text-center">
              <font-awesome-icon
                class="clickable"
                @click="navigateToEditPortfolio(key, portfolio)"
                :icon="['fas', 'pencil']"
                style="color: #007bff"
              />
            </td>
            <td class="text-center">
              <font-awesome-icon
                class="clickable"
                @click="deletePortfolio(key)"
                :icon="['fas', 'trash-can']"
                style="color: #dc3545"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="my-5" v-if="display === false">
        <div class="text-center">
          <img
            src="@/assets/emptyState.svg"
            class="mx-auto"
            style="width: 100px"
            alt=""
          />
        </div>
        <div class="text-center text-lg font-normal" style="color: #bab9b9">
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
import BlankComponent from "@/components/Analytics/BlankComponent.vue";

export default {
  components: {
    BlankComponent,
    PortfoliosStatisticsCard,
    StockRateChart,
    PortfolioPerformanceCard,
  },
  data() {
    return {
      portfolioList: [],
      articleTitles: [],
      articleURLs: [],
      articleSummary: [],
      display: false,
      totalAsset: 0,
      popularStocks: [],
      allPercentageChanges: [],
      bestPortfolioValue: 0,
      worstPortfolioValue: 0,
      isDataLoaded: true,
      articleDataLoading: true,
      currentAssetValue: []
    };
  },
 // The code snippet calls the function "populateCarousel" and then waits for the function "retrieveUserDetails" to finish executing before moving on.
  async created() {
    // this.getAllPortfolios();
    // this.retrieveUserDetails();
    this.populateCarousel();
    await this.retrieveUserDetails();
  },
  mounted() {
    console.log("all changes ---->", this.allPercentageChanges.length);
  },
  methods: {
    checkPortfolioExists(portfolios) {
      // Check if at least one portfolio ID exists
      const portfolioIds = Object.keys(portfolios);

      let popularStocksInPortfoliosObj = {};
      if (portfolioIds.length > 0) {
        this.display = true;

        Object.values(portfolios).forEach((portfolio) => {
          portfolio.stocks.forEach((stock) => {
            if (stock.symbol in popularStocksInPortfoliosObj) {
              popularStocksInPortfoliosObj[stock.symbol] += 1;
            } else {
              popularStocksInPortfoliosObj[stock.symbol] = 1;
            }
          });
        });
      } else {
        this.display = false;
        // Initialising stock rate chart with pre-loaded stock list when no no portfolios are available
        popularStocksInPortfoliosObj = {
          "AAPL" : 1,
          "MSFT" : 1,
          "META" : 1,
          "MCD" : 1,
          "NFLX" : 1,
          "SHEL" : 1,
          "WMT" : 1,
          "NKE" : 1
        };
      }
      this.popularStocks = Object.entries(popularStocksInPortfoliosObj).sort(
        (a, b) => b[1] - a[1]
      );
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
          console.log("CHECK HOMEVIEW RESPONSE FROM USER", response.data)
          sessionStorage.setItem("user_id", response.data.id);
          sessionStorage.setItem("firstname", response.data.firstname);
          sessionStorage.setItem("lastname", response.data.lastname);
          sessionStorage.setItem("role", response.data.role);
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

      //console.log("ID:" + user_id);

      axios
        .get(`/portfolio/get-all/${user_id}`, config)
        .then(async (response) => {
          if (response.status === 200) {
            console.log(response.data);
            let portfoliosInitialValues = {};
            this.portfolioList = response.data.portfolios;
            this.checkPortfolioExists(this.portfolioList);
            for (const key in this.portfolioList) {
              this.totalAsset += this.portfolioList[key].totalValue;
              portfoliosInitialValues[key] = this.portfolioList[key].totalValue;
            }
            if (Object.keys(response.data.portfolios).length !== 0) {
              //   TODO: Call function here to get portfolio latest prices
              const portfolioLatestPrices = await this.getAllPortfoliosLatestPrice(this.portfolioList, user_id);
              console.log("Lastest portfolio prices ----->", portfolioLatestPrices);
              this.currentAssetValue = portfolioLatestPrices;
              this.allPercentageChanges = this.calculateAllPortfoliosPercentageChange(portfoliosInitialValues, portfolioLatestPrices);
              this.bestPortfolioValue = Number(portfolioLatestPrices[this.allPercentageChanges[0][0]][1].toFixed(0)).toLocaleString();
              this.worstPortfolioValue = Number(portfolioLatestPrices[this.allPercentageChanges[this.allPercentageChanges.length-1][0]][1].toFixed(0)).toLocaleString();
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

    async populateCarousel() {
      this.articleDataLoading = true; // Set loading state to true
      axios
        .get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&financial_markets&sort=LATEST&apikey=769DTIWCBUJZZAYW`)
        .then((response) => {
          if (response.status === 200) {
            this.data = response.data.feed;
            this.articleTitles = this.data.slice(0, 3).map((article) => article.title);
            this.articleURLs = this.data.slice(0, 3).map((article) => article.url);
            this.articleSummary = this.data.slice(0, 3).map((article) => article.summary);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.articleDataLoading = false; // Set loading state to false
        });
    },

    openArticle(articleURL) {
      // Open the article URL in a new tab or window
      window.open(articleURL, "_blank");
    },
    async getAllPortfoliosLatestPrice(portfolios, userID) {
      const portfolioIds = Object.keys(portfolios);
      const allPortfoliosHistoricalValues = await Promise.allSettled(portfolioIds.map(pId => axios(`/portfolio/get-historicals/${userID}/${pId}`).then( ({data}) => data) ));
      let allPortfoliosLatestPrice = {};
      for (let i=0; i < portfolioIds.length; i++) {
        const portfolioId = portfolioIds[i];
        let portfolioHistoricalPrices = allPortfoliosHistoricalValues[i].value.data[portfolioId];
        let latestPrice = portfolioHistoricalPrices[portfolioHistoricalPrices.length-1];
        allPortfoliosLatestPrice[portfolioId] = latestPrice;
      }
      return allPortfoliosLatestPrice;
    },
    calculateAllPortfoliosPercentageChange(initialPrices, latestPrices) {
      let portfoliosPercentageChange = {};
      Object.entries(latestPrices).forEach(entry => {
        const id = entry[0];
        const latestPrice = entry[1][1];
        const initalPrice = initialPrices[id];
        const change = ((latestPrice-initalPrice)*100)/initalPrice;
        portfoliosPercentageChange[id] = change;
      })
      portfoliosPercentageChange = Object.entries(portfoliosPercentageChange).sort(
          (a, b) => b[1] - a[1]
      );
      return portfoliosPercentageChange;
    }
  },
  computed: {
    totalPercentageChange() {
      let sum = 0;
      // console.log(Object.values(this.allPercentageChanges));
      Object.values(this.allPercentageChanges).forEach(change => { sum += change[1] });
      // console.log(sum);
      return sum;
    }, checkPorfolioList() {
      return JSON.stringify(this.portfolioList).length === 0;
    }
  }
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

.center-caption {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 40%;
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
.truncated-title {
  max-height: 2.8em; /* Adjust as needed to allow 2 lines of text */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* Number of lines to display */
  -webkit-box-orient: vertical;
  color: #2b2b2b;
}

.table tr td {
  vertical-align: middle;
}
</style>
