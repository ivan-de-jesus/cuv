<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">{{modalTitle}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-slides v-if="photos.length && type == 'create'" style="height:40vh" pager="true">
        <ion-slide :key="index" v-for="(photo,index) in photos">
          <div>
            <img :src="photo.source" />
          </div>
        </ion-slide>
        <ion-slide style="background:#c1c1c1;">
          <label for="upload_valuation_create_photo">
            <div>
              <div style="height:40vh; text-align:center">
                <ion-icon
                  name="add"
                  style="color:white;
        width:100px;height:100px;margin-top: calc(20vh - 50px)"
                ></ion-icon>
              </div>
            </div>
          </label>
        </ion-slide>
      </ion-slides>
      <label for="upload_valuation_create_photo" v-else-if="type == 'create'">
        <div style="height:40vh; background:#c1c1c1;text-align:center">
          <ion-icon
            name="add"
            style="color:white;
        width:100px;height:100px;margin-top: calc(20vh - 50px)"
          ></ion-icon>
        </div>
      </label>

      <input
        @change="setPhotosToUpload"
        style="display:none"
        multiple
        id="upload_valuation_create_photo"
        type="file"
      />

      <!-- inputs -->

      <ion-list>
        <ion-item>
          <ion-label position="floating">Placas *</ion-label>
          <ion-input autocapitalize="on" :value="plate" @ionInput="plate = $event.target.value"></ion-input>
        </ion-item>
        <ion-item lines="full" button @click="openClientsModal">
          <ion-label>Cliente *</ion-label>
          {{user.name ? `${user.name} ${user.lastname1} ${user.lastname2}` : ""}}
        </ion-item>
        <ion-item>
          <ion-label position="floating">VIN *</ion-label>
          <ion-input autocapitalize="on" :value="vin" @ionInput="vin = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Marca *</ion-label>
          <ion-input autocapitalize="on" :value="brand" @ionInput="brand = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Modelo *</ion-label>
          <ion-input autocapitalize="on" :value="model" @ionInput="model = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Año *</ion-label>
          <ion-datetime
            :value="year"
            @ionChange="year = $event.detail.value"
            cancel-text="Cancelar"
            done-text="Aceptar"
            display-format="YYYY"
            picker-format="YYYY"
          ></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Color *</ion-label>
          <ion-input autocapitalize="on" :value="color" @ionInput="color = $event.target.value"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Kilometraje *</ion-label>
          <ion-input autocapitalize="on" :value="mileage" @ionInput="mileage = $event.target.value" type="number"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Descripción</ion-label>
          <ion-textarea :value="description" @ionInput="description = $event.target.value"></ion-textarea>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-button @click="sendValuationData" color="danger" expand="block">{{modalButton}}</ion-button>
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
import firebaseApp from "firebase/app";
import "firebase/firestore";

import store from "@/store";
import { mapState } from "vuex";

import ClientsModal from "./components/ClientsModal";
import DateMixing from "@/mixings/DateMixing";

export default {
  store,

  mixins: [DateMixing],

  props: {
    type: String,
    valuation: Object,
  },
  data() {
    return {
      // autos
      photos: [],
      plate: "",
      vin: "",
      brand: "",
      model: "",
      user: {},
      year: null,
      color: "",
      mileage: 0,
      description: "",

      clients: [],

      loadedClients: false,
      listeningClients: {},
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),
    modalTitle() {
      return this.type == "create" ? "Nueva Valuación" : "Editar Valuación";
    },
    modalButton() {
      return this.type == "create" ? "Añadir Valuación" : "Guardar Cambios";
    },
  },
  methods: {
    setPhotosToUpload(event) {
      var vm = this;
      var photos = vm.photos;
      vm.photos = [];
      event.target.files.forEach((file) => {
        console.log(file);

        var nav = window.URL || window.webkitURL;
        var url = nav.createObjectURL(file);
        file.source = url;
        photos.push(file);
      });
      setTimeout(() => {
        vm.photos = photos;
        vm.$forceUpdate();
        console.log(vm.photos);
      }, 200);
    },
    openClientsModal() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ClientsModal,
          componentProps: {
            propsData: {
              clients: this.clients,
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then((response) => {
            this.user = response.data;
          });
          m.present();
        });
    },
    getClients() {
      var clients = [];
      var listeningClients = firebaseApp
        .firestore()
        .collection("users")
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

    sendValuationData() {
      if (
        !this.plate ||
        !this.vin ||
        !this.brand ||
        !this.model ||
        !this.user ||
        !this.year ||
        !this.color ||
        !this.mileage
      ) {
        return this.$ionic.alertController
          .create({
            header: "Completa los campos",
            message: "Los campos de este formulario con (*) son obligatorios",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else {
        if (this.type == "create") {
          var totalPhotos = this.photos.length;
          var uploadedPhotos = [];

          var createValuation = () => {
            firebase.client
              .create("valuations", {
                photos: uploadedPhotos,
                plate: this.plate,
                vin: this.vin,
                brand: this.brand,
                model: this.model,
                user: this.user.id,
                year: this.year,
                color: this.color,
                mileage: this.mileage,
                description: this.description,
                dateStatic: this.createStaticDate()
              })
              .then(() => this.dismiss(true));
          };

          this.photos.forEach((photo) => {
            firebase.client
              .uploadImage(photo, this.currentUser.uid)
              .then((response) => {
                uploadedPhotos.push(response);
                if (totalPhotos == uploadedPhotos.length) {
                  createValuation().then(() => this.dismiss(true));
                }
              });
          });
        } else if (this.type == "edit") {
          firebase.client
            .update("valuations", this.valuation.id, {
              plate: this.plate,
              vin: this.vin,
              brand: this.brand,
              model: this.model,
              user: this.user.id || this.user,
              year: this.year,
              color: this.color,
              mileage: this.mileage,
              description: this.description,
            })
            .then(() => this.dismiss(true));
        }
      }
    },
    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    },
    setEditData() {
      if (this.type == "edit") {
        this.plate = this.valuation.plate;
        this.vin = this.valuation.vin;
        this.brand = this.valuation.brand;
        this.model = this.valuation.model;
        this.user = this.valuation.user;
        this.year = this.valuation.year;
        this.color = this.valuation.color;
        this.mileage = this.valuation.mileage;
        this.description = this.valuation.description;
      }
    },
  },
  mounted() {
    this.setEditData();
    this.getClients();
  },
};
</script>