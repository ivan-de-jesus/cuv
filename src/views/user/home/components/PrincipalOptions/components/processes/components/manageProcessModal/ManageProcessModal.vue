<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">{{titleModal}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-slides
        v-if="photos.length && type === 'create' && ready"
        style="height:40vh"
        pager="true"
      >
        <ion-slide :key="index" v-for="(photo,index) in photos">
          <div>
            <img loading="lazy" :src="photo.source" />
          </div>

          <ion-button
            size="small"
            class="btn-remove-img"
            color="danger"
            @click="showConfirmDialogImage(photo)"
          >
            <ion-icon name="trash" />
          </ion-button>
        </ion-slide>

        <ion-slide style="background:#c1c1c1;">
          <label for="upload_vehicle_create_photo">
            <div style="height:40vh; text-align:center">
              <ion-icon
                name="add"
                style="color:white; width:100px;height:100px;margin-top: calc(20vh - 50px)"
              />
            </div>

            <ion-button class="btn-remove-img" size="small" @click="paste">
              <ion-icon name="clipboard" />
            </ion-button>
          </label>
        </ion-slide>
      </ion-slides>

      <ion-slides v-if="type === 'edit' && ready" style="height:40vh" pager="true">
        <ion-slide v-for="(photo, index) in photos" :key="index">
          <div>
            <img loading="lazy" :src="photo.source" />
          </div>

          <ion-button
            size="small"
            class="btn-remove-img"
            color="danger"
            @click="showConfirmDialogImage(photo)"
          >
            <ion-icon name="trash" />
          </ion-button>
        </ion-slide>

        <ion-slide style="background:#c1c1c1;">
          <label for="upload_vehicle_create_photo">
            <div style="height:40vh; text-align:center">
              <ion-icon
                name="add"
                style="color:white; width:100px;height:100px;margin-top: calc(20vh - 50px)"
              />
            </div>

            <ion-button class="btn-remove-img" size="small" @click="paste">
              <ion-icon name="clipboard" />
            </ion-button>
          </label>
        </ion-slide>
      </ion-slides>

      <label for="upload_vehicle_create_photo" v-else-if="type === 'create' && photos.length === 0">
        <div style="height:40vh; background:#c1c1c1;text-align:center">
          <ion-icon
            name="add"
            style="color:white; width:100px;height:100px;margin-top: calc(20vh - 50px)"
          />

          <ion-button class="btn-remove-img" size="small" @click="paste">
            <ion-icon name="clipboard" />
          </ion-button>
        </div>
      </label>

      <input
        @change="setPhotosToUpload"
        style="display:none"
        multiple
        id="upload_vehicle_create_photo"
        type="file"
      />

      <ion-item>
        <ion-label position="floating">Comentarios</ion-label>
        <ion-textarea :value="description" @ionInput="description = $event.target.value" />
      </ion-item>

      <!---- P R O C E S S   T Y P E ---->
      <ion-item v-if="proccessType == 'log'">
        <ion-label position="floating">Tipo de Registro</ion-label>
        <ion-select
          mode="ios"
          :disabled="vehicle.step === 5"
          :value="processType"
          @ionChange="processType = $event.detail.value"
        >
          <ion-select-option :value="0">Actividad</ion-select-option>
          <ion-select-option :value="1">Presupuesto</ion-select-option>
          <ion-select-option
            :value="2"
            v-if="vehicle.step === 1 && Departure === false || vehicle.step === 3 && Departure === false "
          >Salida</ion-select-option>
          <ion-select-option
            :value="3"
            v-if="vehicle.step === 1 && Departure === true || vehicle.step === 3 && Departure === true "
          >Entrada</ion-select-option>
        </ion-select>
      </ion-item>

      <!---- S T E P  ---->
      <ion-item v-else-if="proccessType == 'step'">
        <ion-label position="floating">Etapa</ion-label>

        <ion-select
          mode="ios"
          :disabled="type === 'edit' && process.stepConfirmed && !process.sameStep"
          :value="stageType"
          @ionChange="stageType = $event.detail.value"
        >
          <ion-select-option
            v-for="(item, key) in stages"
            :key="key"
            :value="item.value"
          >{{ item.text }}</ion-select-option>
        </ion-select>
      </ion-item>

      <!------------------------------------------------------------------------------------------------------>

      <ion-item v-if="stageType == 4">
        <ion-label position="floating">Utilidad Estimada</ion-label>
        <ion-input
          autocapitalize="on"
          type="number"
          @ionChange="utility = $event.target.value"
          :value="utility"
        />
      </ion-item>

      <ion-item v-if="stageType == 4" lines="full">
        <ion-label>Avalúos: ${{ totalInZero }}</ion-label>
      </ion-item>

      <ion-item v-if="stageType == 4" lines="full">
        <ion-label>Reparaciones: ${{ totalValue }}</ion-label>
      </ion-item>

      <ion-item v-if="stageType == 4" lines="full">
        <ion-label>
          <h1>Costo final: ${{ totalPrice }}</h1>
        </ion-label>
      </ion-item>

      <!------------------------------------------------------------------------------------------------------>

      <ion-item
        v-if="stageType == 3"
        lines="full"
        :disabled="type === 'edit' && process.stepConfirmed && !process.sameStep"
        button
        @click="openWorkshopSelect"
      >
        <ion-label>Taller</ion-label>
        {{ workshop && workshop.name ? `${workshop.name}`: '' }}
      </ion-item>

      <ion-item
        button
        @click="openClientsModal"
        :disabled="type === 'edit' && process.stepConfirmed && !process.sameStep"
        v-if="stageType == 6"
        lines="full"
      >
        <ion-label>Cliente</ion-label>
        {{user_1 && user_1.name ? `${user_1.name} ${user_1.lastname1} ${user_1.lastname2}` : ""}}
      </ion-item>

      <div v-if="processType == 1">
        <br />
        <Table
          v-if="type == 'edit' && concepts.length > 0"
          @ui-update="concepts = $event"
          :conceptsProp="concepts"
          type="edit"
          :disabled="process.budgetConfirmed && !process.sameStep"
        />
        <Table v-else @ui-update="concepts = $event" @hasErrors="hasErrrosHandler" />
      </div>

      <ion-list v-if="processType == 2">
        <ion-item>
          <ion-label position="floating">Licencia Vigente</ion-label>
          <ion-input
            autocapitalize="on"
            :value="validLicense"
            @ionInput="validLicense = $event.target.value"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Km. de Salida</ion-label>
          <ion-input autocapitalize="on" :value="outKm" @ionInput="outKm = $event.target.value" />
        </ion-item>

        <ion-item>
          <ion-label>Cupón de Gasolina</ion-label>
          <ion-checkbox :checked="gasCoupon" @ionChange="gasCoupon = !gasCoupon" />
        </ion-item>

        <ion-item>
          <ion-label>Hora de Salida</ion-label>

          <ion-select @ionChange="setOutHours" :value="outHours">
            <ion-select-option
              v-for="(outHours, key) in minHour"
              :key="key"
              :value="outHours"
            >{{ outHours }}</ion-select-option>
          </ion-select>

          <ion-select @ionChange="setOutMinutes" :value="outMinutes">
            <ion-select-option
              v-for="(minute, mKey) in minMinutes"
              :key="mKey"
              :value="minute"
            >{{ minute }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <ion-list v-if="processType == 3">
        <ion-item>
          <ion-label position="floating">Km. de Entrada</ion-label>
          <ion-input autocapitalize="on" :value="inKm" @ionInput="inKm = $event.target.value"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Hora de Entrada</ion-label>

          <ion-select @ionChange="setInHours" :value="inHours">
            <ion-select-option v-for="(hour, key) in minHour" :key="key" :value="hour">{{ hour }}</ion-select-option>
          </ion-select>

          <ion-select @ionChange="setInMinutes" :value="inMinutes">
            <ion-select-option
              v-for="(minute, mKey) in minMinutes"
              :key="mKey"
              :value="minute"
            >{{ minute }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-button
          @click="sendProcessData"
          expand="block"
          color="danger"
          :disabled="active && !process.sameStep || isOpen"
        >{{ btn_text }}</ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import firebase from "@/firebase";
import store from "@/store";
import { mapState } from "vuex";

import Table from "./components/budget/Table";
import { v4 as uuid } from "uuid";
import ClientsModal from "../../../meetings/components/ManageMeetingModal/components/ClientsModal";
import ProcessMixing from "../../../../../../../../../mixings/ProcessMixing";
import WorkshopSelectable from "../../../../../../../../../components/WorkshopSelectable";
import DateMixing from "@/mixings/DateMixing";

export default {
  store,

  props: {
    type: String,
    process: Object,
    vehicleId: String,
    isConfirmed: Boolean,
    disabled: Boolean,
    proccessType: String,
  },

  mixins: [ProcessMixing, DateMixing],

  data() {
    return {
      workshop: {},
      workshops: [],

      validLicense: null,
      outKm: null,
      inKm: null,
      gasCoupon: false,

      minHour: null,
      minMinutes: null,

      inHour: new Date(),
      inHours: null,
      inMinutes: null,

      outHour: new Date(),
      outHours: null,
      outMinutes: null,

      previousProcess: {},
      btn_text: "Agregar",
      clients: [],
      toStep: -1,
      user_1: {},
      photos: [],
      description: "",
      processType: 0,
      currentStageType: null,
      vehicle: {},

      totalValue: 0,
      totalInZero: 0,
      utility: "",

      // stageType es la etapa a la que se va a cambiar
      stageType: -1,
      waitingConfirmation: false,
      concepts: [],
      active: false,
      modified: false,
      ready: false,
      isOpen: false,

      final_ac: false,
      final_ac_exists: false,

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

      stages: [
        {
          text: "Mantenerse en esta etapa",
          value: -1,
        },
        {
          text: "Avalúo",
          value: 0,
        },
        {
          text: "Diagnóstico mecánico",
          value: 1,
        },
        {
          text: "Documentación",
          value: 2,
        },
        {
          text: "Taller Externo",
          value: 3,
        },
        {
          text: "Acondicionamiento Completo",
          value: 4,
        },
        /*{
          text: "Acondicionamiento Final",
          value: 5
        },*/
        {
          text: "Vendido",
          value: 6,
        },
      ],
      openingUserSelectModal: false,
      carStep: 0,

      Departure: false,

      DataEntry: {},
    };
  },
  components: {
    Table,
  },

  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    titleModal() {
      return this.type == "create" ? "Añadir Registro" : "Modificar Registro";
    },
    buttonModal() {
      return this.type == "create" ? "Agregar" : "Modificar";
    },

    totalPrice() {
      if (this.utility === "") return this.totalValue + this.totalInZero;
      return Number.parseInt(this.utility) + this.totalValue + this.totalInZero;
    },
  },

  methods: {
    setRangeTime() {
      console.log("entre");
      const hours = this.getCurrentHour();
      const minutes = this.getCurrentMinutes();

      if (hours < 10) {
        this.inHours = `0${hours}`;
        this.outHours = `0${hours}`;
      } else {
        this.inHours = `${hours}`;
        this.outHours = `${hours}`;
      }

      if (minutes < 10) {
        this.inMinutes = `0${minutes}`;
        this.outMinutes = `0${minutes}`;
      } else {
        this.inMinutes = `${minutes}`;
        this.outMinutes = `${minutes}`;
      }
      /*
      this.inHours = `${this.getCurrentHour()}`;
      this.inMinutes = `${this.getCurrentMinutes()}`;*/

      /*this.outHours = `${this.getCurrentHour()}`;
      this.outMinutes = `${this.getCurrentMinutes()}`;*/

      this.minHour = this.createArrayHours(this.getCurrentHour());
      this.minMinutes = this.createArrayMinutes(this.getCurrentMinutes());
    },

    setInHours({ target }) {
      this.inHour.setHours(Number.parseInt(target.value));
      this.inHours = target.value;

      if (this.inHour.getHours() > new Date().getHours()) {
        this.minMinutes = this.createArrayMinutes(0);
      } else {
        this.minMinutes = this.createArrayMinutes(new Date().getMinutes());
      }
    },

    setInMinutes({ target }) {
      this.inHour.setMinutes(Number.parseInt(target.value));
      this.inMinutes = target.value;
    },

    setOutHours({ target }) {
      this.outHour.setHours(Number.parseInt(target.value));
      this.outHours = target.value;

      if (this.outHour.getHours() > new Date().getHours()) {
        this.minMinutes = this.createArrayMinutes(0);
      } else {
        this.minMinutes = this.createArrayMinutes(new Date().getMinutes());
      }
    },

    setOutMinutes({ target }) {
      this.outHour.setMinutes(Number.parseInt(target.value));
      this.outMinutes = target.value;
    },

    createArrayMinutes(min) {
      const minutes = [];

      for (let i = min; i < 60; i++) {
        if (i < 10) {
          minutes.push(`0${i}`);
        } else {
          minutes.push(`${i}`);
        }
      }
      return minutes;
    },

    createArrayHours(min) {
      const hours = [];

      for (let i = min; i <= 23; i++) {
        if (i < 10) {
          hours.push(`0${i}`);
        } else {
          hours.push(`${i}`);
        }
      }

      return hours;
    },

    getCurrentHour() {
      let date = new Date();

      if (this.type === "edit") {
        if (this.process.processType === 2) {
          return Number.parseInt(this.process.outHours);
        } else {
          return Number.parseInt(this.process.inHours);
        }
      }

      return date.getHours();
    },

    getCurrentMinutes() {
      let date = new Date();

      if (this.type === "edit") {
        if (this.process.processType === 2) {
          return Number.parseInt(this.process.outMinutes);
        } else {
          return Number.parseInt(this.process.inMinutes);
        }
      }

      return date.getMinutes();
    },

    openClientsModal() {
      var vm = this;

      if (!this.openingUserSelectModal) {
        this.openingUserSelectModal = true;
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
              vm.openingUserSelectModal = false;
              vm.user_1 = response.data;
            });
            m.present();
          });
      }
    },

    openWorkshopSelect() {
      const vm = this;

      if (!this.openingUserSelectModal) {
        this.openingUserSelectModal = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: WorkshopSelectable,
            componentProps: {
              propsData: {
                clients: this.workshops,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then((response) => {
              vm.openingUserSelectModal = false;
              if (response.data !== false) {
                vm.workshop = response.data;
                var stepMembers3 = [];
                console.log(vm.workshop);
                vm.workshop.members.forEach((member) => {
                  stepMembers3.push(member.uid || member.id);
                  vm.vehicle.members.push(member.uid || member.id);
                });
                vm.vehicle.stepMembers[3] = stepMembers3;
              }
            });
            m.present();
          });
      }
    },

    async getWorkshops() {
      const response = await firebase.client
        .raw()
        .collection("locations")
        .where("type", "==", "workshop")
        .get();

      response.forEach((doc) => {
        this.workshops.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    },

    setEditData() {
      if (this.process && this.type === "edit") {
        this.stageType = this.process.toStep;
        this.description = this.process.description;
        this.processType = this.process.processType;

        this.concepts = [...this.process.concepts.map((el) => el)];
        /*this.stageType = this.process.step;*/

        if (this.processType === 2) {
          this.outKm = this.process.outKm;
          this.gasCoupon = this.process.gasCoupon;
          this.validLicense = this.process.validLicense;
          this.outHours = this.process.outHours;
          this.outMinutes = this.process.outMinutes;
        }

        if (this.processType === 3) {
          this.inKm = this.process.inKm;
          this.inHours = this.process.inHours;
          this.inMinutes = this.process.inMinutes;
        }

        if (this.process.hasOwnProperty("workshop")) {
          for (const workshop of this.workshops) {
            if (workshop.id === this.process.workshop) {
              this.workshop = workshop;
              break;
            }
          }
        }

        /**/
        if (
          this.process.toStep !== -1 &&
          (!process.stepConfirmed || !process.budgetConfirmed)
        ) {
          this.stageType = this.process.toStep;
        }
        /**/
      }
    },

    hasErrrosHandler(value) {
      this.active = value;
    },

    async getPreviousProcess() {
      if (this.process) {
        const result = await firebase.client
          .raw()
          .collection("processes")
          .where("vehicle", "==", this.process.vehicle)
          .limit(1)
          .orderBy("createdAt", "desc")
          .get();

        if (result.docs.length > 0) {
          this.previousProcess = result.docs[0].data();
        }
      } else {
        const result = await firebase.client
          .raw()
          .collection("processes")
          .where("vehicle", "==", this.vehicleId)
          .limit(1)
          .orderBy("createdAt", "desc")
          .get();

        if (result.docs.length > 0) {
          this.previousProcess = result.docs[0].data();
        }
      }
    },

    /* XsendProcessData() {
      if (!this.isOpen) {
        this.isOpen = true;
        var vm = this;
        let errors = false;

        const ok = () => {
          if (this.processType === false) {

            return this.$ionic.alertController
              .create({
                header: "Completa los campos",
                message: "Los campos de este formulario son obligatorios",
                buttons: ["Aceptar"]
              })
              .then(a => a.present());
          } else {
            if (this.type == "create") {
              var totalPhotos = this.photos.length;
              var uploadedPhotos = [];

              var createProcess = () => {
                var data = {
                  photos: uploadedPhotos,
                  processType: this.processType,
                  description: this.description,
                  vehicle: this.vehicleId,
                  createdBy: this.user.uid,
                  updatedBy: this.user.uid,
                  dateUpdate: new Date() + "",
                  createdAt: new Date() + "",
                  timestamp: new Date(),
                  concepts: this.concepts,
                  documentation: this.documentation,
                  sameStep: false
                };

                if (this.processType == 1) {
                  data.budgetConfirmed = false;
                }

                if (this.stageType != -1) {
                  data.stepConfirmed = false;
                  data.step = this.stageType;
                  data.sameStep = false;
                } else {
                  if (this.previousProcess.step !== undefined) {
                    console.log("entre")
                    data.step = this.previousProcess.step;
                    data.stepConfirmed = true;
                    data.sameStep = true;
                  } else {
                    data.step = 0;
                    data.stepConfirmed = false;
                    data.sameStep = false;
                  }
                }

                if (this.stageType == 5){
                  data.boughtBy = this.user_1.id;
                }

                firebase.client
                  .create("processes", data)
                  .then(() => {
                    vm.dismiss(true)
                    this.isOpen = false
                  });
              };

              if (this.photos.length) {
                this.photos.forEach(photo => {
                  firebase.client
                    .uploadImage(photo, this.vehicleId)
                    .then(response => {
                      uploadedPhotos.push(response);
                      if (totalPhotos == uploadedPhotos.length) {
                        createProcess();
                      }
                    });
                });
              } else {
                createProcess();
              }
            } else if (this.type == "edit") {
              firebase.client
                .create("history", {
                  data: vm.process,
                  id: vm.process.id,
                  collection: "processes"
                })
                .then(() => {
                  let data;
                  let type = Number.parseInt(this.process.processType);

                  if (type === 1 && !this.modified) {
                    console.log("IF")
                    console.log(this.modified)
                    data = {
                      processType: this.processType,
                      description: this.description,
                      concepts: this.concepts,
                      updatedBy: this.user.uid,
                      dateUpdate: new Date() + "",
                      documentation : this.process.documentation
                    };

                      console.log(data)

                    /!*if (this.stageType == 2) {
                      data.documentation = this.process.documentation;
                    }*!/

                    if (this.stageType == 5){
                      data.user = this.user_1.id;
                    }

                    firebase.client
                      .update("processes", this.process.id, data)
                      .then(() => {
                        vm.dismiss(true)
                        this.isOpen = false;
                      });

                        } else {
                          let currentStep = Number.parseInt(this.stageType);
                          let step = currentStep === -1 ? this.process.step : currentStep;

                          data = {
                            processType: this.processType,
                            step: step,
                            description: this.description,
                            concepts: this.concepts,
                            updatedBy: this.user.uid,
                            dateUpdate: new Date() + "",
                            documentation : this.process.documentation
                          }

                      if (Number.parseInt(this.stageType) === step) {
                        this.stageType = -1;
                      }

                      if (this.stageType != -1) {
                          data.stepConfirmed = false;
                          data.step = this.stageType;
                          data.sameStep = false;
                      } else {
                          if (this.previousProcess.step !== undefined) {
                              console.log("entre")
                              data.step = this.previousProcess.step;
                              data.stepConfirmed = true;
                              data.sameStep = true;
                          } else {
                              data.step = 0;
                              data.stepConfirmed = false;
                              data.sameStep = false;
                          }
                      }

                      console.log(data)

                          /!*if (this.stageType == 2) {
                            data.documentation = this.process.documentation;
                          }*!/

                          firebase.client
                            .update("processes", this.process.id, data)
                            .then(() => {
                              firebase.client
                                .update("vehicles", this.process.vehicle, {
                                  step: step
                                }).then(() => {
                                  vm.dismiss(true)
                                  this.isOpen = false;
                              });
                            });
                        }
                      });
            }
          }
        }

        if (this.processType === "1" && this.concepts.length === 0) { // PUSH BUTTON WITHOUT SET 1 CONCEPTS
          this.$ionic.alertController.create({
            header: "Completa los campos",
            message: "Concepto vacio o cantidades en 0 por favor verifique los campos",
            buttons: ["Aceptar"]
          }).then(a => a.present());
        }

        else if (this.processType === "1") { // CREATE CONCEPTS, ARRAY SIZE < 0

          for (let i = 0; i <this.concepts.length - 1; i++) {
            if (this.concepts[i].amount.length <= 0 || this.concepts[i].concept === "" || this.concepts[i].amount === 0) {
              errors = true; // FOUND ERROR ON AMMOUNT: "" OR CONCEPTS: ""
              break; // END LOOP
            } else {
              errors = false; // NO ERRORS FOUND
            }
          }

          if (errors) { // IF HAS ERRORS SHOW MODAL
            this.$ionic.alertController.create({
              header: "Completa los campos",
              message: "Concepto vacio o cantidades en 0 por favor verifique los campos",
              buttons: ["Aceptar"]
            }).then(a => a.present());
          }

          else { // CALL NORMAL PROCESS
            ok();
          }

        } else {
          ok();// ITS AN ACTIVITY
        }
      }
    },*/

    async sendProcessData() {
      if (!this.isOpen) {
        let errors = false;
        this.isOpen = true;

        if (this.processType === "1" && this.concepts.length === 0) {
          await this.createIonicAlert(
            "Completa los campos",
            "Concepto vacio o cantidades en 0 por favor verifique los campos"
          );
        } else if (this.processType === "1") {
          for (let i = 0; i < this.concepts.length - 1; i++) {
            if (
              this.concepts[i].amount.length <= 0 ||
              this.concepts[i].concept === "" ||
              this.concepts[i].amount === 0
            ) {
              errors = true;
              break;
            } else {
              errors = false;
            }
          }

          if (errors) {
            await this.createIonicAlert(
              "Completa los campos",
              "Concepto vacío o cantidades en 0 por favor verifique los campos"
            );
          } else {
            await this.saveOrEditProcess();
          }
        } else {
          await this.saveOrEditProcess();
        }
      }
    },

    async saveOrEditProcess() {
      /* PROCESS TYPE: [ACTIVITY, BUDGET] */
      /* STAGE TYPE: STEP */
      const data = {
        photos: this.type === "edit" ? this.process.photos : [],

        toStep: -1,
        processType: Number.parseInt(this.processType),
        step: Number.parseInt(this.stageType),

        concepts: this.concepts,
        documentation: this.documentation,
        description: this.description,
        vehicle: this.vehicleId || this.process.vehicle,

        createdBy: this.user.uid,
        updatedBy: this.user.uid,
        dateUpdate: `${new Date()}`,
        createdAt: `${new Date()}`,
        timestamp: Date.now(),
        dateStatic: this.createStaticDate()
      };

      if (this.type === "create") {
        if (data.processType === 1) {
          data.active = true;
          data.budgetConfirmed = false;
        }

        if (data.step !== -1) {
          data.toStep = data.step;
          data.stepConfirmed = false;
          data.toStep = data.step;
          data.step = this.vehicle.step;
          console.log(`CON CAMBIOS HACIA LA ETAPA: ${this.vehicle.step}`);
        } else {
          data.stepConfirmed = false;
          data.step = this.vehicle.step;
        }

        if (data.processType === 2) {
          data.validLicense = this.validLicense;
          data.outHours = this.outHours;
          data.outMinutes = this.outMinutes;
          data.gasCoupon = this.gasCoupon;
          data.outKm = this.outKm;
        }

        if (data.processType === 3) {
          data.inKm = this.inKm;
          data.inHours = this.inHours;
          data.inMinutes = this.inMinutes;

          data.outDate = this.DataEntry.createdAt;
          data.validLicense = this.DataEntry.validLicense;
          data.outHours = this.DataEntry.outHours;
          data.outMinutes = this.DataEntry.outMinutes;
          data.gasCoupon = this.DataEntry.gasCoupon;
          data.outKm = this.DataEntry.outKm;
        }

        if (Number.parseInt(this.stageType) === 3) {
          data.workshop = this.workshop.id;
        }

        if (Number.parseInt(this.stageType) === 4) {
          data.utility = Number.parseInt(this.utility);
        }

        if (Number.parseInt(this.stageType) === 6) {
          data.boughtBy = this.user_1.id;
        }

        if (this.photos.length > 0) {
          data.photos = await this.uploadImages(this.photos);
        }

        await firebase.client.create("processes", data);

        if (Number.parseInt(this.stageType) === 3 && this.workshop.name) {
          console.log("vehicles", data, this.vehicleId, this.vehicle);

          await firebase.client.update(
            "vehicles",
            this.vehicleId,
            this.vehicle
          );

          console.log("ok");
        }

        this.dismiss(true);
        this.isOpen = false;
      } else {
        const v = this;
        const setPhotos = async () => {
          if (v.photos.length > 0) {
            const newPhotos = await this.uploadImages(this.photos);

            data.photos = await firebase.client.getOnce(
              "processes",
              this.process.id
            );

            data.photos = data.photos.photos;

            for (const photo of newPhotos) data.photos.push(photo);
          }
        };

        await firebase.client.create("history", {
          data: this.process,
          id: this.process.id,
          collection: "processes",
          timestamp: firebase.client.genTimestamp(),
        });

        if (Number.parseInt(this.stageType) === 4) {
          data.utility = Number.parseInt(this.utility);
        }

        if (data.processType === 2) {
          data.validLicense = this.validLicense;
          data.outHours = this.outHours;
          data.outMinutes = this.outMinutes;
          data.gasCoupon = this.gasCoupon;
          data.outKm = this.outKm;
        }

        if (data.processType === 3) {
          data.inKm = this.inKm;
          data.inHours = this.inHours;
          data.inMinutes = this.inMinutes;

          data.outDate = this.DataEntry.createdAt;
          data.validLicense = this.DataEntry.validLicense;
          data.outHours = this.DataEntry.outHours;
          data.outMinutes = this.DataEntry.outMinutes;
          data.gasCoupon = this.DataEntry.gasCoupon;
          data.outKm = this.DataEntry.outKm;
        }

        data.dateUpdate = `${new Date()}`;
        delete data.createdAt;

        // TYPE BUDGET
        if (data.processType === 1 && data.step !== -1) {
          if (data.step !== -1 && data.step !== this.vehicle.step) {
            /**/
            data.toStep = data.step;
            data.stepConfirmed = false;
            data.toStep = data.step;
            data.step = this.vehicle.step;
          } else {
            data.stepConfirmed = false;
            data.step = this.vehicle.step;
          }

          if (Number.parseInt(this.stageType) === 5) {
            data.user = this.user_1.id;
          }

          await setPhotos();
          await firebase.client.update("processes", this.process.id, data);

          this.dismiss(true);
          this.isOpen = false;
        } else {
          if (data.step !== -1 && data.step !== this.vehicle.step) {
            /**/
            data.toStep = data.step;
            data.stepConfirmed = false;
            data.toStep = data.step;
            data.step = this.vehicle.step;
          } else {
            data.stepConfirmed = false;
            data.step = this.vehicle.step;
          }

          if (Number.parseInt(this.stageType) === 6) {
            data.boughtBy = this.user_1.id;
          }

          await setPhotos();

          await firebase.client.update("processes", this.process.id, data);

          this.dismiss(true);
          this.isOpen = false;
        }
      }
    },

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
        console.log(this.photos);
        console.log(vm.photos);

        vm.$forceUpdate();
      }, 200);

      console.log(this.ready);
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
            message: "Esta imagen ya es parte de la lista de fotos",
            duration: 4000,
            translucent: true,
          })
          .then((response) => response.present());
      }

      console.log(this.photos);
      setTimeout(() => (this.ready = true), 200);
    },

    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    },

    async getInfoPreProcess() {
      let exp;

      if (this.type == "edit") {
        exp = await firebase.client.getVehicle(this.process.vehicle);
        //this.stageType = exp.step;
      } else {
        exp = await firebase.client.getVehicle(this.vehicleId);
      }

      this.vehicle = exp;

      if (
        this.type == "edit" &&
        (this.process.processConfirmed || this.process.stepConfirmed)
      ) {
        this.currentStageType = exp.step;

        this.stageType = exp.step;

        /**/
        /*this.stages = this.stages.filter(
          item => item.value === Number.parseInt(this.currentStageType)
        );*/
        /**/

        this.active = true; // TODO: BOTTOM LOCK
      } else if (this.type == "edit") {
        this.currentStageType = exp.step;

        /*this.stages = this.stages.filter(
          item => item.value !== Number.parseInt(this.currentStageType)
        );*/

        /*this.stageType = -1;*/
      } else if (this.type == "create") {
        this.currentStageType = exp.step;

        this.stages = this.stages.filter(
          (item) => item.value !== Number.parseInt(this.currentStageType)
        );
      }
    },

    showConfirmDialogImage(object) {
      this.photos = this.photos.filter(
        (photoObj) => photoObj.source !== object.source
      );
    },

    async getUsers() {
      try {
        const resp = await firebase.client.raw().collection("users").get();

        resp.docs.map((item) => {
          this.clients.push({
            id: item.id,
            ...item.data(),
          });
        });
      } catch (e) {
        console.log(e);
      }
    },

    async calcTotal() {
      let cost = 0;
      let inZero = 0;

      let id = this.vehicleId || this.process.vehicle;

      const response = await firebase.client
        .raw()
        .collection("processes")
        .where("vehicle", "==", id)
        .where("budgetConfirmed", "==", true)
        .where("active", "==", true)
        .where("processType", "==", 1)
        .where("step", ">", 0)
        .get();

      const response2 = await firebase.client
        .raw()
        .collection("processes")
        .where("vehicle", "==", id)
        .where("budgetConfirmed", "==", true)
        .where("active", "==", true)
        .where("processType", "==", 1)
        .where("step", "==", 0)
        .get();

      response2.docs.forEach((doc) => {
        const data = doc.data();
        data.concepts.forEach((obj) => {
          if (obj.amount !== "") {
            inZero += Number.parseInt(obj.amount);
          }
        });
        this.totalInZero = inZero;
      });

      response.docs.forEach((doc) => {
        const data = doc.data();
        data.concepts.forEach((obj) => {
          if (obj.amount !== "") {
            cost += Number.parseInt(obj.amount);
          }
        });
      });
      this.totalValue = cost;
    },

    async getClient() {
      if (this.type === "edit" && this.process.boughtBy) {
        this.user_1 = await firebase.client.getOnce(
          "users",
          this.process.boughtBy
        );
        this.user_1.id = this.process.boughtBy;
      }
    },

    async getDeparture() {
      let id = this.vehicleId || this.process.vehicle;
      let a = 0;

      const request = await firebase.client
        .raw()
        .collection("processes")
        .where("vehicle", "==", id)
        .where("processType", "==", 2)
        .orderBy("timestamp")
        .get();

      const request2 = await firebase.client
        .raw()
        .collection("processes")
        .where("vehicle", "==", id)
        .where("processType", "==", 3)
        .get();

      if (request.size !== request2.size) {
        this.Departure = true;
      }

      request.docs.forEach((doc) => {
        const data = doc.data();
        a++;
        console.log(data);
        if (request.docs.length === a) {
          this.DataEntry = data;
        }
      });
    },
  },

  watch: {
    stageType: function (val) {
      let value = Number.parseInt(val);
      this.modified = value !== -1;
    },
  },

  async mounted() {
    this.setRangeTime();
    await this.getWorkshops();
    await this.getInfoPreProcess();
    await this.getPreviousProcess();
    await this.setEditData();
    await this.getClient();
    await this.calcTotal();
    await this.getDeparture();

    if (this.type === "edit") {
      this.btn_text = "Guardar";

      if (process.budgetConfirmed === null)
        this.process.budgetConfirmed = false;

      /*if (
        this.process.hasOwnProperty("utility") &&
        this.process.toStep === -1
      ) {
        this.final_ac = true;
      } else if (this.process.step === 5) {
        if (!this.final_ac_exists && this.vehicle.step === 5) {
          this.final_ac = true;
        }
      }*/

      if (this.process.hasOwnProperty("utility")) {
        this.utility = this.process.utility;
      }

      setTimeout(() => (this.ready = true), 300);
    } else {
      if (!this.final_ac_exists && this.vehicle.step === 5) {
        this.final_ac = true;
      }
    }

    await this.getUsers();
  },
};
</script>

<style>
.btn-remove-img {
  position: absolute;
  top: 8%;
  right: 4%;
}
</style>
