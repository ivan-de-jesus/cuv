<template>
  <ion-list>
    <ion-item button @click="openProfileModal">
      <ion-icon slot="start" name="person"></ion-icon>
      <ion-label>Perfil</ion-label>
    </ion-item>

    <ion-item button @click="goRestorePassword">
      <ion-icon slot="start" name="lock"></ion-icon>
      <ion-label>Restablecer contraseña</ion-label>
    </ion-item>

    <ion-item button @click="logOut">
      <ion-icon slot="start" name="exit"></ion-icon>
      <ion-label>Cerrar Sesión</ion-label>
    </ion-item>
  </ion-list>
</template>
<script>
import firebase from "@/firebase";

import router from "../../../../../../../router";
import ProfileModal from "./components/profileModal/ProfileModal";
import { mapActions } from "vuex";
import store from "../../../../../../../store";

export default {
  store,

  data() {
    return {
      displayName: "",
    };
  },

  methods: {
    ...mapActions(["reset"]),
    openProfileModal() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ProfileModal,
          componentProps: {},
        })
        .then((m) => {
          m.present();
          m.onDidDismiss().then((data) => {
            this.displayName = data.displayName;
          });
        });
    },
    logOut() {
      firebase.auth.logOut().then(() => {
        this.reset();
        setTimeout(() => {
          location.reload(true);
        }, 50);
      });
    },
    dismiss() {
      this.$ionic.popoverController.dismiss({
        displayName: this.displayName,
      });
    },

    goRestorePassword() {
      this.dismiss();
      router.push({
        path: "/reestore-password",
        name: "reestore-password",
        params: { logged: true },
      });
    },
  },
};
</script>