<template>
  <ion-page>
    <ion-content>
      <div class="header-background">
        <UserIcon @OnName="magic" />
        <h1 style="color: white">{{ user.name }}</h1>
        <strong style="color: rgba(0, 0, 0, 0.6)" v-if="user.emailVerified">{{
          user.type | accountType
        }}</strong>
        <br />
        <br />
        <br />
        <br />
      </div>

      <div style="margin-top: -60px" v-if="user.emailVerified">
        <QuickAccessCards />
        <PrincipalOptions />
      </div>

      <ion-card
        style="margin-top: -80px; background: #fff"
        v-else-if="user.active === false"
      >
        <ion-card-header>
          <ion-card-subtitle>CUENTA</ion-card-subtitle>
          <ion-card-title
            >Verifica tu dirección de correo electrónico</ion-card-title
          >
        </ion-card-header>
        <ion-card-content>
          <p>
            Hemos enviado un correo electrónico a la dirrección de correo
            electrónico que nos ha proporcionado en su registro, en él
            encontrará la url que le servirá para verificar su cuenta.
            <br />
            <br />Debe verificar su cuenta para poder acceder a las
            funcionalidades de CUV
          </p>
          <br />
          <p>
            Tu correo actual es: {{ user.email }}, si es incorrecto puedes
            actualizarlo desde el perfil.
          </p>
          <br />
          <div>
            <ion-button @click="reload" color="danger" expand="block"
              >Confirmé mi correo</ion-button
            >
            <br />
            <p>Si no has recibido el correo, pulsa aqui para reenviarlo</p>
            <ion-button @click="reSend" color="primary" expand="block"
              >Reenviar correo</ion-button
            >
          </div>
        </ion-card-content>
      </ion-card>
      <!-- <Menu /> -->
    </ion-content>
  </ion-page>
</template>
<script>
import UserIcon from "./components/userIcon/UserIcon";
import PrincipalOptions from "./components/PrincipalOptions/PrincipalOptions.vue";
import QuickAccessCards from "./components/quickAccessCards/QuickAccessCards";
// import Menu from "./components/Menu/Menu.vue";

import { mapMutations, mapState } from "vuex";
import firebase from "@/firebase";
import firebase_app from "firebase";

import store from "../../../store";
//import ButtonReSendEmail from "../../../components/util/ButtonReSendEmail";

export default {
  store,

  data: () => ({
    userData: {},
  }),

  components: {
    //ButtonReSendEmail,
    // Menu,
    UserIcon,
    PrincipalOptions,
    QuickAccessCards,
  },

  computed: {
    ...mapState(["user"]),
  },

  methods: {
    ...mapMutations(["update_state"]),
    reload() {
      location.reload();
    },

    reSend() {
      firebase.auth
        .resendEmail()
        .then(() => {
          this.$ionic.toastController
            .create({
              message: "Email enviado",
              duration: 4000,
              translucent: true,
            })
            .then((t) => t.present());
        })
        .catch(() => {
          this.$ionic.toastController
            .create({
              message:
                "Ya tienes un email de verifiaciónen tu correo, intenta mas tarde",
              duration: 4000,
              translucent: true,
            })
            .then((t) => t.present());
        });
    },
    async get_branchoffice() {
      if (this.user.uid) {
        const branchoffice_query = await firebase_app
          .firestore()
          .collection("locations")
          .where("type", "==", "branchOffices")
          .get();

        var branchoffices = [];

        branchoffice_query.forEach((branchoffice) => {
          branchoffices.push({
            id: branchoffice.id,
            ...branchoffice.data(),
          });
        });

        const my_branchoffice = branchoffices.find((branchoffice) => {
          return branchoffice.members.find((member) => {
            return member.uid == this.user.uid || member.id == this.user.uid;
          });
        });

        this.update_state({
          propertie: "my_branch_office",
          value: my_branchoffice.id,
        });
      }
    },

    /*verifyEmailAndCreateUser() {
      if (!this.user.emailVerified) {
        if (this.user.uid) {
          firebase.client.getOnce("users", this.user.uid).catch(() => {
            var data = {
              type: "adviser"
            };

            if (this.user.email) data.email = this.user.email;
            if (this.user.displayName) data.name = this.user.displayName;
            if (this.user.phoneNumber) data.phone = this.user.phoneNumber;
            if (this.user.photoURL) data.photoURL = this.user.photoURL;

            console.log(data);

            /!*firebase.client
              .create("users", data, this.user.uid)
              .then(() => this.dismiss(true));*!/
          });
        }
      } else {
        this.getUserType();
      }
    },

    getUserType() {
      if (this.user.emailVerified) {
        firebase.client.getOnce("users", this.user.uid)
        .then(data => this.userData = data)
        .catch(e => console.log(e));
      }
    },*/

    magic(data) {
      this.$forceUpdate();
      console.log(data);
    },
  },

  watch: {
    async user() {
      await this.get_branchoffice();
    },
  },

  filters: {
    accountType(text) {
      switch (text) {
        case "admin":
          return "Administrador";
        case "manager":
          return "Gerente";
        case "client":
          return "Cliente";
        case "adviser":
          return "Asesor";
        case "external":
          return "Externo";
      }
    },
  },
  async mounted() {
    await this.get_branchoffice();
  },
};
</script>
<style>
.header-background {
  background: #f04141 linear-gradient(to bottom right, #ff8888, #d64040);
  text-align: center;
  padding: 5%;
}
</style>