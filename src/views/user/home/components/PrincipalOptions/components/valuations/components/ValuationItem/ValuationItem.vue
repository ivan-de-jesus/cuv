<template>
  <ion-item-sliding>
    <ion-item @click="openView()" button>
      <ion-avatar slot="start">
        <ion-img :src="vehicle.photos[0]"></ion-img>
      </ion-avatar>
      <ion-label text-wrap>
        <h2>{{vehicle.brand}} {{vehicle.model}} {{year}} {{vehicle.color}}</h2>
        <p>
          <ion-icon color="danger" name="car" />
          {{vehicle.plate}}
        </p>
      </ion-label>
      <ion-button :href="`tel:${clientData.phone}`" v-if="clientData.phone" fill="clear">
        <ion-icon name="call" color="danger"></ion-icon>
      </ion-button>
    </ion-item>
    <ion-item-options side="start">
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
import ManageValuationModal from "../ManageValuationModal/ManageValuationModal";
import ValuationModal from "../ValuationModal/ValuationModal";

import moment from "moment";

export default {
  props: {
    vehicle: Object,
  },
  data() {
    return {
      clientData: {},
      openingUserModal: false,
    };
  },
  computed: {
    year() {
      return moment(this.vehicle.date).format("YYYY");
    },
  },
  methods: {
    verifyTrash() {
      return this.$ionic.alertController
        .create({
          header: "¿Realmente deseas eliminar este vehículo?",
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
          component: ManageValuationModal,
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
      if (!this.openingUserModal) {
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: ValuationModal,
            componentProps: {
              propsData: {
                vehicle: this.vehicle,
              },
            },
          })
          .then((m) => m.present());
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
  },
};
</script>