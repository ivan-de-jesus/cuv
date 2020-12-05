<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">{{vehicle.brand}} {{vehicle.model}} {{vehicle.year}}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="edit">
            <ion-icon color="dark" slot="icon-only" name="create"></ion-icon>
          </ion-button>
          <ion-button @click="verifyTrash">
            <ion-icon color="dark" slot="icon-only" name="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-slides v-if="vehicle.photos.length " style="height:40vh" pager="true">
        <ion-slide :key="'photo_'+index" v-for="(photo,index) in vehicle.photos">
          <div>
            <img loading="lazy" :src="photo" />
          </div>
        </ion-slide>
      </ion-slides>
      <ion-list>
        <ion-list-header>
          <ion-label>DATOS DEL VEHÍCULO</ion-label>
        </ion-list-header>
        <ion-item lines="full">
          <ion-label slot="start">VIN</ion-label>
          {{vehicle.vin}}
        </ion-item>
        <ion-item lines="full">
          <ion-label slot="start">Marca</ion-label>
          {{vehicle.brand}}
        </ion-item>
        <ion-item lines="full">
          <ion-label slot="start">Modelo</ion-label>
          {{vehicle.model}}
        </ion-item>
        <ion-item lines="full">
          <ion-label slot="start">Año</ion-label>
          {{year}}
        </ion-item>
        <ion-item lines="full">
          <ion-label slot="start">Color</ion-label>
          {{vehicle.color}}
        </ion-item>
        <ion-item lines="full">
          <ion-label slot="start">Kilometraje</ion-label>
          {{vehicle.mileage}}
        </ion-item>
        <ion-item lines="full">
          <ion-label slot="start">Descripción</ion-label>
          {{vehicle.description}}
        </ion-item>
      </ion-list>
      <!-- <pre>
          {{vehicle}}
      </pre>-->
      <!-- <ion-list>
        <ion-list-header>
          <ion-label>DATOS DEL CLIENTE</ion-label>
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
            <ion-icon slot="start" color="danger" name="person"></ion-icon>
            <ion-label>
              <span class="label-title">Número Telefónico</span>
              <h1>{{client.phone}}</h1>
            </ion-label>
          </ion-item>
        </a>
        <a :href="`mailto:${client.email}`">
          <ion-item button v-if="client.email">
            <ion-icon slot="start" color="danger" name="person"></ion-icon>
            <ion-label>
              <span class="label-title">Correo Electrónico</span>
              <h1>{{client.email}}</h1>
            </ion-label>
          </ion-item>
        </a>
        <ion-item v-if="client.address">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Dirección</span>
            <h1>{{client.address}}</h1>
          </ion-label>
        </ion-item>
      </ion-list>-->
    </ion-content>
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
import ManageValuationModal from "../ManageValuationModal/ManageValuationModal";
import moment from "moment";
export default {
  props: {
    vehicle: Object,
  },
  computed: {
    year() {
      return moment(this.vehicle.year).format("YYYY");
    },
  },
  methods: {
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
      return firebase.client.delete("vehicles", this.meeting.id);
    },
    edit() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ManageValuationModal,
          componentProps: {
            propsData: {
              type: "edit",
              vehicles: this.vehicles,
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then((response) => {
            if (response.data) {
              this.dismiss();
            }
          });
          m.present();
        });
    },
  },
};
</script>


















