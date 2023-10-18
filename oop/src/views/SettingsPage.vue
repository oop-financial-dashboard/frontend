<template>
  <main class="aboutpage">
    <h1>Admin Settings</h1>
    <button type="button" class="btn btn-dark" @click="ChangePassword()">
    <!-- <button type="button" class="forget_btn my-4 p-2" @click="ChangePassword()"> -->
        Change Password
    </button>
</main>
</template>

<script>
export default {
    methods:{
        ChangePassword(){
            console.log("entered");
        }
    },
};
</script>

<style scoped>
/* .forget_btn{
  background-color: #7399c6;
  color: white;
  border-radius: 5px;
} */
</style>
