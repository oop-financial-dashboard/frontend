<template>
      <div class = "cfmAcc">
      <h3>Your account has been verified!</h3>
      <p class="grey_text">You will be redirected to login page in 5 seconds</p>
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>   
      </div>
  </template>
  
<script>
import axios from 'axios';

export default {
  name: 'ConfirmAccount',
  props: ['token'],
  created() {
    console.log(this.token);
    axios.get(`/auth/confirm-account?token=${this.token}`)
      .then((response) => {
        if (response.status === 200) {
          setTimeout(() => {
            this.$router.push("/");
          }, 5000)
        }
      });
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
  border: 2px solid #7399c6;;
}

.form-outline {
  text-align: left;
}

</style>