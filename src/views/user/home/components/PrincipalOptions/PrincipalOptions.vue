<template>
  <ion-list>
    <ion-item-sliding v-if="user.type != 'external'">
      <ion-item @click="$router.push({name:'users'})">
        <ion-avatar slot="start" class="icon-option">
          <ion-icon name="person" color="light" />
        </ion-avatar>
        <ion-label @click="$router.push({name:'users'})">Clientes</ion-label>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option>
          <ion-icon slot="icon-only" name="add" @click="createModal('client')" />
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <ion-item-sliding v-if="user.type != 'external'">
      <ion-item @click="$router.push({name:'meetings'})">
        <ion-avatar slot="start" class="icon-option">
          <ion-icon name="paper" color="light" />
        </ion-avatar>
        <ion-label>Citas</ion-label>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option @click="createModal('meetings')">
          <ion-icon slot="icon-only" name="add" />
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <ion-item-sliding>
      <ion-item @click="$router.push({name:'vehicles'})">
        <ion-avatar slot="start" class="icon-option">
          <ion-icon name="car" color="light" />
        </ion-avatar>
        <ion-label>Vehículos</ion-label>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option @click="createModal('vehicles')">
          <ion-icon slot="icon-only" name="add" />
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>
<script>
import ManageUserModal from "@/views/user/home/components/PrincipalOptions/components/users/components/ManageUserModal/ManageUserModal.vue";
import ManageMeetingModal from "@/views/user/home/components/PrincipalOptions/components/meetings/components/ManageMeetingModal/ManageMeetingModal.vue";
import ManageVehicleModal from "@/views/user/home/components/PrincipalOptions/components/vehicles/components/ManageVehicleModal/ManageVehicleModal.vue";
import ManageValuationModal from "@/views/user/home/components/PrincipalOptions/components/valuations/components/ManageValuationModal/ManageValuationModal.vue";

import firebase from "firebase/app";
import "firebase/firestore";

import { mapState } from "vuex";
export default {
  data() {
    return {
      clients: [],
      loadedClients: false,
      listeningClients: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    createModal(type) {
      var component;
      var options = {};

      switch (type) {
        case "client":
          component = ManageUserModal;
          options.clients = this.clients;
          break;
        case "meetings":
          component = ManageMeetingModal;
          break;
        case "vehicles":
          component = ManageVehicleModal;
          break;
        case "valuations":
          component = ManageValuationModal;
      }

      return this.$ionic.modalController
        .create({
          component,
          backdropDismiss: false,
          componentProps: {
            propsData: {
              type: "create",
              ...options,
            },
          },
        })
        .then((m) => m.present());
    },
    getUsers() {
      var clients = [];
      var listeningClients = firebase
        .firestore()
        .collection("users")
        .where("type", "==", "client")
        .onSnapshot((querySnapshot) => {
          clients = [];
          querySnapshot.forEach((doc) => {
            clients.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          this.clients = clients;
          this.loadedClients = true;
        });

      this.listeningClients = listeningClients;
    },
    stopListeningClients() {
      this.listeningClients();
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style>
.icon-option {
  background: #f04141 linear-gradient(to bottom right, #ff8888, #d64040);
  margin-right: 15px;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.3);
  padding: 10px;
  text-align: center;
}
</style>