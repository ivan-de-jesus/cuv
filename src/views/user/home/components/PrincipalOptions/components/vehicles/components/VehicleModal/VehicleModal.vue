<template>
  <ion-page color="red-primary">
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title
          >{{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.year }}</ion-title
        >
        <ion-buttons slot="primary">
          <ion-button @click="toMembers" v-if="isAdmin">
            <ion-icon slot="icon-only" name="people"></ion-icon>
          </ion-button>
          <ion-button @click="toHistory">
            <ion-icon slot="icon-only" name="filing"></ion-icon>
          </ion-button>
          <!-- si estamos en vendido y no somos admin no podemos editar -->
          <ion-button @click="edit" v-if="canEdit">
            <ion-icon slot="icon-only" name="create"></ion-icon>
          </ion-button>
          <ion-button @click="verifyTrash" v-if="isAdmin">
            <ion-icon slot="icon-only" name="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content color="red-primary">
      <ion-slides
        color="red-primary"
        v-if="vehicle.photos.length && ready"
        style="height: 40vh"
        pager="true"
      >
        <ion-slide
          :key="'photo_' + index"
          v-for="(photo, index) in vehicle.photos"
        >
          <div>
            <img loading="lazy" :src="photo" @click="showModalImg(photo)" />
          </div>

          <ion-button
            v-if="isAdmin"
            class="btn-remove-img"
            size="small"
            color="danger"
            @click="showConfirmDialogImage(photo)"
          >
            <ion-icon name="trash" color="light" />
          </ion-button>

          <ion-button class="btn-copy-img" size="small" @click="copy(photo)">
            <ion-icon name="paper" color="light" />
          </ion-button>

          <!--<ion-icon
            v-if="isAdmin"
            name="trash"
            class="btn-remove-img"
            color="danger"
            @click="showConfirmDialogImage(photo)"
          />-->

          <!--<ion-icon
            v-if="isAdmin"
            name="paper"
            class="btn-copy-img"
            color="primary"
            @click="copy(photo)"
          />-->
        </ion-slide>
      </ion-slides>
      <div style="text-align: center">
        <h1 :class="`${stepConfig.color}-text`">{{ stepConfig.text }}</h1>
      </div>
      <ion-item lines="none">
        <ion-range
          disabled
          @ionChange="step = $event.detail.value"
          :value="step"
          :color="stepConfig.color"
          min="0"
          max="6"
          step="1"
          snaps="true"
        />
      </ion-item>
      <div class="ion-padding" style="padding-top: 0px; padding-bottom: 0px">
        <ion-button @click="toValuation" expand="block" color="danger">
          <ion-icon name="clipboard" slot="start" color="light" />Seguimiento
        </ion-button>
      </div>

      <div
        class="ion-padding"
        style="padding-top: 0px; padding-bottom: 0px"
        v-if="isAdmin"
      >
        <ion-button @click="toStepManager" expand="block" color="primary">
          <ion-icon name="person" slot="start" color="light" />Miembros de
          etapas
        </ion-button>
      </div>

      <div class="ion-padding" style="padding-top: 0px; padding-bottom: 0px">
        <ion-button @click="toDocumentation" expand="block" color="tertiary">
          <ion-icon name="paper" slot="start" color="light" />Documentación
        </ion-button>
      </div>

      <ion-list>
        <ion-list-header>
          <ion-label>DATOS DEL VEHÍCULO</ion-label>
        </ion-list-header>
        <ion-item lines="full">
          VIN
          <ion-label slot="end" text-wrap>{{ vehicle.vin }}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Marca
          <ion-label slot="end" text-wrap>{{ vehicle.brand }}</ion-label>
        </ion-item>

        <ion-item lines="full">
          Placas
          <ion-label slot="end" text-wrap>{{ vehicle.plate }}</ion-label>
        </ion-item>

        <ion-item lines="full">
          Modelo
          <ion-label slot="end" text-wrap>{{ vehicle.model }}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Año
          <ion-label slot="end" text-wrap>{{ year }}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Color
          <ion-label slot="end">{{ vehicle.color }}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Kilometraje
          <ion-label slot="end">{{ vehicle.mileage }}</ion-label>
        </ion-item>

        <!------------------------------------------------------->
        <ion-item lines="full">
          Asesor Comercial
          <ion-label slot="end"
            >{{ commercial_advisor.name }} {{ commercial_advisor.lastname1 }}
            {{ commercial_advisor.lastname2 }}</ion-label
          >
        </ion-item>

        <ion-item v-if="!location.hideLocation" lines="full">
          Sucursal
          <ion-label slot="end">{{ location.name }}</ion-label>
        </ion-item>

        <ion-item lines="full">
          Versión
          <ion-label slot="end">{{ vehicle.version }}</ion-label>
        </ion-item>

        <ion-item lines="full">
          Transmisión
          <ion-label slot="end">{{ vehicle.transmission }}</ion-label>
        </ion-item>
        <!------------------------------------------------------->

        <ion-item lines="full">
          Comentarios
          <ion-label text-wrap slot="end">{{ vehicle.description }}</ion-label>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>DATOS DEL CLIENTE</ion-label>
        </ion-list-header>
        <ion-item lines="full">
          Nombre
          <ion-label slot="end" text-wrap
            >{{ userData.name }} {{ userData.lastname1 }}
            {{ userData.lastname2 }}</ion-label
          >
        </ion-item>
        <ion-item lines="full">
          Correo Electrónico
          <ion-label slot="end" text-wrap>{{ userData.email }}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Númerico Telefónico
          <ion-label slot="end" text-wrap>{{ userData.phone }}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Dirección
          <ion-label slot="end" text-wrap>{{ userData.address }}</ion-label>
        </ion-item>
      </ion-list>
      <ion-button
        @click="cancelVehicle"
        v-if="isAdmin"
        color="danger"
        expand="block"
        >Cancelar vehiculo</ion-button
      >
    </ion-content>

    <vue-easy-lightbox
      :visible="visible"
      :imgs="url"
      @hide="closeModalImg"
      moveDisabled
    />
  </ion-page>
</template>
<script>
import firebase from "@/firebase";

import firebaseApp from "firebase/app";
import "firebase/firestore";

import ManageVehicleModal from "../ManageVehicleModal/ManageVehicleModal";
import Proccesses from "@/views/user/home/components/PrincipalOptions/components/processes/Processes.vue";
import moment from "moment";

import HistoryList from "@/components/history/HistoryList.vue";
import Members from "@/components/members/Members.vue";
import { mapState } from "vuex";
import store from "@/store";
import StepManager from "../StepManager/StepManager";
import Documentation from "../../../processes/components/Process/typeProcess/Documentation";

export default {
  store,
  props: {
    vehicle_: Object,
  },
  data() {
    return {
      vehicle: this.vehicle_,
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
    canEdit() {
      if (this.isAdmin) {
        return true;
      } else if (this.vehicle.step != 6) {
        return true;
      } else {
        return false;
      }
    },
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
      return moment(this.vehicle.year).format("YYYY");
    },
  },
  watch: {
    step(value) {
      firebase.client.update("vehicles", this.vehicle.id, {
        step: value,
      });
    },
  },
  methods: {
    toDocumentation() {
      let onStep = false;

      if (this.vehicle.stepMembers) {
        onStep = this.vehicle.stepMembers[2].includes(this.currentUser.uid);
      }

      console.log(!onStep && this.vehicle.step === 2 && !this.isAdmin);

      // COPY PREVENT AUTO REFRESH
      const doc = { ...this.vehicle.documentation };

      if (!this.isOpen) {
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: Documentation,
            componentProps: {
              propsData: {
                id: this.vehicle.id,
                disabled:
                  this.vehicle.step !== 2 || // NOT DOCUMENTATION STEP
                  (this.vehicle.step === 2 && !this.isAdmin && !onStep) ||
                  (this.vehicle.step !== 2 && !onStep) ||
                  (this.vehicle.step !== 2 && !this.isAdmin) ||
                  (this.vehicle.step !== 2 && !this.isAdmin && !onStep),
                documentation: doc,
              },
            },
          })
          .then((m) => {
            m.present();
            m.onDidDismiss().then(({ data }) => {
              if (data.update) {
                this.vehicle.documentation = data.documentation;
              }
            });
          });
      }
    },

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
              this.getVehicle();
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
          m.onDidDismiss().then(() => {
            vm.getVehicle();
          });
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
      return firebase.client.delete("vehicles", this.vehicle.id);
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

    edit() {
      var v = this;
      if (!this.isOpen) {
        this.isOpen = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: ManageVehicleModal,
            componentProps: {
              propsData: {
                type: "edit",
                customAdvisor: this.commercial_advisor,
                customUser: this.user,
                vehicles: this.vehicles,
                vehicle: this.vehicle,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then((response) => {
              v.getVehicle();
              this.isOpen = false;
              if (response.data.mData) {
                this.vehicle = response.data.mData;
                this.ready = false;
                this.getAdviser();
                setTimeout(() => (this.ready = true), 1000);
              }
            });
            m.present();
          });
      }
    },

    getClient() {
      firebase.client.getOnce("users", this.vehicle.user).then((response) => {
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

    toStepManager() {
      var v = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: StepManager,
          componentProps: {
            propsData: {
              vehicle: this.vehicle,
            },
          },
        })
        .then((m) => {
          m.present();
          m.onDidDismiss().then(() => {
            v.getVehicle();
          });
        });
    },

    toValuation() {
      var v = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: Proccesses,
          componentProps: {
            propsData: {
              vehicleId: this.vehicle.id,
              vehicle_: this.vehicle,
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then((response) => {
            this.UpdateVehicleState();
            v.getVehicle();
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
      let vehicle = this.vehicle;
      vehicle.canceled = true;
      firebase.client
        .update("vehicles", vehicle.id, vehicle)
        .then(() => this.dismiss());
    },

    UpdateVehicleState() {
      firebase.client.getOnce("vehicles", this.vehicle.id).then((response) => {
        this.step = Number.parseInt(response.step);
        this.vehicle.step = response.step;
        this.vehicle.stepMembers = response.stepMembers;
        console.log(this.vehicle);
      });
    },

    getUser() {
      firebase.client.getOnce("users", this.vehicle.user).then((user) => {
        this.user = user;
        this.user.id = this.vehicle.user;
        this.user.uid = this.vehicle.user;
      });
    },

    showConfirmDialogImage(source) {
      this.$ionic.alertController
        .create({
          header: "Confirmacion",
          message:
            "Estas seguro de eliminar esta imagen esta operaciónno se puede revertir",
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
      this.vehicle.photos = this.vehicle.photos.filter(
        (photo) => photo !== source
      );
      firebase.client
        .update("vehicles", this.vehicle.id, this.vehicle)
        .catch((e) => console.log("Error" + e));
    },

    getAdviser() {
      firebase.client
        .getOnce("users", this.vehicle.commercial_advisor)
        .then((advisor) => {
          this.commercial_advisor = {
            id: this.vehicle.commercial_advisor,
            ...advisor,
          };

          firebase.client
            .getOnce("locations", advisor.location)
            .then((locationResponse) => {
              this.location = locationResponse;
            })
            .catch(() => {
              this.location = { hideLocation: true };
            });
        });
    },
    getVehicle() {
      var v = this;
      firebaseApp
        .firestore()
        .collection("vehicles")
        .doc(v.vehicle.id)
        .onSnapshot((doc) => {
          v.ready = false;
          v.vehicle.photos = doc.data().photos;
          setTimeout(() => {
            v.ready = true;
          }, 200);
        });
    },
  },

  created() {
    this.getClient();
    this.getAdviser();
    this.step = Number.parseInt(this.vehicle.step);
    this.checkUser();
    this.getUser();
    this.getVehicle();

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
