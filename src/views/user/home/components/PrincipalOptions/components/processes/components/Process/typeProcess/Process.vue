<template>
  <ion-slide>
    <div style="width:100vw; height:85vh; overflow:scroll">
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
            <img loading="lazy" style="height: fit-content" :src="clientData.photoURL" />
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
            <div style="float:right">
              <ion-button
                v-if="process.hasOwnProperty('utility')"
                @click="printUtility"
                fill="clear"
                :disabled="disabled"
              >
                <ion-icon color="danger" slot="icon-only" name="print"></ion-icon>
              </ion-button>
              <ion-button @click="toHistory" fill="clear">
                <ion-icon color="danger" slot="icon-only" name="filing"></ion-icon>
              </ion-button>
              <ion-button @click="edit" fill="clear" :disabled="!onStep && !isAdmin">
                <ion-icon color="danger" slot="icon-only" name="create"></ion-icon>
              </ion-button>
            </div>

            <h1 class="red-primary-text">{{titleProcess}}</h1>
            <h6 class="primary-text">{{ process.step | stepValue}}</h6>
            <p>{{process.description}}</p>
            <br />

            <div v-if="process.hasOwnProperty('utility') &&
                process.toStep === 4">
              <table style="width:100%">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        disabled
                        style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                        type="text"
                        value="Utilidad Estimada"
                      />
                    </td>
                    <td>
                      <div class="flex-box">
                        <ion-icon slot="start" color="danger" name="logo-usd" />
                        <input
                          disabled
                          style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                          :value="process.utility"
                          type="number"
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <input
                        disabled
                        style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                        type="text"
                        value="Avaluos"
                      />
                    </td>
                    <td>
                      <div class="flex-box">
                        <ion-icon slot="start" color="danger" name="logo-usd" />
                        <input
                          disabled
                          style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                          :value="totalInZero"
                          type="number"
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <input
                        disabled
                        style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                        type="text"
                        value="Reparaciones"
                      />
                    </td>
                    <td>
                      <div class="flex-box">
                        <ion-icon slot="start" color="danger" name="logo-usd" />
                        <input
                          disabled
                          style="width:100%;border:none;padding:10px;border-bottom:solid 1px #c1c1c1;"
                          :value="totalValue"
                          type="number"
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="text-align:right;">
                      <h1>Costo Final:</h1>
                    </td>
                    <td class="padding-1rem">
                      <input
                        style="border:none;padding:10px;width:100%;border-bottom:solid 1px #c1c1c1;"
                        type="number"
                        disabled
                        :value="total"
                      />
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="process.toStep === 6">
              <h1>{{client}}</h1>
              <br />
              <table>
                <tr>
                  <td style="text-align:left; width:45%">
                    <h1>Costo Final:</h1>
                  </td>
                  <td class="padding-1rem">
                    <input
                      style="border:none;padding:10px;width:100%;border-bottom:solid 1px #c1c1c1;"
                      disabled
                      :value="'$' + totalCost"
                    />
                  </td>
                </tr>
              </table>
            </div>

            <div v-if="process.processType == 2">
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <b>Licencia Vigente:</b>
                  </ion-col>
                  <ion-col>{{process.validLicense}}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <b>Km. de Salida:</b>
                  </ion-col>
                  <ion-col>{{process.outKm}}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <b>Hora de Salida:</b>
                  </ion-col>
                  <ion-col>{{process.outHours}}:{{process.outMinutes}}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <b>Cupón de Gasolina:</b>
                  </ion-col>
                  <ion-col v-if="process.gasCoupon">Si</ion-col>
                  <ion-col v-else>No</ion-col>
                </ion-row>
              </ion-grid>

              <ion-button
                expand="block"
                @click="confirm"
                v-if="isAdmin && !process.processConfirmed"
              >Confirmar Salida</ion-button>
              <ion-button
                expand="block"
                disabled
                v-else-if="!isAdmin && !process.processConfirmed"
                text-wrap
              >Esperando confirmación de Salida</ion-button>
              <ion-button
                expand="block"
                disabled
                v-else-if="process.processConfirmed"
                text-wrap
              >Salida Confirmada</ion-button>
              <ChangeStep
                v-if="process.hasOwnProperty('step') && process.step !== -1"
                :isAdmin="isAdmin"
                :process="process"
                @activeButton="$emit('activeButton')"
                @getProcesses="$emit('getProcesses')"
              />
              <ChangeStep
                v-if="process.hasOwnProperty('step') && process.step !== -1"
                :isAdmin="isAdmin"
                :process="process"
                @activeButton="$emit('activeButton')"
                @getProcesses="$emit('getProcesses')"
              />
            </div>

            <ChangeStep
              v-if="process.hasOwnProperty('step') && process.toStep !== -1"
              :isAdmin="isAdmin"
              :process="process"
              @activeButton="$emit('activeButton')"
              @getProcesses="$emit('getProcesses')"
            />
          </ion-label>
        </ion-item>
      </ion-list>
    </div>
  </ion-slide>
</template>

<script>
import firebase from "@/firebase";
import ManageProcessModal from "@/views/user/home/components/PrincipalOptions/components/processes/components/manageProcessModal/ManageProcessModal.vue";
import HistoryList from "@/components/history/HistoryList.vue";
import { mapState } from "vuex";
import store from "@/store";
import ChangeStep from "./ChangeStep";
import PrintUtility from "./components/PrintUtility";

export default {
  store,
  components: {
    ChangeStep,
  },
  props: {
    process: Object,
    disabled: Boolean,

    stepMembers: Object,
    user: String,
    vehicle: Object,
  },

  data() {
    return {
      onStep: false,
      clientData: {},
      isAdmin: false,
      isOpen: false,
      totalInZero: 0,
      totalValue: 0,
      total: 0,
      totalCost: 0,

      client: "",
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),

    titleProcess() {
      if (this.process.hasOwnProperty("utility") && this.process.toStep === 4) {
        return "Acondicionamiento Completo";
      } else if (this.process.toStep === 6) {
        return "Vendido";
      } else if (this.process.processType == 2) {
        return "Salida";
      } else {
        return "Actividad";
      }
    },

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
    printUtility() {
      var vm = this;
      console.log(vm.process);
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: PrintUtility,
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

    getclient() {
      if (this.process.boughtBy) {
        firebase.client
          .getOnce("users", this.process.boughtBy)
          .then((response) => {
            this.client = `${response.name} ${response.lastname1} ${response.lastname2}`;
          });
      }
    },

    showModalImg(photo) {
      this.$emit("showModal", photo);
    },

    confirm() {
      var vm = this;
      firebase.client
        .update("processes", this.process.id, {
          processConfirmed: true, // TODO: INDEPEDIENT
          waitingConfirmation: false,
        })
        .then(() => {
          vm.$emit("activeButton");
          vm.$emit("getProcesses");
        });
    },

    toHistory() {
      if (!this.isOpen) {
        this.isOpen = true;
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
            m.onDidDismiss().then(() => (this.isOpen = false));
            m.present();
          });
      }
    },
    edit() {
      if (!this.isOpen) {
        this.isOpen = true;
        var vm = this;
        var process = this.process;

        // TODO: ESTE ES EL CARD QUE ME LLEVA A LA EDICIÓNDE PROCESOS
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
              vm.isOpen = false;
            });
            m.present();
          });
      }
    },

    checkConfirmation() {
      if (this.process.processConfirmed !== undefined) return true;
      else return this.process.stepConfirmed !== undefined;
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

    removeImageFromDb(source) {
      this.process.photos = this.process.photos.filter(
        (photo) => photo !== source
      );
      firebase.client
        .update("processes", this.process.id, this.process)
        .catch((e) => console.log("Error" + e));
    },

    async getTotalPrice() {
      /*if (this.process.step === 6) {
        const response = await firebase.client.raw()
          .collection('processes')
          .where('vehicle', '==', this.process.vehicle)
          .get();

        response.docs.forEach(doc => {
          if (doc.data().step === 5 && doc.data().hasOwnProperty('utility')) {
            this.total = doc.data().totalPrice;
          }
        });
      }*/
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

    async finalPrice() {
      let cost = 0;
      let inZero = 0;
      let utilities = 0;

      let id = this.process.vehicle;

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
          if (obj.amount !== "") inZero += Number.parseInt(obj.amount);
        });
      });

      response.docs.forEach((doc) => {
        const data = doc.data();
        data.concepts.forEach((obj) => {
          if (obj.amount !== "") cost += Number.parseInt(obj.amount);
        });
      });

      const response3 = await firebase.client
        .raw()
        .collection("processes")
        .where("vehicle", "==", id)
        .where("toStep", "==", 4)
        .get();

      response3.docs.forEach((doc) => {
        utilities = doc.data().utility;
      });

      this.totalCost = cost + inZero + utilities;
    },

    async calcTotal() {
      let cost = 0;
      let inZero = 0;

      let id = this.process.vehicle;

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
          if (obj.amount !== "") inZero += Number.parseInt(obj.amount);
        });
      });

      response.docs.forEach((doc) => {
        const data = doc.data();
        data.concepts.forEach((obj) => {
          if (obj.amount !== "") cost += Number.parseInt(obj.amount);
        });
      });

      this.totalValue = cost;
      this.totalInZero = inZero;
      this.total = cost + inZero + this.process.utility;
    },
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
          return "Diagnóstico mecánico";
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

  async mounted() {
    this.getclient();
    await this.getCreatedBy();
    await this.checkUser();
    await this.getTotalPrice();

    if (this.process.toStep === 4) await this.calcTotal();
    if (this.process.toStep === 6) await this.finalPrice();

    this.onStep =
      this.stepMembers[this.process.step].includes(this.currentUser.uid) &&
      this.process.step === this.vehicle.step;
  },
};
</script>

<style>
</style>
