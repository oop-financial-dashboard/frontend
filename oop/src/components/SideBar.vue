<template>
  <aside class="is-expanded">
    <div class="content">
      <div class="logo">
        <img src="../assets/navBarLogo.png" alt="Vue" class="logo2" />
      </div>
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

      <div class="logout-section">
        <hr class="separator" />

        <button class="button" @click="logout">
          <span class="material-symbols-outlined logout" title="logout"
            >logout</span
          >
          <span class="text">Logout</span>
        </button>
      </div>
    </div>
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
      sessionStorage.clear();
      // sessionStorage.removeItem("user_id");
      // sessionStorage.removeItem("portfolioId");
      // sessionStorage.removeItem("portfolio");
    },
  },
};
</script>

<style scoped>
.separator {
  border-top: 1px solid #ccc;
  margin-bottom: 0px;
}
aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px);
  min-height: 100vh;
  overflow: hidden;
  background-color: #1c2b36;
}
.content {
  position: fixed;
  min-height: 100vh;
}

@media (max-width: 768px) {
  aside {
    position: fixed;
    z-index: 99;
  }
}

.logout-section {
  width: var(--sidebar-width);
  margin-top: 500px;
}

.logout-section:hover {
  cursor: pointer;
}

.logout-section:hover .material-symbols-outlined,
.logout-section:hover .text {
  color: #a7cdff;
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
  color: white;
  font-size: 2rem;
}

.menu :hover {
  background-color: #36383b;
}

.router-link-active {
  background-color: #36383b;
  border-left: 5px solid #a7cdff;
  position: relative;
}

img {
  width: 2rem;
  filter: invert(1);
}

.button {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 10px 0px 10px 0px;
}

.text {
  color: white;
  margin-left: 15px;
}

.is-expanded .button {
  padding: 1rem;
}
</style>
