<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ modalTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- SLIDE WITH IMAGES -->
      <ion-slides
        v-if="photos.length && type === 'create' && ready"
        style="height: 40vh"
        pager="true"
      >
        <ion-slide :key="index" v-for="(photo, index) in photos">
          <div>
            <img :src="photo.source" alt />
          </div>

          <ion-button
            size="small"
            color="danger"
            @click="showConfirmDialogImage(photo)"
            class="btn-remove-img"
          >
            <ion-icon name="trash" />
          </ion-button>
        </ion-slide>

        <ion-slide style="background: #c1c1c1">
          <ion-button
            size="small"
            class="btn-paste-img-2"
            color="primary"
            @click="paste"
          >
            <ion-icon name="paper" />
          </ion-button>

          <label for="upload_vehicle_create_photo">
            <div>
              <div style="height: 40vh; text-align: center">
                <ion-icon
                  name="add"
                  style="
                    color: white;
                    width: 100px;
                    height: 100px;
                    margin-top: calc(20vh - 50px);
                  "
                ></ion-icon>
              </div>
            </div>
          </label>
        </ion-slide>
      </ion-slides>
      <!-- SLIDE WITH IMAGES -->

      <!--CREATE SQUARE--->
      <label for="upload_vehicle_create_photo" v-else-if="type == 'create'">
        <div style="height: 40vh; background: #c1c1c1; text-align: center">
          <ion-icon
            name="add"
            style="
              color: white;
              width: 100px;
              height: 100px;
              margin-top: calc(20vh - 50px);
            "
          ></ion-icon>
        </div>

        <ion-button size="small" class="btn-paste-img-1" @click="paste">
          <ion-icon name="paper" color="light" />
        </ion-button>
      </label>
      <!--CREATE SQUARE--->

      <!--EDIT-->
      <!--<label v-else-if="type == 'edit'" for="upload_vehicle_create_photo">
        <div style="height:40vh; background:#c1c1c1;text-align:center">
          <ion-icon
            name="add"
            style="color:white; width:100px;height:100px;margin-top: calc(20vh - 50px)" />
        </div>
      </label>-->

      <ion-slides
        v-if="type == 'edit' && ready"
        style="height: 40vh"
        pager="true"
      >
        <ion-slide v-for="(photo, index) in photos" :key="index">
          <div>
            <img :src="photo.source" />
          </div>

          <ion-button
            class="btn-remove-img"
            size="small"
            color="danger"
            @click="showConfirmDialogImage(photo)"
          >
            <ion-icon name="trash" />
          </ion-button>
        </ion-slide>
        <ion-slide style="background: #c1c1c1">
          <label for="upload_vehicle_create_photo">
            <div>
              <div style="height: 40vh; text-align: center">
                <ion-icon
                  name="add"
                  style="
                    color: white;
                    width: 100px;
                    height: 100px;
                    margin-top: calc(20vh - 50px);
                  "
                ></ion-icon>

                <ion-button size="small" class="btn-paste-img-1" @click="paste">
                  <ion-icon name="paper" color="light" />
                </ion-button>
              </div>
            </div>
          </label>
        </ion-slide>
      </ion-slides>

      <!--EDIT-->

      <input
        @change="setPhotosToUpload"
        style="display: none"
        multiple
        id="upload_vehicle_create_photo"
        type="file"
      />

      <!-- inputs -->

      <ion-list>
        <ion-item>
          <ion-label position="floating">Placas *</ion-label>
          <ion-input
            autocapitalize="on"
            :value="plate"
            @ionInput="plate = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-item lines="full" button @click="openClientsModal">
          <ion-label>Cliente *</ion-label>
          {{
            user && user.name
              ? `${user.name} ${user.lastname1} ${user.lastname2}`
              : ""
          }}
        </ion-item>
        <ion-item>
          <ion-label position="floating">VIN *</ion-label>
          <ion-input
            autocapitalize="on"
            maxlength="17"
            :value="vin"
            @ionInput="vin = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Marca *</ion-label>
          <ion-input
            autocapitalize="on"
            :value="brand"
            @ionInput="brand = $event.target.value"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Modelo *</ion-label>
          <ion-input
            autocapitalize="on"
            :value="model"
            @ionInput="model = $event.target.value"
          ></ion-input>
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
          />
        </ion-item>
        <ion-item>
          <ion-label position="floating">Color *</ion-label>
          <ion-input
            autocapitalize="on"
            :value="color"
            @ionInput="color = $event.target.value"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Kilometraje *</ion-label>
          <ion-input
            autocapitalize="on"
            :value="mileage"
            @ionInput="mileage = $event.target.value"
            type="number"
          ></ion-input>
        </ion-item>

        <!------------------------------------------------------->
        <!--
        <ion-item>
          <ion-label position="floating">Asesor comercial</ion-label>
          <ion-input autocapitalize="on" :value="commercial_advisor" @ionInput="commercial_advisor = $event.target.value" />
        </ion-item>
        -->

        <ion-item lines="full" button @click="openAdvisorsModal">
          <ion-label>Asesor comercial</ion-label>
          {{
            advisor && advisor.name
              ? `${advisor.name} ${advisor.lastname1} ${advisor.lastname2}`
              : ""
          }}
        </ion-item>

        <!------------------------------------------------------->

        <ion-item>
          <ion-label position="floating">Versión</ion-label>
          <ion-input
            autocapitalize="on"
            :value="version"
            @ionInput="version = $event.target.value"
          />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Transmisión</ion-label>
          <ion-input
            autocapitalize="on"
            :value="transmission"
            @ionInput="transmission = $event.target.value"
          />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Comentarios</ion-label>
          <ion-textarea
            :value="description"
            @ionInput="description = $event.target.value"
          ></ion-textarea>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-button
      @click="sendVehicleData"
      color="danger"
      expand="full"
      :disabled="isOpen"
      >{{ modalButton }}</ion-button
    >
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
import firebaseApp from "firebase/app";
import "firebase/firestore";

import store from "@/store";
import { mapState } from "vuex";

import ClientsModal from "./components/ClientsModal";
import validateData from "@/assets/js/validateData.js";

import { v4 as uuid } from "uuid";
import ImageMixing from "../../../../../../../../../mixings/ImageMixing";
import AdviserModal from "./components/AdviserModal";
import DateMixing from "@/mixings/DateMixing";

export default {
  store,
  props: {
    type: String,
    customUser: Object,
    customAdvisor: Object,
    vehicle: Object,
  },

  mixins: [ImageMixing, DateMixing],

  data() {
    return {
      currentVehicle: this.vehicle,
      // autos
      advisors: [],
      photos: [],
      plate: "",
      vin: "",
      brand: "",
      model: "",
      user: {},
      advisor: {},
      year: null,
      color: "",
      mileage: null,
      description: "",
      // NEW DATA
      //commercial_advisor: "",
      version: "",
      transmission: "",
      // END NEW DATA
      isAdmin: false,

      ready: false,

      clients: [],

      loadedClients: false,
      listeningClients: {},
      isOpen: false,

      stepMembers: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      },

      documentation: {
        invoice: false,
        invoices: false,
        circulationCard: false,
        certificate: false,
        holdings: [],
        identification: false,
        proofAddress: false,
        copyRFC: false,
        authorizationBilling: false,
        number: "",
        stateUnitToBuy: false,
      },
    };
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.user,
      my_branch_office: (state) => state.my_branch_office,
    }),
    modalTitle() {
      return this.type == "create" ? "Nuevo Vehículo" : "Editar Vehículo";
    },
    modalButton() {
      return this.type == "create" ? "Añadir Vehículo" : "Guardar Cambios";
    },
  },
  methods: {
    getFileExtension(filename) {
      return filename.split(".").pop();
    },

    setPhotosToUpload(event) {
      const vm = this;
      let photos = vm.photos;
      this.ready = false;

      vm.photos = [];

      event.target.files.forEach((file) => {
        const nav = window.URL || window.webkitURL;
        const url = nav.createObjectURL(file);
        file.source = url;
        const led = uuid();
        const ext = this.getFileExtension(file.name);
        const myNewFile = new File([file], led + "." + ext, {
          type: file.type,
        });
        myNewFile.source = url;
        photos.push(myNewFile);
      });

      setTimeout(() => {
        this.ready = true;

        if (this.type == "edit") {
          photos = photos.filter((item) => item instanceof Object);
          this.photos = photos;
        }

        vm.photos = photos;

        vm.$forceUpdate();
      }, 200);

      console.log(this.ready);
    },

    openAdvisorsModal() {
      if (!this.isOpen) {
        this.isOpen = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: AdviserModal,
            componentProps: {
              propsData: {
                clients: this.advisors,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then((response) => {
              if (response.data !== false) {
                this.advisor = response.data;
              }
              this.isOpen = false;
            });
            m.present();
          });
      }
    },

    openClientsModal() {
      if (!this.isOpen) {
        this.isOpen = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: ClientsModal,
            componentProps: {
              propsData: {
                clients: this.clients.filter(
                  (client) => client.type == "client"
                ),
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then((response) => {
              if (response.data !== false) {
                this.user = response.data;
              }
              this.isOpen = false;
            });
            m.present();
          });
      }
    },

    getClients() {
      let clients = [];
      this.listeningClients = firebaseApp
        .firestore()
        .collection("users")
        .where("type", "==", "client")
        .orderBy("dateUpdate", "desc")
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
    },

    async getAdvisors() {
      const response = await firebaseApp
        .firestore()
        .collection("users")
        .where("commercial_advisor", "==", true)
        .get();

      for (const advisor of response.docs) {
        const location = await firebaseApp
          .firestore()
          .collection("locations")
          .doc(advisor.data().location)
          .get();

        const mAdvisor = {
          id: advisor.id,
          ...advisor.data(),
        };

        mAdvisor.location = location.data();

        this.advisors.push(mAdvisor);
      }
    },

    async sendVehicleData() {
      const v = this;
      this.vin = this.vin.toUpperCase()
      console.log(this.vin)
      if (!this.isOpen) {
        this.isOpen = true;
        const responseVin = await firebase.client.getOnceVIN(
          "vehicles",
          this.vin
        );

        const responsePlate = await firebase.client.getOncePlate(
          "vehicles",
          this.plate
        );

        if (!responseVin.empty) {
          if (this.type === "edit") {
            const isThisVehicle = responseVin.docs.find(
              (doc) => doc.id === this.vehicle.id
            );

            if (isThisVehicle.length === 0) {
              await this.createIonicAlert(
                "VIN ya está en uso",
                "Los campos de este formulario con (*) son obligatorios"
              );
              this.isOpen = false;
              return;
            }
          } else {
            await this.createIonicAlert(
              "VIN ya está en uso",
              "Los campos de este formulario con (*) son obligatorios"
            );
            this.isOpen = false;
            return;
          }
        }

        if (!responsePlate.empty) {
          if (this.type === "edit") {
            const isThisVehiclePlate = responsePlate.docs.find(
              (doc) => doc.id === this.vehicle.id
            );

            if (isThisVehiclePlate.length === 0) {
              await this.createIonicAlert(
                "Placa ya está en uso",
                "Los campos de este formulario con (*) son obligatorios"
              );
              this.isOpen = false;
              return;
            }
          } else {
            await this.createIonicAlert(
              "Placa ya está en uso",
              "Los campos de este formulario con (*) son obligatorios"
            );
            this.isOpen = false;
            return;
          }
        }

        try {
          if (
            !this.plate ||
            !this.vin ||
            !this.brand ||
            !this.model ||
            (this.type === "create" && !this.user) ||
            !this.year ||
            !this.color ||
            !this.mileage
          ) {
            await this.createIonicAlert(
              "Completa los campos",
              "Los campos de este formulario con (*) son obligatorios"
            );

            this.isOpen = false;
          } else if (!validateData.number(this.mileage)) {
            await this.createIonicAlert(
              "Kilometraje inválido",
              "Escribe un Kilometraje valido"
            );

            this.isOpen = false;
          } else {
            const timestamp = firebaseApp.firestore.FieldValue.serverTimestamp();

            const data = {
              photos: this.type === "edit" ? this.vehicle.photos : [],
              plate: this.plate,
              vin: this.vin,
              brand: this.brand,
              model: this.model,
              user: v.user.id,
              year: this.year,
              color: this.color,
              mileage: this.mileage,
              members: [...this.user.members, this.currentUser.uid],
              description: this.description,
              createdBy: this.currentUser.uid,
              updatedBy: this.currentUser.uid,
              dateUpdate: new Date() + "",
              createdAt: timestamp,
              step: 0,
              transmission: this.transmission,
              version: this.version,
              documentation: this.documentation,
              dateStatic: this.createStaticDate(),
            };

            if (this.advisor) {
              data.commercial_advisor = this.advisor.id;
            }

            if (this.type === "create") {
              data.stepMembers = this.stepMembers;

              if (this.photos.length > 0) {
                data.photos = await this.uploadImages(this.photos);
              }

              data.branchoffice = this.my_branch_office;

              await this.createVehicle(this.vin, data);
              await this.dismiss(true);
            } else {
              data.id = v.vehicle.id;
              const temp = data;
              delete data.members;
              delete data.step;

              const setPhotos = async () => {
                if (v.photos.length > 0) {
                  const newPhotos = await this.uploadImages(v.photos);

                  data.photos = await firebase.client.getOnce(
                    "vehicles",
                    v.vehicle.id
                  );

                  data.photos = data.photos.photos;

                  for (const photo of newPhotos) data.photos.push(photo);
                }
              };

              await setPhotos();
              await this.createHistoric(this.vehicle, this.vehicle.id, data);

              this.vehicle = temp;

              await this.dismiss();
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          if (this.type !== "create") this.isOpen = false;
        }
      }
    },

    async dismiss(value) {
      //this.photos = [];

      if (this.type === "create") {
        await this.$ionic.modalController.dismiss(value);
      } else {
        if (this.advisor && this.advisor.id) {
          this.vehicle.commercial_advisor = this.advisor.id;
        }

        await this.$ionic.modalController.dismiss({
          value,
          mData: this.vehicle,
        });
      }
    },
    setEditData() {
      if (this.type === "edit") {
        this.plate = this.vehicle.plate;
        this.vin = this.vehicle.vin;
        this.brand = this.vehicle.brand;
        this.model = this.vehicle.model;
        this.user = this.vehicle.user;
        this.advisor = this.vehicle.advisor;
        this.year = this.vehicle.year;
        this.color = this.vehicle.color;
        this.mileage = this.vehicle.mileage;
        this.description = this.vehicle.description;
        this.transmission = this.vehicle.transmission;
        this.version = this.vehicle.version;
        /*this.commercial_advisor = this.vehicle.commercial_advisor;*/
      }
    },

    checkUser() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
    },

    // TODO:REMOVE IMAGE FROM CREATE DIALOG
    showConfirmDialogImage(object) {
      this.photos = this.photos.filter(
        (photoObj) => photoObj.source !== object.source
      );
    },

    paste() {
      this.ready = false;
      let onArray = false;
      const url = localStorage.getItem("photo");
      const file = new File([0], url);

      file.source = localStorage.getItem("photo");

      for (let i = 0; i < this.photos.length; i++) {
        if (this.photos[i].source === file.source) {
          onArray = true;
          break;
        }
      }

      if (!onArray) {
        this.photos.push(file);
      } else {
        this.$ionic.toastController
          .create({
            message: "La imagen ya es parte de la lista de imagenes",
            duration: 4000,
            translucent: true,
          })
          .then((response) => response.present());
      }

      setTimeout(() => (this.ready = true), 200);
    },
  },
  async mounted() {
    await this.setEditData();
    await this.getClients();
    await this.getAdvisors();
    await this.checkUser();
    this.user = this.customUser;
    this.advisor = this.customAdvisor;
    setTimeout(() => (this.ready = true), 300);
  },
};
</script>

<style>
.btn-remove-img {
  position: absolute;
  top: 2%;
  right: 2%;
}

.btn-paste-img-2 {
  position: absolute;
  top: 2%;
  right: 2%;
}

.btn-paste-img-1 {
  position: absolute;
  top: 2%;
  right: 2%;
}
</style>
