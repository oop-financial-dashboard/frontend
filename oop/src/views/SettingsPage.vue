<template>
  <main class="aboutpage">
    <h1>Admin Settings</h1>
    <button type="button" class="btn btn-outline-dark" @click="ChangePassword()">
        Change Password
    </button>
</main>
</template>

<script>
export default {
    methods:{
        ChangePassword(){
            this.$router.push('/ChangePassword');
        }
    },
};
</script>

<style scoped>
</style>
