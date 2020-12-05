<template>
  <ion-card>
    <ion-card-header>
      <ion-card-subtitle>Perfil</ion-card-subtitle>
      <ion-card-title>Completa tu perfil</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-list lines="full" class="ion-no-margin ion-no-padding">
        <ion-item>
          <ion-label position="floating">
            Nombre
            <ion-text color="danger">*</ion-text>
          </ion-label>
          <ion-input autocapitalize="on" required type="text" :value="name" @ionInput="name = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">
            Número Telefónico
            <ion-text color="danger">*</ion-text>
          </ion-label>
          <ion-input autocapitalize="on"
            required
            type="tel"
            maxlength="10"
            :value="phone"
            @ionInput="phone = $event.target.value"
          ></ion-input>
        </ion-item>
      </ion-list>
    </ion-card-content>
    <div class="ion-text-right">
      <ion-button @click="updateProfile" fill="none">Enviar</ion-button>
    </div>
    {{user}}
  </ion-card>
</template>
<script>
import firebase from "@/firebase";

import { mapState } from "vuex";
export default {
  data() {
    return {
      name: "",
      phone: ""
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    updateProfile() {
      if (this.name && this.phone) {
        firebase.auth
          .updateProfile({ displayName: this.name, phoneNumber: this.phone })
          .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            const toast = this.$ionic.toastController.create({
              header: errorCode,
              message: errorMessage,
              duration: 4000,
              translucent: true
            });

            return toast.then(response => {
              response.present();
            });
          });
      } else {
        const toast = this.$ionic.toastController.create({
          message: "Completa todos los campos",
          duration: 4000,
          translucent: true
        });
        console.log(toast);

        return toast.then(response => {
          response.present();
        });
      }
    }
  }
};
</script>