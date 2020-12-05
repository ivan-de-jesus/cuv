<template>
  <ion-page color="red-primary">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">{{data.brand}} {{data.model}} {{data.year}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="red-primary">
      <ion-slides
        color="red-primary"
        v-if="data.photos.length && ready"
        style="height:40vh"
        pager="true"
      >
        <ion-slide :key="'photo_'+index" v-for="(photo,index) in data.photos">
          <div>
            <img loading="lazy" :src="photo" @click="showModalImg(photo)" />
          </div>
        </ion-slide>
      </ion-slides>
      <div style="text-align:center">
        <h1 :class="`${stepConfig.color}-text`">{{stepConfig.text}}</h1>
      </div>
      <ion-item lines="none">
        <!--  <ion-range
            disabled
            @ionChange="step=$event.detail.value"
            :value="step"
            :color="stepConfig.color"
            min="0"
            max="6"
            step="1"
            snaps="true"
        />-->
      </ion-item>

      <ion-list>
        <ion-list-header>
          <ion-label>DATOS DEL VEHÍCULO</ion-label>
        </ion-list-header>
        <ion-item lines="full">
          VIN
          <ion-label slot="end" text-wrap>{{data.vin}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Marca
          <ion-label slot="end" text-wrap>{{data.brand}}</ion-label>
        </ion-item>

        <ion-item lines="full">
          Placas
          <ion-label slot="end" text-wrap>{{data.plate}}</ion-label>
        </ion-item>

        <ion-item lines="full">
          Modelo
          <ion-label slot="end" text-wrap>{{data.model}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Año
          <ion-label slot="end" text-wrap>{{year}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Color
          <ion-label slot="end">{{data.color}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Kilometraje
          <ion-label slot="end">{{data.mileage}}</ion-label>
        </ion-item>

        <!------------------------------------------------------->
        <ion-item lines="full">
          Asesor Comercial
          <ion-label
            slot="end"
          >{{ commercial_advisor.name }} {{ commercial_advisor.lastname1 }} {{ commercial_advisor.lastname2 }}</ion-label>
        </ion-item>

        <ion-item lines="full">
          Versión
          <ion-label slot="end">{{data.version}}</ion-label>
        </ion-item>

        <ion-item lines="full">
          Transmisión
          <ion-label slot="end">{{data.transmission}}</ion-label>
        </ion-item>
        <!------------------------------------------------------->

        <ion-item lines="full">
          Comentarios
          <ion-label text-wrap slot="end">{{data.description}}</ion-label>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>DATOS DEL CLIENTE</ion-label>
        </ion-list-header>
        <ion-item lines="full">
          Nombre
          <ion-label
            slot="end"
            text-wrap
          >{{userData.name}} {{userData.lastname1}} {{userData.lastname2}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Correo Electrónico
          <ion-label slot="end" text-wrap>{{userData.email}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Número Telefónico
          <ion-label slot="end" text-wrap>{{userData.phone}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Dirección
          <ion-label slot="end" text-wrap>{{userData.address}}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>

    <vue-easy-lightbox :visible="visible" :imgs="url" @hide="closeModalImg" moveDisabled />
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
//import ManageVehicleModal from "../ManageVehicleModal/ManageVehicleModal";
import Proccesses from "@/views/user/home/components/PrincipalOptions/components/processes/Processes.vue";
import moment from "moment";

import HistoryList from "@/components/history/HistoryList.vue";
import Members from "@/components/members/Members.vue";
import { mapState } from "vuex";
import store from "@/store";
//import StepManager from "../StepManager/StepManager";
//import Documentation from "../../../processes/components/Process/typeProcess/Documentation";

export default {
  store,
  props: {
    data: Object,
  },
  data() {
    return {
      // modal
      visible: false,
      url: "",
      // thing
      userData: {},
      step: 0,
      isAdmin: false,
      user: {},
      ready: false,
      isOpen: false,
      commercial_advisor: {},
      location: {},
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),

    /*stepConfig() {
              var config = {};
              switch (this.step) {
                case -1:
                  config = {
                    color: "",
                    text: "AVALÚO"
                  };
                  break;
                case 0:
                  config = {
                    color: "",
                    text: "AVALÚO"
                  };
                  break;
                case 1:
                  config = {
                    color: "warning",
                    text: "Diagnóstico Mecánico"
                  };
                  break;
                case 2:
                  config = {
                    color: "warning",
                    text: "DOCUMENTACIÓN"
                  };
                  break;

                case 3:
                  config = {
                    color: "primary",
                    text: "TALLER EXTERNO"
                  };
                  break;

                case 4:
                  config = {
                    color: "",
                    text: "ACONDICIONAMIENTO COMPLETO" // TODO
                  };
                  break;

                case 5:
                  config = {
                    color: "success",
                    text: "VENDIDO"
                  };
                  break;
              }
              return config;
            },*/

    stepConfig() {
      switch (this.step) {
        case -1:
          return { color: "", text: "AVALÚO" };
        case 0:
          return { color: "", text: "AVALÚO" };
        case 1:
          return { color: "warning", text: "DIAGNÓSTICO MECÁNICO" };
        case 2:
          return { color: "warning", text: "DOCUMENTACIÓN" };
        case 3:
          return { color: "primary", text: "TALLER EXTERNO" };
        case 4:
          return { color: "", text: "ACONDICIONAMIENTO COMPLETO" };
        case 5:
          return { color: "", text: "ACONDICIONAMIENTO FINAL" };
        case 6:
          return { color: "success", text: "VENDIDO" };
        default:
          return {};
      }
    },

    year() {
      return moment(this.data.year).format("YYYY");
    },
  },
  watch: {
    step(value) {
      firebase.client.update("vehicles", this.data.id, {
        step: value,
      });
    },
  },
  methods: {
    toDocumentation() {},

    toMembers() {
      if (!this.isOpen) {
        this.isOpen = true;
        var vm = this;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: Members,
            componentProps: {
              propsData: {
                id: vm.vehicle.id,
                collection: "vehicles",
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then(() => {
              this.isOpen = false;
              this.getClient();
              this.getAdviser();
              this.checkAccount();
              this.getAttended();
              this.getUser();
            });
            m.present();
          });
      }
    },

    toHistory() {
      const vm = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: HistoryList,
          componentProps: {
            propsData: {
              id: vm.vehicle.id,
              collection: "vehicles",
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
                vm.trash().then(() => {
                  vm.dismiss();
                });
              },
            },
          ],
        })
        .then((a) => a.present());
    },

    trash() {
      return firebase.client.delete("vehicles", this.data.id);
    },

    copy(photo) {
      localStorage.setItem("photo", photo);

      this.$ionic.toastController
        .create({
          message: "Imagen copiada al portapapeles",
          duration: 4000,
          translucent: true,
        })
        .then((response) => response.present());
    },

    edit() {},

    getClient() {
      firebase.client.getOnce("users", this.data.user).then((response) => {
        this.userData = response;
      });
    },

    showModalImg(photo) {
      this.visible = true;
      this.url = photo;
    },

    closeModalImg() {
      this.visible = false;
    },

    toStepManager() {},

    toValuation() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: Proccesses,
          componentProps: {
            propsData: {
              vehicleId: this.data.id,
              vehicle: this.data,
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then((response) => {
            this.UpdateVehicleState();

            if (response.data) {
              this.dismiss();
            }
          });
          m.present();
        });
    },

    checkUser() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
    },

    cancelVehicle() {
      let vehicle = this.data;
      vehicle.canceled = true;
      firebase.client
        .update("vehicles", vehicle.id, vehicle)
        .then(() => this.dismiss());
    },

    UpdateVehicleState() {
      firebase.client.getOnce("vehicles", this.data.id).then((response) => {
        this.step = Number.parseInt(response.step);
        this.data.step = response.step;
        this.data.stepMembers = response.stepMembers;
        console.log(this.data);
      });
    },

    getUser() {
      firebase.client.getOnce("users", this.data.user).then((user) => {
        this.user = user;
        this.user.id = this.data.user;
      });
    },

    showConfirmDialogImage(source) {
      this.$ionic.alertController
        .create({
          header: "Confirmacion",
          message:
            "Estas seguro de eliminar esta imagen esta operación no se puede revertir",
          buttons: [
            { text: "Cancelar" },
            {
              text: "Eliminar",
              handler: () => this.removeImageFromDb(source),
            },
          ],
        })
        .then((a) => a.present());
    },

    removeImageFromDb(source) {
      this.data.photos = this.data.photos.filter((photo) => photo !== source);
      firebase.client
        .update("vehicles", this.data.id, this.data)
        .catch((e) => console.log("Error" + e));
    },

    getAdviser() {
      firebase.client
        .getOnce("users", this.data.commercial_advisor)
        .then((advisor) => {
          this.commercial_advisor = {
            id: this.data.commercial_advisor,
            ...advisor,
          };

          firebase.client
            .getOnce("locations", advisor.location)
            .then((location) => {
              this.location = location;
            });
        });
    },
  },

  created() {
    this.getClient();
    this.getAdviser();
    this.step = Number.parseInt(this.data.step);
    this.checkUser();
    this.getUser();

    setTimeout(() => (this.ready = true), 300);
  },
};
</script>

<style>
.btn-remove-img {
  position: absolute;
  top: 4%;
  right: 2%;
}

.btn-copy-img {
  position: absolute;
  top: 4%;
  right: 16%;
}
</style>
