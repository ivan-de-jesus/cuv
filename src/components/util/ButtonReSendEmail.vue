<template>
  <ion-button @click="reSend">
    Reenviar Correo Electrónico
  </ion-button>
</template>

<script>
import firebase from "@/firebase";

export default {
  name: "ButtonReSendEmail",

  methods: {
    async reSend() {
      try {
        await firebase.auth.resendEmail();
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style scoped>

</style>