<template>
  <main class="aboutpage">
    <h3>Settings</h3>

    <div
      class="col p-4"
      style="
        border-radius: 16px;
        background-color: white;
        margin-right: 20px;
        height: auto;
        width: 70%;
      "
    >
      <div class="mb-3">
        <label class="form-label">First Name:</label>
        <input
          class="form-control"
          type="text"
          value="Disabled readonly input"
          aria-label="Disabled input example"
          disabled
          readonly
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Last Name:</label>
        <input
          class="form-control"
          type="text"
          value="Disabled readonly input"
          aria-label="Disabled input example"
          disabled
          readonly
        />
      </div>
      <div class="mb-3">
        <label class="form-label">User ID:</label>
        <input
          class="form-control"
          type="text"
          value="Disabled readonly input"
          aria-label="Disabled input example"
          disabled
          readonly
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Email:</label>
        <input
          class="form-control"
          type="text"
          value="Disabled readonly input"
          aria-label="Disabled input example"
          disabled
          readonly
        />
      </div>

      <button class="btn btn-dark mt-4 mb-2" @click="ChangePassword()">
        Change Password
      </button>
    </div>
  </main>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    ChangePassword() {
      this.$router.push("/ChangePassword");
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
          // Now that user-details API has completed, call getAllPortfolios
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
  },
};
</script>

<style scoped>
.aboutpage {
  background-color: #f5f7ff;
}
</style>
