<template>
  <div class="app">
    <SideBar v-if="!$route.meta.hideNavbar"/>
    <router-view/>
  </div>
</template>

<script setup>
import SideBar from './components/SideBar.vue'
</script>

<style>
:root {
  --primary: #363740;
  --dark-grey: #A4A6B3;
  --light-grey: #9FA2B4;
  --lighter-grey: #DDE2FF;
  --lighter-grey-alt: #F7F8FC;
  --sidebar-width: 300px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif ;
}

body {
  background: var(--lighter-grey-alt);
}
.app {
  display: flex;
}
main {
    flex: 1 1 0;
    padding: 2rem;
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