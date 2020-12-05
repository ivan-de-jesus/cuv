<template>
  <ion-page>
    <!-- <ion-header> -->
    <ion-toolbar color="danger">
      <ion-buttons slot="start">
        <ion-back-button default-href="/" text />
      </ion-buttons>
      <ion-title>Crea tu Cuenta</ion-title>
    </ion-toolbar>
    <!-- </ion-header> -->
    <ion-content style="text-align:center;max-height:90vh" padding>
      <form @submit.prevent="signUp">
        <input v-model="name" required class="input-custom" type="text" placeholder="Nombre" />
        <input
          v-model="lastname1"
          required
          class="input-custom"
          type="text"
          placeholder="Apellido Paterno"
        />
        <input
          v-model="lastname2"
          required
          class="input-custom"
          type="text"
          placeholder="Apellido Materno"
        />

        <input
          v-model="email"
          required
          class="input-custom"
          type="email"
          placeholder="Correo Electrónico"
        />

        <input
          v-model="password"
          required
          class="input-custom"
          placeholder="Contraseña"
          :type="showPassword ? 'text': 'password'"
        />
        <ion-icon
          style="position:absolute;right:30px;margin-top:11px"
          color="danger"
          :name="showPassword ? 'eye-off': 'eye'"
          @click="showPassword = !showPassword"
        />
        <input
          v-model="passwordConfirm"
          required
          class="input-custom"
          placeholder="Confirmar Contraseña"
          :type="showPassword ? 'text': 'password'"
        />
        <input v-model="phone" required class="input-custom" placeholder="Número de Teléfono" />

        <ion-button @click="signUp" expand="block" color="danger">Regístrate</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
import validateData from "@/assets/js/validateData";

export default {
  data() {
    return {
      name: "",
      lastname1: "",
      lastname2: "",
      email: "",
      password: "",
      passwordConfirm: "",
      showPassword: false,
      phone: "",
    };
  },
  methods: {
    signUp() {
      if (
        !this.password ||
        !this.passwordConfirm ||
        !this.email ||
        !this.phone
      ) {
        const toast = this.$ionic.toastController.create({
          message: "Completa todos los campos",
          duration: 4000,
          translucent: true,
        });

        return toast.then((response) => {
          response.present();
        });
      } else if (this.password !== this.passwordConfirm) {
        const toast = this.$ionic.toastController.create({
          message: "Ambas contraseñas deben coincidir",
          duration: 4000,
          translucent: true,
        });

        return toast.then((response) => {
          response.present();
        });
      } else if (!validateData.number(this.phone)) {
        return this.$ionic.alertController
          .create({
            header: "Ingresa un número telefónico válido",
            message: "Todos los campos de este formulario son obligatorios",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else if (!validateData.email(this.email)) {
        return this.$ionic.alertController
          .create({
            header: "Ingresa un correo electrónico válido",
            message: "Todos los campos de este formulario son obligatorios",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      }

      firebase.auth
        .signUp(
          this.name,
          this.phone,
          this.email,
          this.password,
          this.lastname1,
          this.lastname2
        )
        .catch((error) => {
          const errorCode = error.code;
          var errorMessage = error.message;

          switch (error.code) {
            case "auth/email-already-in-use":
              errorMessage = "El correo electrónico ya está siendo utilizado";
              break;
          }

          const toast = this.$ionic.toastController.create({
            header: errorCode,
            message: errorMessage,
            duration: 4000,
            translucent: true,
          });

          return toast.then((response) => {
            response.present();
          });
        });
    },
  },
};
</script>