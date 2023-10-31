<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">Symbol | Name</th>
        <th scope="col">Quantity</th>
        <th scope="col">Value</th>
        <th scope="col">Avg. Price</th>
        <th scope="col">Unrealised PnL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>@twitter</td>
        <td>@twitter</td>
        <td>@twitter</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "stocks-table",
  data() {
    return {
        // portfolioStocks:[];
    };
  },

  created(){
    //  fetch('https://localhost:8088/api/portfolio/get-all/{}') // Replace with your API endpoint
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response issue');
    //     }
    //     return response.json(); // Parse the response as JSON
    //   })
    //   .then(data => {
    //     // Handle the data from the API
    //     console.log('API data:', data);

    //     // You can set the data to a component data property
    //     this.apiData = data; // Assuming you have a data property named apiData
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
  }
};
</script>

<style scoped></style>
