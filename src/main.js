import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css"; // Ensure you import the Vuetify CSS
import VueRouter from "vue-router";
import CenteredButton from "./components/CenteredButton.vue";
import SignupPage from "./components/SignupPage.vue";

Vue.use(Vuetify);
Vue.use(VueRouter);

const routes = [
  { path: "/", component: CenteredButton },
  { path: "/signup", component: SignupPage },
];

const router = new VueRouter({
  routes,
});

new Vue({
  vuetify: new Vuetify(), // Add this line to initialize Vuetify
  render: (h) => h(App),
  router,
}).$mount("#app");
