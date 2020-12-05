<template>
  <ion-item-sliding>
    <ion-item @click="openView()" button>
      <ion-label text-wrap>
        <h2>{{client.name}} {{client.lastname1}} {{client.lastname2}}</h2>
        <ion-badge color="primary" v-if="client.commercial_advisor">Asesor comercial</ion-badge>
      </ion-label>

      <ion-button :href="`tel:${client.phone}`" v-if="client.phone" fill="clear">
        <ion-icon name="call" color="danger"></ion-icon>
      </ion-button>
    </ion-item>
    <ion-item-options side="start" v-if="isAdmin">
      <ion-item-option @click="verifyTrash()" color="danger">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-item-option>
    </ion-item-options>
    <ion-item-options side="end">
      <ion-item-option @click="edit()">
        <ion-icon slot="icon-only" name="create"></ion-icon>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>
<script>
import firebase from "@/firebase";
import ManageUserModal from "../ManageUserModal/ManageUserModal";
import UserModal from "../UserModal/UserModal";
import store from "@/store";
import { mapState } from "vuex";

export default {
  store,

  data: () => ({
    isAdmin: false,
    openingUserModal: false,
    location: "",
  }),

  mounted() {
    this.checkAccount();
    if (this.client.commercial_advisor && this.client.location) {
      this.getLocation();
    }
  },

  props: {
    client: Object,
    clients: Array,
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),
  },

  methods: {
    verifyTrash() {
      return this.$ionic.alertController
        .create({
          header: "¿Realmente deseas eliminar este cliente?",
          message: "Esta acción no se puede revertir",
          buttons: [
            {
              text: "Cancelar",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Eliminar",
              handler: () => {
                this.trash();
              },
            },
          ],
        })
        .then((a) => a.present());
    },

    trash() {
      firebase.client.delete("users", this.client.id);
    },

    getLocation() {
      firebase.client
        .getOnce("locations", this.client.location)
        .then((result) => {
          this.location = result;
        })
        .catch(() => {
          this.location = "";
        });
    },

    edit() {
      var vm = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ManageUserModal,
          componentProps: {
            propsData: {
              type: "edit",
              client: vm.client,
              clients: vm.clients,
              mLocation: vm.location,
            },
          },
        })
        .then((m) => m.present());
    },
    openView() {
      var vm = this;
      if (!this.openingUserModal) {
        this.openingUserModal = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: UserModal,
            componentProps: {
              propsData: {
                client: this.client,
                clients: this.clients,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then(() => {
              vm.openingUserModal = false;
            });
            m.present();
          });
      }
    },
    checkAccount() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
    },
  },
};
</script>