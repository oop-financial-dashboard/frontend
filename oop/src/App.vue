<template>
  <div class="app">
    <SideBar v-if="!$route.meta.hideNavbar" />
    <router-view />
  </div>
  <Notifications
    group="notification"
    position="top right"
    animation-type="velocity"
    :speed="1000"
  />
</template>

<script setup>
import SideBar from "./components/SideBar.vue";
</script>

<style>
:root {
  --primary: #363740;
  --dark-grey: #A4A6B3;
  --light-grey: #9FA2B4;
  --lighter-grey: #DDE2FF;
  --lighter-grey-alt: #F7F8FC;
  --background-colour: #F5F7FF;;
  --sidebar-width: 200px;
}
* {
  /* margin: 0; removed this for multiselect (let me know if this affect your part - joey) */
  padding: 0;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

body {
  /* background: var(--background-colour); */
  background: var(--background-colour);
}
.app {
  display: flex;
}
main {
  flex: 1 1 0;
  padding: 2rem;
  overflow: auto;
  @media (max-width: 768px) {
    padding-left: 6rem;
  }
}
button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
</style>
