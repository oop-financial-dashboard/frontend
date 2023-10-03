<template>
  <main class="homepage">
    <h1>My Portfolio <span class="button">Trade</span></h1>
    
    <div class="profile p-5">
      <p><b>Total Assets (SGD) *need API to populate this</b></p>
      <p style="font-size: 30px">100,745</p>
    </div>
    
    <div class="mt-5">
      <p><b>US Mkt Cap (USD) *need API to populate this table and heading</b><span class="button">Create Portfolio</span></p>
      <table class="table">
        <thead>
          <tr>
            <th class="table-heading" scope="col">Symbol | Name</th>
            <th class="table-heading" scope="col">Position</th>
            <th class="table-heading" scope="col">Last | CostUnrealised P&L</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
export default {
}
</script>

<style scoped>
.button {
  float: right;
  font-size: 14px;
  color: white;
  background-color: #0A1B39;
  padding: 12px 50px;
  border-radius: 15px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
.profile {
  background-color: rgba(217, 217, 217, 0.40);
  border-radius: 15px;
}
.table-heading {
  color: #9D9D9D;
  font-weight: normal;
  font-size: small;
}
</style>