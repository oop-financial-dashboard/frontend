<template>
    <!-- sidebar expanded -->
    <aside v-if="is_expanded" class="is-expanded">
        <div class="logo">
            <img src="../assets/logo.png" alt="Vue">
        </div>

        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleMenu">
                <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
            </button>
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

        <span class="material-symbols-outlined logout" title="logout" @click="logout()">logout</span>
        <span class="text">Logout</span>
    </aside>

    <!-- sidebar NOT expanded -->
    <aside v-else>
        <div class="logo">
            <img src="../assets/logo.png" alt="Vue">
        </div>

        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleMenu">
                <span class="material-symbols-outlined" title="expand">keyboard_double_arrow_right</span>
            </button>
        </div>

        <div class="menu">
            <router-link class="button" to="/homepage">
                <span class="material-symbols-outlined">home</span>
                <span class="text">Home</span>
            </router-link>
            <router-link class="button" to="/settings">
                <span class="material-symbols-outlined" title="settings">settings</span>
                <span class="text" style="display: none">Settings</span>
            </router-link>
        </div>

        <span class="material-symbols-outlined logout" title="logout" @click="logout()">logout</span>
    </aside>

</template>

<script>
export default {
    data() {
        return {
            is_expanded: false
        }
    },
    methods: {
        ToggleMenu() {
            this.is_expanded = !this.is_expanded
        },
        logout() {
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
aside {
    display: flex;
    flex-direction: column;
    width: calc(2rem + 32px);
    min-height: 100vh;
    overflow: hidden;
    /* transition: 0.2s ease-out; */
    background-color: var(--primary);
    color: var(--dark-grey);
    @media (max-width: 768px) {
        aside {
            position: fixed;
            z-index: 99;
        }
    }
}
.is-expanded {
    width: var(--sidebar-width);
}
.logo {
    padding: 15px;
    margin-bottom: 1rem;
}
.is-expanded .menu-toggle-wrap {
    top: -4rem;
}
.menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    position: relative;
    top: 0;
    margin-right: 15px;
}
.is-expanded .menu-toggle-wrap .menu-toggle {
    transform: rotate(-180deg);
}
.material-symbols-outlined {
    color: var(--dark-grey);
    font-size: 2rem;
    margin-left: 15px;
    /* transition: 0.2s ease-out; */
}
.menu :hover {
    color: var(--lighter-grey);
}
.router-link-active {
    background-color: var(--light-grey);
    border-left: 5px solid var(--lighter-grey);
}
.router-link-active .material-symbols-outlined, .router-link-active .text {
    color: var(--lighter-grey);
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
    color: var(--dark-grey);
    margin-left: 15px;
}
.is-expanded .button {
    padding: 1rem;
}
.logout {
    margin-top: 600px;
}
</style>