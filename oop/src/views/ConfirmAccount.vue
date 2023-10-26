<template>
  <div>
      <h1> Hi </h1>
      <p>Token: {{ token }}</p>
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
          this.$router.push("/");
        }
      });


    // try {
    //   axios.get('/auth/confirm-account?token=', {
    //     params: {
    //       token: this.token,
    //     }
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       this.$router.push("/");
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  }
};
</script>
  
<style scoped>
</style>