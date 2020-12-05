<template>
  <div class="full-vw ion-padding">
    <img style="width:140px" :src="require('@/assets/logo.png')" title="logo" />
    <h1>CUV</h1>
    <br />
    <br />
    <br />
    <br />
    <SignIn />
    <br />o
    <br />
    <!-- <h1 class="white-text">Accede</h1> -->
    <ion-button
      @click="$router.push({name:'sign-up'})"
      expand="block"
      fill="clear"
      color="light"
    >REGÍSTRATE</ion-button>
    <br />
    <span
      style="font-size:13px"
      @click="$router.push({path: '/reestore-password', name: 'reestore-password', params: { logged: false } })"
    >¿Olvidaste tu contraseña?</span>
  </div>
</template>
<script>
import SignIn from "@/views/auth/signIn/SignIn.vue";

export default {
  components: { SignIn }
};
</script>

