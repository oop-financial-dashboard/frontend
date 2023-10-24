<template>
    <div>
      <!-- Your component content here -->
      <h1> Hi </h1>
      <p>Token: {{ token }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: (route) => {
        console.log(route.query.token); // Check if the token is correctly received
        return { token: route.query.token };
    },
    // Your component logic here
  };
  </script>
  
<style scoped>
</style>

  

   <!-- <template>
    <div>
      <h1>Account Confirmation Page</h1>
      <p>Token: {{ $route.params.token }}</p>
      <div v-if="loading" class="loading-bar">
        <div class="bar" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        loadingProgress: 0,
      };
    },
    mounted() {
      this.simulateLoading();
    },
    methods: {
      simulateLoading() {
        const interval = setInterval(() => {
          if (this.loadingProgress < 100) {
            this.loadingProgress += 10; // Increase the loading progress (adjust as needed)
          } else {
            clearInterval(interval);
            setTimeout(() => {
              this.redirectToHome();
            }, 5000); // Redirect to /home after 5 seconds
          }
        }, 500); // Adjust the interval duration as needed
      },
      redirectToHome() {
        this.$router.push('/'); // Redirect to the /home route
      },
    },
  };
  </script>
  
  <style scoped>
  .loading-bar {
    background-color: #ddd;
    height: 10px;
    width: 100%;
    position: relative;
  }
  
  .bar {
    height: 100%;
    width: 0;
    background-color: #007bff; /* Adjust the loading bar color as needed */
    position: absolute;
    transition: width 0.5s linear;
  } -->
  <!-- </style> -->
  