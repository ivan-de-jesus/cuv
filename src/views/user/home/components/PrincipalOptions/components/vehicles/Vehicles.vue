<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="stopListeningVehicles(),$router.go(-1)">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Vehículos</ion-title>
      </ion-toolbar>
      <ion-toolbar color="danger">
        <ion-searchbar mode="ios" placeholder="Buscar" @ionInput="search = $event.target.value" />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="!vehicles.length && !loadedVehicles" class="loading-section">
        <ion-spinner></ion-spinner>
      </div>
      <ion-list>
        <VehicleItem
          :vehicle="vehicle"
          :key="'vehicle_' + vehicle.id + index"
          v-for="(vehicle, index) in vehiclesFiltered"
        />
      </ion-list>
    </ion-content>

    <ion-fab v-if="currentUser.type != 'external'" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="createModal" color="danger">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>
<script>
import ManageVehicleModal from "./components/ManageVehicleModal/ManageVehicleModal";
import VehicleItem from "./components/VehicleItem/VehicleItem";
import firebase from "firebase/app";
import "firebase/firestore";
import store from "../../../../../../../store";
import { mapState } from "vuex";

export default {
  store,
  components: { VehicleItem },
  data() {
    return {
      vehicles: [],
      loadedVehicles: false,
      listeningVehicles: {},
      isAdmin: false,
      search: "",
      isOpen: false,
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),

    vehiclesFiltered() {
      return this.vehicles.filter((vehicles) => {
        return (
          /* BRAND SEARCH */
          vehicles.brand.toLowerCase().includes(this.search.toLowerCase()) ||
          /* VIN SEARCH */
          vehicles.vin.toLowerCase().includes(this.search.toLowerCase()) ||
          /* MODEL SEARCH */
          vehicles.model.toLowerCase().includes(this.search.toLowerCase()) ||
          /* PLATE SEARCh */
          vehicles.plate.toLowerCase().includes(this.search.toLowerCase()) ||
          /* YEAR SEARCh */
          vehicles.year.toLowerCase().includes(this.search.toLowerCase()) ||
          /* BRAND & MODEL */
          `${vehicles.brand}${vehicles.model}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(this.search.replace(/ /g, "").toLowerCase()) ||
          /* BRAND & MODEL & YEAR */
          `${vehicles.brand}${vehicles.model}${vehicles.year}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(this.search.replace(/ /g, "").toLowerCase()) ||
          /* BRAND & YEAR */
          `${vehicles.brand}${vehicles.year}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(this.search.replace(/ /g, "").toLowerCase()) ||
          /* MODEL & YEAR */
          `${vehicles.model}${vehicles.year}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(this.search.replace(/ /g, "").toLowerCase())
        );
      });
    },
  },
  methods: {
    getVehicles() {
      var vehicles = [];
      var listeningVehicles = firebase
        .firestore()
        .collection("vehicles")
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
          vehicles = [];

          if (this.currentUser.type == "admin") {
            querySnapshot.forEach((item) => {
              vehicles.push({
                id: item.id,
                ...item.data(),
              });
            });
          } else {
            querySnapshot.forEach((item) => {
              if (item.data().members.includes(this.currentUser.uid)) {
                vehicles.push({
                  id: item.id,
                  ...item.data(),
                });
              }
            });
          }

          if (this.isAdmin) {
            this.vehicles = vehicles;
            console.log(this.vehicles);
          } else {
            this.vehicles = vehicles.filter((vehicle) => {
              if (!vehicle.canceled) return vehicle;
            });
          }
          this.loadedVehicles = true;
        });

      this.listeningVehicles = listeningVehicles;
    },
    stopListeningVehicles() {
      this.listeningVehicles();
    },
    createModal() {
      if (!this.isOpen) {
        this.isOpen = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: ManageVehicleModal,
            componentProps: {
              propsData: {
                type: "create",
              },
            },
          })
          .then((m) => {
            m.present();
            m.onDidDismiss().then(() => (this.isOpen = false));
          });
      }
    },

    checkUser() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
    },
  },

  mounted() {
    this.getVehicles();
    this.checkUser();
  },
};
</script>