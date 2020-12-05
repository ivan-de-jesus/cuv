<template>
  <ion-slide>
    <div style="max-width:100vw; height:85vh; overflow:scroll">
      <ion-slides v-if="process.photos.length " style="height:40vh;width:90vw" pager="true">
        <ion-slide :key="'photo_'+index" v-for="(photo,index) in process.photos">
          <div>
            <img loading="lazy" style="width:90vw" :src="photo" @click="showModalImg(photo)" />
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
        </ion-slide>
      </ion-slides>
      <ion-list style="padding:0 !important">
        <ion-item lines="none">
          <ion-avatar slot="start">
            <img loading="lazy" style="height: fit-content" :src="clientData.photoURL" alt />
          </ion-avatar>
          <ion-label text-wrap>
            <h2>{{clientData.name}}</h2>
            <p>{{ clientData.type | accountType }}</p>
          </ion-label>
          <div style="text-align:right">
            {{date}}
            <br />
            {{hour}}
          </div>
        </ion-item>
        <ion-item lines="none">
          <ion-label text-wrap>
            <div>
              <h1 class="red-primary-text">Presupuesto</h1>

              <div style="float:right">
                <ion-button @click="toHistory" fill="clear">
                  <ion-icon color="danger" slot="icon-only" name="filing"></ion-icon>
                </ion-button>
                <ion-button
                  @click="edit"
                  fill="clear"
                  :disabled="process.budgetConfirmed && !isAdmin || !onStep && !isAdmin"
                >
                  <ion-icon color="danger" slot="icon-only" name="create"></ion-icon>
                </ion-button>
                <ion-button @click="print" fill="clear" :disabled="disabled">
                  <ion-icon color="danger" slot="icon-only" name="print"></ion-icon>
                </ion-button>
              </div>
              <h6 class="blue-primary-text">{{ process.step | stepValue}}</h6>
              <p>{{process.description}}</p>
              <br />
              <Table :conceptsProp="concepts" :disabled="true" type="show" />

              <ion-item lines="none" v-if="isAdmin">
                <ion-label>Estado: {{ isActive? 'Activo' : 'Inactivo' }}</ion-label>
                <ion-toggle :checked="isActive" @ionChange="changeState" />
              </ion-item>
              <br />

              <ion-button
                expand="block"
                @click="confirmBudget"
                v-if="isAdmin && !process.budgetConfirmed"
              >Confirmar Presupuesto</ion-button>
              <ion-button
                expand="block"
                disabled
                v-else-if="!isAdmin && !process.budgetConfirmed"
                text-wrap
              >Esperando confirmación de presupuesto</ion-button>
              <ion-button
                expand="block"
                disabled
                v-else-if="process.budgetConfirmed"
                text-wrap
              >Presupuesto Confirmado</ion-button>
              <ChangeStep
                v-if="process.hasOwnProperty('step') && process.step != -1"
                :isAdmin="isAdmin"
                :process="process"
                @activeButton="$emit('activeButton')"
                @getProcesses="$emit('getProcesses')"
              />
              <!-- <div v-if="isAdmin">
                <ion-button
                  v-if="!process.stepConfirmed"
                  expand="block"
                  @click="confirm"
                >Confirmar cambio ()</ion-button>
                <ion-button v-else expand="block" disabled>Presupuesto confirmado</ion-button>
              </div>

              <div v-else>
                <ion-button
                  v-if="!process.stepConfirmed"
                  expand="block"
                  disabled
                >Esperando confirmacion</ion-button>
                <ion-button v-else expand="block" disabled>Presupuesto confirmado</ion-button>
              </div>-->
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
    </div>
  </ion-slide>
</template>

<script>
import firebase from "@/firebase";
import Table from "../../manageProcessModal/components/budget/Table";
import ManageProcessModal from "@/views/user/home/components/PrincipalOptions/components/processes/components/manageProcessModal/ManageProcessModal.vue";
import HistoryList from "@/components/history/HistoryList.vue";
import PrintBudget from "./components/PrintBudget.vue";
import store from "@/store";

import ChangeStep from "./ChangeStep";

import { mapState } from "vuex";

export default {
  store,
  props: {
    stepMembers: Object,
    process: Object,
    vehicle: Object,
    disabled: Boolean,
  },
  components: {
    ChangeStep,
    Table,
  },
  data() {
    return {
      clientData: {},
      onStep: false,
      concepts: this.process.concepts,
      isAdmin: false,
      isActive: false,
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),

    date() {
      var date = new Date(this.process.createdAt);

      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      return `
      ${day}/${month}/${year}`;
    },
    hour() {
      var date = new Date(this.process.createdAt);

      var hour = date.getHours();
      var minutes = date.getMinutes();

      return `
      ${hour}:${minutes}`;
    },
  },
  methods: {
    showModalImg(photo) {
      this.$emit("showModal", photo);
    },

    showConfirmDialogImage(source) {
      this.$ionic.alertController
        .create({
          header: "Confirmación",
          message:
            "Estas seguro de eliminar esta imagen, la operación no se puede revertir",
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

    async changeState() {
      this.isActive = !this.isActive;

      await firebase.client.update("processes", this.process.id, {
        active: this.isActive,
      });

      this.$emit("getProcesses");
    },

    removeImageFromDb(source) {
      this.process.photos = this.process.photos.filter(
        (photo) => photo !== source
      );
      firebase.client
        .update("processes", this.process.id, this.process)
        .catch((e) => console.log("Error" + e));
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

    print() {
      var vm = this;
      console.log(vm.process);

      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: PrintBudget,
          componentProps: {
            propsData: {
              process: vm.process,
              vehicle: vm.vehicle,
              clientData: vm.clientData,

              collection: "processes",
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then(() => {});
          m.present();
        });
    },
    checkUser() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
    },

    toHistory() {
      var vm = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: HistoryList,
          componentProps: {
            propsData: {
              id: vm.process.id,
              collection: "processes",
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then(() => {});
          m.present();
        });
    },
    confirmBudget() {
      var vm = this;
      firebase.client
        .update("processes", this.process.id, {
          budgetConfirmed: true,
        })
        .then(() => {
          vm.$emit("activeButton");
          vm.$emit("getProcesses");
        });
    },
    edit() {
      // TODO: ESTE CARD ME LLEVA A LA EDICIÓNDE UN PRESUPUESTO

      var vm = this;
      var process = this.process;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ManageProcessModal,
          componentProps: {
            propsData: {
              type: "edit",
              process: process,
              isConfirmed: this.checkConfirmation(),
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then(() => {
            vm.$emit("getProcesses");
            // console.log(response.data);
            // console.log(response);
            // if (response.data) {
            //   console.log("si");
            //   vm.getProcesses();
            // } else {
            //   console.log("no");
            // }
          });
          m.present();
        });
    },
    getCreatedBy() {
      var vm = this;

      firebase.client
        .getOnce("users", vm.process.createdBy)
        .then((response) => {
          vm.clientData = response;
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

    checkConfirmation() {
      if (this.process.processConfirmed !== undefined) return true;
      else return this.process.stepConfirmed !== undefined;
    },
  },
  mounted() {
    this.getCreatedBy();
    this.checkUser();
    this.isActive = this.process.active;

    this.onStep = this.stepMembers[this.process.step].includes(
      this.currentUser.uid
    );
    console.log(this.onStep);
  },

  filters: {
    accountType(text) {
      switch (text) {
        case "admin":
          return "Administrador";
        case "manager":
          return "Gerente";
        case "client":
          return "Cliente";
        case "adviser":
          return "Asesor";
      }
    },

    stepValue(step) {
      switch (step) {
        case 0:
          return "Avalúo";
        case 1:
          return "Diagnóstico Mecánico";
        case 2:
          return "Documentación";
        case 3:
          return "Taller Externo";
        case 4:
          return "Acondicionamiento Completo";
        case 5:
          return "Acondicionamiento Final";
        case 6:
          return "Vendido";
        default:
          return "NO COINCIDE EL VALOR DE ETAPA " + step;
      }
    },
  },
};
</script>