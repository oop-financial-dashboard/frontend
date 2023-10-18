<template>
  <!-- sidebar expanded -->
  <aside class="is-expanded">
    <div class="logo">
      <img src="../assets/navBarLogo.png" alt="Vue" class="logo2" />
    </div>

    <!-- <hr class="hr-line"/> -->

    <div class="menu">
      <router-link class="button" to="/homepage">
        <span class="material-symbols-outlined">home</span>
        <span class="text">Home</span>
      </router-link>
      <router-link class="button" to="/settings">
        <span class="material-symbols-outlined">settings</span>
        <span class="text">Settings</span>
      </router-link>
    </div>
    <button class="logout-section button fixed-bottom" @click="logout()">
      <span class="material-symbols-outlined logout" title="logout"
        >logout</span
      >
      <span class="text">Logout</span>
    </button>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      is_expanded: true,
    };
  },
  methods: {
    logout() {
      this.$router.push("/");
      sessionStorage.removeItem("token");
    },
  },
};
</script>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px);
  min-height: 100vh;
  overflow: hidden;
  background-color: #7399c6;
  @media (max-width: 768px) {
    aside {
      position: fixed;
      z-index: 99;
    }
  }
}
.logout-section {
  width: var(--sidebar-width);
}

.logout-section :hover {
  cursor: pointer;
}

.logout-section:hover .material-symbols-outlined,
.logout-section:hover .text {
  color: #1c2b36;
}
.is-expanded {
  width: var(--sidebar-width);
}
.logo {
  padding: 20px;
}
img.logo2 {
  width: 80px;
}

.material-symbols-outlined {
  color: var(--lighter-grey);
  font-size: 2rem;
}

.menu :hover {
  background-color: #1c2b36;
}

.router-link-active {
  background-color: #1c2b36;
  border-left: 5px solid var(--lighter-grey);
}
img {
  width: 2rem;
}
.button {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 10px 0px 10px 0px;
}
.text {
  color: var(--lighter-grey);
  margin-left: 15px;
}
.is-expanded .button {
  padding: 1rem;
}

</style>
