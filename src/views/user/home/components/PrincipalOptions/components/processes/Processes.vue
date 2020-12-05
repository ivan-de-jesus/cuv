<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Seguimiento</ion-title>

        <ion-buttons slot="primary">
          <ion-button @click="getUpdates">
            <ion-icon slot="icon-only" name="sync"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-slides
        style="max-height: calc(100vh - 56px) !important"
        :scrollbar="true"
        v-if="processes.length"
        pager="true"
      >
        <template v-for="(process, index) in processes">
          <Process
            v-if="
              (process.step == 3 && currentUser.type == 'external') ||
              currentUser.type != 'external'
            "
            :scrollbar="true"
            :process="process"
            :vehicle="vehicle"
            :onStep="onStep"
            :step-members="vehicle.stepMembers"
            :key="'process_' + process.id + index"
            :disabled="disabled"
            @showModal="showModal"
            @getProcesses="getProcesses"
            @activeButton="needConfirmation = false"
          />
        </template>
      </ion-slides>

      <div v-else class="ion-padding">
        <h1>No hay Registros en la valuación de este vehículo</h1>
      </div>

      <vue-easy-lightbox
        :visible="visible"
        :imgs="url"
        moveDisabled
        @hide="closeModalImg"
      />

      <ion-fab
        vertical="bottom"
        horizontal="end"
        slot="fixed"
        v-if="((!needConfirmation && onStep) || isAdmin) && buttonLoaded"
        :disabled="disabled"
      >
        <ion-fab-button color="light" :disabled="disabled">
          <ion-icon color="danger" name="add" />
        </ion-fab-button>
        <ion-fab-list side="top">
          <div class="label-fab" style="position: absolute; bottom: 55px">
            Cambiar etapa
          </div>
          <ion-fab-button @click="createModal('log')">
            <ion-icon name="clipboard"></ion-icon>
          </ion-fab-button>
          <ion-fab-button
            v-if="currentUser.type != 'external'"
            @click="createModal('step')"
          >
            <ion-icon name="checkbox-outline"></ion-icon>
          </ion-fab-button>
          <div class="label-fab" style="position: absolute; bottom: 10px">
            Registro
          </div>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
import ManageProcessModal from "@/views/user/home/components/PrincipalOptions/components/processes/components/manageProcessModal/ManageProcessModal.vue";
import ImgModal from "@/components/ImgModal.vue";
import Process from "./components/Process/Process";
import store from "@/store";
import { mapState } from "vuex";

export default {
  store,

  props: {
    vehicleId: String,
    vehicle_: Object,
  },
  components: {
    Process,
  },
  data() {
    return {
      processes: [],
      needConfirmation: false,
      onStep: false,
      disabled: false,
      step: 0,
      isAdmin: false,
      isOpen: false,
      buttonLoaded: false,

      proces: {},

      visible: false,
      url: "",
      vehicle: this.vehicle_,
    };
  },

  methods: {
    showModal(photo) {
      this.visible = true;
      this.url = photo;
    },

    closeModalImg() {
      this.visible = false;
    },

    showImg(img) {
      var vm = this;

      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ImgModal,
          componentProps: {
            propsData: {
              img: img,
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then((response) => {
            if (response.data) {
              vm.getProcesses();
            }
          });
          m.present();
        });
    },
    getProcesses() {
      firebase.client.valuation
        .getProcesses(this.vehicleId)
        .then((response) => {
          this.processes = response;
          this.checkConfirmation();
          this.$forceUpdate();
        });
    },
    createModal(proccessType) {
      if (!this.isOpen) {
        const vm = this;
        this.disabled = true;
        this.isOpen = true;

        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: ManageProcessModal,
            componentProps: {
              propsData: {
                proccessType: proccessType,
                type: "create",
                vehicleId: vm.vehicleId,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then(async (response) => {
              this.disabled = false;
              this.isOpen = false;

              if (response.data) {
                vm.getProcesses();
              }

              await this.stateButton();
            });
            m.present();
          });
      }
    },

    dismiss() {
      this.$ionic.modalController.dismiss();
    },

    checkConfirmation() {
      firebase.client
        .getProccesById(this.vehicleId)
        .then((docs) => {
          let stepProcess = docs.filter((doc) => {
            if (doc.step === this.step || doc.toStep === this.step) return doc;
          });

          for (const process of stepProcess) {
            if (process.processType === 1) {
              if (!process.hasOwnProperty("budgetConfirmed")) {
                this.needConfirmation = true;
                break;
              }

              if (!process.budgetConfirmed) {
                this.needConfirmation = true;
                break;
              }
            } else {
              if (!process.stepConfirmed && process.toStep !== -1) {
                this.needConfirmation = true;
                break;
              }
            }
          }
        })
        .catch();
    },

    async getVehicleById() {
      /*firebase.client.getOnce("vehicles", this.vehicleId).then(response => {
        this.step = Number.parseInt(response.step);
        this.checkUser();
      });*/
      const response = await firebase.client.getOnce(
        "vehicles",
        this.vehicleId
      );
      this.vehicle = response;
      this.step = Number.parseInt(response.step);
      return this.checkUser();
    },

    checkUser() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
      this.onStep = this.vehicle.stepMembers[this.step].includes(
        this.currentUser.id || this.currentUser.uid
      );
      this.disabled = this.step === 5 && !this.isAdmin;
      // console.log(
      //   "ESTOY EN ETAPA?: " +
      //     this.vehicle.stepMembers[this.vehicle.step].includes(
      //       this.currentUser.uid
      //     )
      // );
    },

    async stateButton() {
      if (!this.isAdmin) {
        let a = 0;

        const response = await firebase.client
          .raw()
          .collection("processes")
          .where("vehicle", "==", this.vehicleId)
          .where("processType", "==", 2)
          .orderBy("timestamp")
          .get();

        response.docs.forEach((doc) => {
          const data = doc.data();
          console.log(" !data.processConfirmed", data);

          if (response.docs.length === a) {
            console.log(" !data.processConfirmed", !data.processConfirmed);
            this.disabled = !data.processConfirmed;
          }
          a++;
        });
      }
    },
    async getUpdates() {
      this.getProcesses();
      await this.getVehicleById();
      this.buttonLoaded = false;
      await this.getVehicleById();
      await this.getProcesses();

      if (!this.isAdmin) {
        await this.stateButton();
      }
      setTimeout(() => {
        this.buttonLoaded = true;
      }, 500);
    },
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),
  },

  async created() {
    await this.getVehicleById();
    await this.getProcesses();

    if (!this.isAdmin) {
      await this.stateButton();
    }
  },
  mounted() {
    setTimeout(() => {
      this.buttonLoaded = true;
    }, 500);
  },
};
</script>
<style>
.label-fab {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  right: 60px;
  color: white;
  padding: 5px;
  font-size: 12px;
  border-radius: 5px;
}
</style>