import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/homepage",
    name: "home",
    component: HomeView,
  },
  {
    // path: "/about",
    // name: "about",
    // // route level code-splitting
    // // this generates a separate chunk (about.[hash].js) for this route
    // // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    path: '/settings',
    name: 'settings_page',
    component: () => import('../views/SettingsPage.vue')
  },
  {
    path: '/ChangePassword',
    name: 'ChangePassword',
    component: () => import('../views/ChangePassword.vue')
  },
  {
    path: '/homepage/create_portfolio',
    name: 'create_portfolio_page',
    component: () => import('../views/CreatePortfolioView.vue')
  },
  {
    path: '/homepage/edit_portfolio',
    name: 'edit_portfolio_page',
    component: () => import('../views/EditPortfolioView.vue')
  },
  {
    path: '/homepage/portfolio_detail',
    name: 'portfolio_detail_page',
    component: () => import('../views/PortfolioDetail.vue')
  },
  {
    path: '/homepage/portfolio_page',
    name: 'portfolio_page',
    component: () => import('../views/PortfolioPage.vue')
  },
  {
    path: '/',
    name: 'login_page',
    component: () => import('../components/UserLogin.vue'),
    meta: {
      hideNavbar: true
    }
  },
  {
    path: '/auth/confirm-account',
    name: 'confirm-account',
    component: () => import('../views/ConfirmAccount.vue') ,
    props: (route) => ({ token: route.query.token }), // Pass the token as a prop to the component
    meta: {
      hideNavbar: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;