<template>
    <main class="aboutpage">
        <h1>{{portfolioId}}</h1>

        <div class="mt-5">
            <!--display graphs here-->

            <div>
                <table class="table">
                    <thead>
                    <tr>
                        <th class="table-heading" scope="col">Symbol | Name</th>
                        <th class="table-heading" scope="col">Quantity</th>
                        <th class="table-heading" scope="col">Average Price</th>
                        <th class="table-heading" scope="col">Total</th>
                        <th class="table-heading" scope="col">Last Created/Updated</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(stock, key) in portfolio.stocks" :key="key">
                            <td>{{stock.symbol}}</td>
                            <td>{{stock.quantity}}</td>
                            <td>{{stock.averagePrice}}</td>
                            <td>{{stock.value}}</td>
                            <td>{{portfolio.createdAt}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            portfolioId: localStorage.getItem('portfolioId'),
            portfolio: JSON.parse(localStorage.getItem('portfolio'))
        }
    }
}
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
  color: #9D9D9D;
  font-weight: normal;
  font-size: small;
}
</style>