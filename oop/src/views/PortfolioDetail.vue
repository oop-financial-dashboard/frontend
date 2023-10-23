<template>
    <main class="aboutpage">
        <h1>{{portfolioId}}</h1>
    </main>
</template>

<script>
export default {
    data() {
        return {
            portfolioId: this.$route.params.portfolioId,
            portfolio: this.$route.params.portfolio
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