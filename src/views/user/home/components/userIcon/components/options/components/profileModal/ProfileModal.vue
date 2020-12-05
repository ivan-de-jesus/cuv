<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div>
        <label for="selectProfilePhoto">
          <ion-avatar style="margin: 20px auto;width:130px;height:130px">
            <img :src="user.photoURL" />
          </ion-avatar>
        </label>
        <input @change="changePhoto" style="display:none" type="file" id="selectProfilePhoto" />
      </div>

      <ion-list>
        <ion-item>
          <ion-label position="floating">Nombre de usuario</ion-label>
          <ion-input autocapitalize="on" :value="userData.name" @ionInput="userData.name = $event.target.value" />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Apellido Paterno</ion-label>
          <ion-input autocapitalize="on"
            :value="userData.lastname1"
            @ionInput="userData.lastname1 = $event.target.value"
          />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Apellido Materno</ion-label>
          <ion-input autocapitalize="on"
            :value="userData.lastname2"
            @ionInput="userData.lastname2 = $event.target.value"
          />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Correo Electrónico</ion-label>
          <ion-input autocapitalize="on" :value="userData.email" @ionInput="userData.email = $event.target.value" />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Número telefónico</ion-label>
          <ion-input autocapitalize="on" :value="userData.phone" @ionInput="userData.phone = $event.target.value" />
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-button @click="updateProfile" expand="block" color="danger">Actualizar</ion-button>
    </ion-footer>
  </ion-page>
</template>
<script>
import { mapState } from "vuex";
import store from "@/store";
import validateData from "@/assets/js/validateData";
import firebase from "@/firebase";

export default {
  store,

  mounted() {
    this.userData = this.user;
  },

  data() {
    return {
      userData: {
        name: "",
        email: "",
        phone: null,
        lastname1: "",
        lastname2: "",
      },
    };
  },

  computed: {
    ...mapState(["user"]),

    emailVerified() {
      return this.user.emailVerified
        ? "Correo Electrónico Verificado"
        : "Correo Electrónico no Verificado";
    },
  },
  methods: {
    changePhoto(event) {
      const file = event.target.files[0];

      firebase.client.uploadImage(file, this.user.uid).then((response) => {
        console.log(response);

        firebase.auth
          .updateUserProfile({
            uid: this.user.uid,
            photoURL: response,
            name: this.userData.name,
            lastname1: this.userData.lastname1,
            lastname2: this.userData.lastname2,
            email: this.userData.email,
            phone: this.userData.phone,
          })
          .then(() => {
            //location.reload();
          });
      });
    },

    updateProfile() {
      if (!validateData.number(this.userData.phone)) {
        return this.$ionic.alertController
          .create({
            header: "Ingresa un número telefónico valido",
            message: "Todos los campos de este formulario son obligatorios",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else {
        firebase.auth
          .updateUserProfile({
            uid: this.user.uid,
            photoURL: this.user.photoURL || "",
            name: this.userData.name,
            lastname1: this.userData.lastname1,
            lastname2: this.userData.lastname2,
            email: this.userData.email,
            phone: this.userData.phone,
          })
          .then(() => {
            return this.$ionic.alertController
              .create({
                header: "Perfil actualizado satisfactoriamente",
                buttons: [
                  {
                    text: "Aceptar",
                    handler: () => {
                      location.reload();
                    },
                  },
                ],
              })
              .then((a) => a.present());
          })
          .catch((e) => console.log(e));
      }
    },

    dismiss(value) {
      this.$ionic.modalController.dismiss({
        value,
        displayName: this.displayName,
      });
    },
  },
};
</script>