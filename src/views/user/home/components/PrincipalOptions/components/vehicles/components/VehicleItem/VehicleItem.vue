<template>
  <ion-item-sliding>
    <ion-item @click="openView()" button>
      <ion-avatar slot="start">
        <ion-img :src="vehicle.photos[0]"></ion-img>
      </ion-avatar>
      <ion-label text-wrap>
        <h2>{{vehicle.brand}} {{vehicle.model}} {{year}} {{vehicle.color}}</h2>
        <p class="inline-info-card">
          <ion-icon color="danger" name="car" style="margin-right: 4px" />
          {{vehicle.plate}}
          <ion-badge
            v-if="vehicle.step == 6"
            style="background: #2dd36f;color: #f9f9f9;margin-left: 4px"
          >vendido</ion-badge>

          <ion-badge
            v-if="vehicle.canceled"
            style="background: #f44336;color: #f9f9f9;margin-left: 4px"
          >Cancelado</ion-badge>
        </p>
      </ion-label>

      <ion-button :href="`tel:${clientData.phone}`" v-if="clientData.phone" fill="clear">
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
import ManageVehicleModal from "../ManageVehicleModal/ManageVehicleModal";
import VehicleModal from "../VehicleModal/VehicleModal";
import store from "@/store";

import moment from "moment";
import { mapState } from "vuex";

export default {
  store,

  props: {
    vehicle: Object,
  },
  data() {
    return {
      clientData: {},
      openingVehicleModal: false,
      isAdmin: false,
    };
  },
  computed: {
    year() {
      return moment(this.vehicle.year).format("YYYY");
    },

    ...mapState({
      currentUser: (state) => state.user,
    }),
  },
  methods: {
    verifyTrash() {
      return this.$ionic.alertController
        .create({
          header: "¿Realmente deseas eliminar este vehiculo?",
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
      firebase.client.delete("vehicles", this.vehicle.id);
    },
    edit() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ManageVehicleModal,
          componentProps: {
            propsData: {
              type: "edit",
              vehicle: this.vehicle,
            },
          },
        })
        .then((m) => m.present());
    },
    openView() {
      var vm = this;
      if (!this.openingVehicleModal) {
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: VehicleModal,
            componentProps: {
              propsData: {
                vehicle_: this.vehicle,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then(() => {
              vm.openingVehicleModal = false;
            });
            m.present();
          });
      }
    },
    getVehicleClient() {
      firebase.client
        .getOnce("users", this.vehicle.user)
        .then((response) => {
          this.clientData = response;
        })
        .catch((error) => {
          var errorCode;
          var errorMessage;

          var errorObjectMessage = {
            header: "Ha ocurrido un error",
            message: "No pudimos obtener al usuario de la cita",
          };

          if (error.code) {
            errorCode = error.code;
            errorMessage = error.message;
            errorObjectMessage = {
              header: errorCode,
              message: errorMessage,
            };
          }

          const toast = this.$ionic.toastController.create({
            ...errorObjectMessage,
            duration: 4000,
            translucent: true,
          });

          return toast.then((response) => {
            response.present();
          });
        });
    },

    checkAccount() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
    },
  },
  watch: {
    vehicle(newValue, oldValue) {
      if (newValue != oldValue) {
        this.getVehicleClient();
      }
    },
  },
  created() {
    this.getVehicleClient();
    this.checkAccount();
  },
};
</script>

<style>
.inline-info-card {
  display: flex;
  align-items: center;
}
</style>
