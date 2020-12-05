<template>
  <div>
    <ion-avatar
      @click="openMenu"
      style="width:90px; height: 90px; display:inline-block;box-shadow:0 1px 15px rgba(0,0,0,.2)"
    >
      <img :src="user.photoURL" style="background:#f1f1f1" />
    </ion-avatar>
    <!-- <ion-menu side="start" content-id="content">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Left Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content padding id="content">
        <ion-label>START MENU CONTENTS</ion-label>
        <Options />
      </ion-content>
    </ion-menu>-->
    <ion-menu-controller></ion-menu-controller>
    <!-- <ion-menu side="start" content-id="main" menu-id="menu-id">
      <Options />
    </ion-menu>-->
  </div>
</template>
<script>
import firebase from "@/firebase";
import { mapState, mapActions } from "vuex";
import router from "@/router";
import ProfileModal from "./components/options/components/profileModal/ProfileModal";
import store from "@/store";
export default {
  store,
  data() {
    return {
      displayName: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["reset"]),
    logOut() {
      firebase.auth.logOut().then(() => {
        this.reset();
        location.reload(true);
      });
    },
    goRestorePassword() {
      router.push({
        path: "/reestore-password",
        name: "reestore-password",
        params: { logged: true },
      });
    },
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
    openMenu() {
      var v = this;
      this.$ionic.actionSheetController
        .create({
          header: "Opciones",
          buttons: [
            {
              text: "Perfil",
              icon: "person",
              handler: v.openProfileModal,
            },
            {
              text: "Restablecer contraseña",
              icon: "lock",
              handler: v.goRestorePassword,
            },
            {
              text: v.user.uid,
              icon: "clipboard",
              handler: v.goRestorePassword,
            },
            {
              text: "Cerrar Sesión",
              role: "desctructive",
              icon: "exit",
              handler: v.logOut,
            },
          ],
        })
        .then((a) => a.present());
    },
  },
};
</script>