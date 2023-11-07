<template>
  <main class="aboutpage">
    <div>
      <p class="text-xl font-bold m-2">Settings</p>
    </div>

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
          :value="firstname"
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
          :value="lastname"
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
          :value="userID"
          aria-label="Disabled input example"
          disabled
          readonly
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Role:</label>
        <input
          class="form-control"
          type="text"
          :value="role"
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
          :value="email"
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
// import axios from "axios";
export default {
  data() {
    return {
      email: sessionStorage.getItem("email"),
      userID : sessionStorage.getItem("user_id"),
      firstname: sessionStorage.getItem("firstname"),
      lastname: sessionStorage.getItem("lastname"),
      role: sessionStorage.getItem("role"),
    };
  },

  methods: {
    ChangePassword() {
      this.$router.push("/ChangePassword");
    },
  },
};
</script>

<style scoped>
.aboutpage {
  background-color: #f5f7ff;
}
</style>
