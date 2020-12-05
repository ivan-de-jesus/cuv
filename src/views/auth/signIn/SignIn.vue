<template>
  <!-- <ion-page>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/" text color="danger"></ion-back-button>
      </ion-buttons>
      <ion-title color="danger">Iniciar Sesión</ion-title>
    </ion-toolbar>
  <ion-content padding style="text-align:center">-->
  <div>
    <form @submit.prevent="signIn">
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
        :type="showPassword ? 'text' : 'password'"
        placeholder="Contraseña"
      />
      <ion-icon
        style="position: absolute; right: 30px; margin-top: 11px"
        color="danger"
        :name="showPassword ? 'eye-off' : 'eye'"
        @click="showPassword = !showPassword"
      />
      <ion-button type="submit" expand="block" color="light"
        >Iniciar Sesión</ion-button
      >
    </form>
  </div>

  <!-- </ion-content>
  </ion-page>-->
</template>
<script>
import firebase from "@/firebase";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    signIn() {
      if (this.password && this.email) {
        const login = () => {
          firebase.auth.signIn(this.email, this.password).catch((error) => {
            let errorMessage;

            if (error.code === "auth/wrong-password") {
              errorMessage =
                "La contraseña no es válida o el usuario no tiene una contraseña";
            } else if (error.code === "auth/too-many-requests") {
              errorMessage =
                "Demasiados intentos de inicio de sesión fallidos. Por favor, inténtelo de nuevo más tarde.";
            } else if (error.code === "auth/user-not-found") {
              errorMessage = "Cuenta no encontrada";
            }

            const toast = this.$ionic.toastController.create({
              message: errorMessage,
              duration: 4000,
              translucent: true,
            });

            return toast.then((response) => {
              response.present();
            });
          });
        };

        firebase.client
          .getOnceUser(this.email)
          .then((Queryuser) => {
            if (Queryuser.docs.length > 0) {
              const user = Queryuser.docs[0].data();
              
              

              if (user.active) {
                login();
              } else {
                const toast = this.$ionic.toastController.create({
                  message:
                    "Cuenta desactivada contacta con un administrador para reactivarla",
                  duration: 4000,
                  translucent: true,
                });
                return toast.then((response) => {
                  response.present();
                });
              }
            } else {
              const toast = this.$ionic.toastController.create({
                message: "Correo Electrónico no encontrado",
                duration: 4000,
                translucent: true,
              });
              return toast.then((response) => {
                response.present();
              });
            }
          })
          .catch((error) => {
            const toast = this.$ionic.toastController.create({
              header: error.code,
              message: "Verifique su Correo Electrónico e inténtelo de nuevo",
              duration: 4000,
              translucent: true,
            });

            return toast.then((response) => {
              response.present();
            });
          });
      } else {
        const toast = this.$ionic.toastController.create({
          message: "Completa todos los campos",
          duration: 4000,
          translucent: true,
        });
        return toast.then((response) => {
          response.present();
        });
      }
    },
  },
};
</script>