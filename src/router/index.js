import Vue from 'vue'
import VueRouter from 'vue-router'
import { IonicVueRouter } from "@ionic/vue";

Vue.use(IonicVueRouter);
Vue.use(VueRouter);

const router = new IonicVueRouter({
  routes: [
    {
      path: "/",
      name: "main-page",
      component: () =>
        import("@/views/mainPage/MainPage"),
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: () =>
        import("@/views/auth/signUp/SignUp"),
    },
    {
      path: "/sign-in",
      name: "sign-in",
      component: () =>
        import("@/views/auth/signIn/SignIn"),
    },
    {
      path: "/reestore-password",
      name: "reestore-password",
      props: true,
      component: () =>
        import("@/views/auth/restorePassword/RestorePassword"),
    },
    {
      path: "/user/home",
      name: "user/home",
      component: () =>
        import("@/views/user/home/Home"),
    },
    {
      path: "/users",
      name: "users",
      component: () =>
        import("@/views/user/home/components/PrincipalOptions/components/users/Users.vue"),
    },
    {
      path: "/meetings",
      name: "meetings",
      component: () =>
        import("@/views/user/home/components/PrincipalOptions/components/meetings/Meetings.vue"),
    },
    {
      path: "/vehicles",
      name: "vehicles",
      component: () =>
        import("@/views/user/home/components/PrincipalOptions/components/vehicles/Vehicles.vue"),
    },
    {
      path: "/valuations",
      name: "valuations",
      component: () =>
        import("@/views/user/home/components/PrincipalOptions/components/valuations/Valuations.vue"),
    },

  ]
});
export default router
