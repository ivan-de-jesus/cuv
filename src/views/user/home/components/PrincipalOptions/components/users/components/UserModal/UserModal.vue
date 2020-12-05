<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{client.name}} {{client.lastname1}} {{client.lastname2}}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="toMembers" v-if="isAdmin">
            <ion-icon slot="icon-only" name="people"></ion-icon>
          </ion-button>
          <ion-button @click="toHistory">
            <ion-icon slot="icon-only" name="filing"></ion-icon>
          </ion-button>
          <ion-button @click="edit">
            <ion-icon slot="icon-only" name="create"></ion-icon>
          </ion-button>
          <ion-button @click="verifyTrash" v-if="isAdmin">
            <ion-icon slot="icon-only" name="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-list-header>
          <ion-label>{{ title }}</ion-label>
        </ion-list-header>
        <ion-item v-if="client.name">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Nombre</span>
            <h1>{{client.name}}</h1>
          </ion-label>
        </ion-item>
        <ion-item v-if="client.lastname1">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Apellido Paterno</span>
            <h1>{{client.lastname1}}</h1>
          </ion-label>
        </ion-item>
        <ion-item v-if="client.lastname2">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Apellido Materno</span>
            <h1>{{client.lastname2}}</h1>
          </ion-label>
        </ion-item>
        <a :href="`tel:${client.phone}`">
          <ion-item button v-if="client.phone">
            <ion-icon slot="start" color="danger" name="call"></ion-icon>
            <ion-label>
              <span class="label-title">Número Telefónico</span>
              <h1>{{client.phone}}</h1>
            </ion-label>
          </ion-item>
        </a>
        <a :href="`mailto:${client.email}`">
          <ion-item button v-if="client.email">
            <ion-icon slot="start" color="danger" name="mail"></ion-icon>
            <ion-label>
              <span class="label-title">Correo Electrónico</span>
              <h1>{{client.email}}</h1>
            </ion-label>
          </ion-item>
        </a>
        <ion-item v-if="client.address">
          <ion-icon slot="start" color="danger" name="locate"></ion-icon>
          <ion-label>
            <span class="label-title">Dirección</span>
            <h1>{{client.address}}</h1>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">RFC</span>
            <h1>{{ client.rfc }}</h1>
          </ion-label>
        </ion-item>

        <ion-item v-if="client.commercial_advisor">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Sucursal</span>
            <h1>{{ location.name }}</h1>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
import ManageUserModal from "../ManageUserModal/ManageUserModal";
import HistoryList from "@/components/history/HistoryList.vue";
import Members from "@/components/members/Members.vue";
import store from "@/store";
import { mapState } from "vuex";
export default {
  store,

  data: () => ({
    isAdmin: false,
    isOpen: false,
    location: "",
  }),

  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),

    title() {
      if (this.client.commercial_advisor) {
        return "DATOS DEL ASESOR COMERCIAL";
      } else {
        return "DATOS DEL CLIENTE";
      }
    },
  },

  props: {
    client: Object,
    clients: Array,
  },
  methods: {
    toMembers() {
      var vm = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: Members,
          componentProps: {
            propsData: {
              id: vm.client.id,
              collection: "users",
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then(() => {});
          m.present();
        });
    },
    toHistory() {
      var vm = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: HistoryList,
          componentProps: {
            propsData: {
              id: vm.client.id,
              collection: "users",
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then(() => {});
          m.present();
        });
    },
    dismiss() {
      this.$ionic.modalController.dismiss();
    },
    verifyTrash() {
      var vm = this;
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
                vm.trash().then(() => {
                  vm.dismiss();
                });
              },
            },
          ],
        })
        .then((a) => a.present());
    },

    getLocation() {
      firebase.client
        .getOnce("locations", this.client.location)
        .then((result) => {
          this.location = result;
          this.location.id = this.client.location;
        });
    },

    trash() {
      return firebase.client.delete("users", this.client.id);
    },

    edit() {
      if (!this.isOpen) {
        this.isOpen = true;
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
                mLocation: vm.location || {},
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then((response) => {
              this.isOpen = false;

              console.log(response.data);

              if (response.data) {
                this.client = response.data.user;
              }
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

  mounted() {
    this.checkAccount();

    if (this.client.commercial_advisor && this.client.location) {
      this.getLocation();
    }
  },
};
</script>
