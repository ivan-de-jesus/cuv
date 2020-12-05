<template>
  <ion-page>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href @click="backToPrevious" text color="danger"></ion-back-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-content>
      <ion-content padding style="text-align:center">
        <h1 style="margin: 50px 0; font-size:25px ">Reestablece tu contraseña</h1>
        <form @submit.prevent="restorePassword">
          <input
            v-model="email"
            required
            class="input-custom"
            type="email"
            placeholder="Correo Electrónico"
          />

          <ion-button @click="restorePassword" expand="block" color="danger">Restablecer</ion-button>
        </form>
      </ion-content>
    </ion-content>
  </ion-page>
</template>
<script>
import firebase from "@/firebase";

export default {
  data() {
    return {
      email: ""
    };
  },

  props: ["logged"],

  methods: {
    backToPrevious() {
      if (this.logged) {
        this.$router.push("/user/home");
      } else {
        this.$router.push("/");
      }
    },

    restorePassword() {
      firebase.auth
        .restorePassword(this.email)
        .then(() => {
          const toast = this.$ionic.toastController.create({
            header: "Correo Electrónico Enviado",
            message:
              "Enviamos un correo electrónico a la dirección que proporcionaste con las instrucciones para restablecer tu contraseña",
            duration: 10000,
            translucent: true
          });

          this.backToPrevious();

          return toast.then(response => {
            response.present();
          });
        })
        .catch(error => {

          const toast = this.$ionic.toastController.create({
            header: error,
            message: error,
            duration: 10000,
            translucent: true
          });

          return toast.then(response => {
            response.present();
          });
        });
    }
  },

  mounted() {
  }
};
</script>