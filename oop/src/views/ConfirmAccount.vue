<template>
  <div class="cfmAcc">
    <h3>Your account has been verified!</h3>
    <p class="grey_text">
      You will be redirected to login page in {{ countdown }} seconds
    </p>
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
    <p> 
      Alternatively, you can click the button below 
      <button type="button" class="redirect_btn my-4 p-2" @click="Redirect()">
        Back to Login
      </button>
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";

export default {
  data() {
    return {
      countdown: 5,
    };
  },
  name: "ConfirmAccount",
  props: ["token"],
  created() {
    axios.get(`/auth/confirm-account?token=${this.token}`).then((response) => {
      if (response.status === 200) {
        this.startCountdown();
      }
    })
    .catch((error) => {
      console.log(error);
        this.show(
          "notification",
          "Error",
          "Please contact the admin!",
          "error"
        );
    });
  },
  methods: {
    show(group, title = "", text, type = "") {
      notify({
        group,
        title,
        type,
        text,
      });
    },

    Redirect() {
      this.redirectToLogin();
    },

    startCountdown() {
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.redirectToLogin();
        }
      }, 1000);
    },
    redirectToLogin() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
p {
  font-size: 14px;
}

.cfmAcc {
  width: 30%;
  background-color: var(--lighter-grey-alt);
  padding: 40px;
  border-radius: 5px;
  text-align: center;
  margin: auto;
  margin-top: 10%;
  border: 2px solid #7399c6;
}

.redirect_btn {
  width: 100%;
  background-color: #7399c6;
  color: white;
  border-radius: 5px;
}
</style>
