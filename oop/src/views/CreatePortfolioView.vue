<template>
  <main class="aboutpage">
    <h1>Create portfolio</h1>
    <div class="row">
      <div class="col">
        <p><b>Enter portfolio name:</b></p>
        <input class="textbox p-3" />

        <p class="mt-3"><b>Enter description (strategy):</b></p>
        <textarea class="textbox p-3"></textarea>

        <p class="mt-3"><b>Specify capital amount (SGD):</b></p>
        <input type="number" class="textbox p-3" />
      </div>
      <div class="col">
        <p><b>Select desired stocks (can select multiple):</b></p>
        <MultiSelect
          id="multiselect"
          v-model="selectedStocks"
          :options="stocks"
          optionLabel="name"
          placeholder="Select stocks"
          class="textbox p-3"
        />

        <table class="table mt-3">
          <thead>
            <tr>
              <th class="table-heading" scope="col">Stocks selected</th>
              <th class="table-heading" scope="col">Enter quantity</th>
              <th class="table-heading" scope="col">
                Existing capital allocation
              </th>
              <th class="table-heading" scope="col">% of capital</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedStocks" :key="index">
              <td>{{ item.name }}</td>
              <td><input type="number" class="table-input pt-1" /></td>
              <td>10%</td>
              <td><input type="number" class="table-input pt-1" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import MultiSelect from "primevue/multiselect";
import "primevue/resources/themes/saga-blue/theme.css";

import { ref } from "vue";

export default {
  components: {
    MultiSelect,
  },
  data() {
    return {
      stocks: ref([
        { name: "New York", code: "NY" },
        { name: "Rome", code: "RM" },
        { name: "London", code: "LDN" },
        { name: "Istanbul", code: "IST" },
        { name: "Paris", code: "PRS" },
      ]),
      selectedStocks: ref(),
    };
  },
};
</script>
<!-- <style src="vue-multiselect/dist/vue-multiselect.min.css"></style> -->
<style scoped>
.textbox {
  border-radius: 15px;
  border: solid 1px;
  width: 100%;
}

.table-input {
  border-radius: 5px;
  border: solid 1px;
}

.table-heading {
  color: #9d9d9d;
  font-weight: normal;
  font-size: small;
}
</style>
