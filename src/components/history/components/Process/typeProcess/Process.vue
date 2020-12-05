<template>
  <ion-slide>
    <div style="max-width:100vw; height:85vh; overflow:scroll">
      <ion-slides v-if="process.photos.length && ready" style="height:40vh;width:90vw" pager="true">
        <ion-slide :key="'photo_'+index" v-for="(photo,index) in process.photos">
          <div @click="showImg(photo)">
            <img  loading="lazy" style="width:90vw" :src="photo" />
          </div>
        </ion-slide>
      </ion-slides>
      <ion-list style="padding:0 !important">
        <ion-item lines="none">
          <ion-avatar slot="start">
            <img style="height: fit-content" :src="clientData.photoURL" />
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
              <h1 class="red-primary-text">Actividad</h1>
              <h6 class="primary-text">{{ process.step | stepValue}}</h6>
              <p>{{process.description}}</p>

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
              <h1>Salida</h1>

              <br />

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
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
      <!-- <pre>
                {{process}}
            </pre>
      <br />
      <pre>
              {{clientData}}
      </pre>-->
    </div>
  </ion-slide>
</template>

<script>
import firebase from "@/firebase";

export default {
  props: { process: Object },
  data() {
    return {
      ready: false,
      clientData: {},
      totalInZero: 0,
      totalValue: 0,
      total: 0,
      utility: "",
      totalCost: 0,
      client: "",
    };
  },
  computed: {
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

    totalPrice() {
      if (this.utility === "") return this.totalValue + this.totalInZero;
      return Number.parseInt(this.utility) + this.totalValue + this.totalInZero;
    }
  },
  methods: {
    getClient() {
      if (this.process.boughtBy) {
        firebase.client
          .getOnce("users", this.process.boughtBy)
          .then((response) => {
            this.client = `${response.name} ${response.lastname1} ${response.lastname2}`;
          });
      }
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

    getCreatedBy() {
      var vm = this;

      firebase.client
        .getOnce("users", vm.process.createdBy)
        .then(response => {
          vm.clientData = response;
        })
        .catch(error => {
          var errorCode;
          var errorMessage;

          var errorObjectMessage = {
            header: "Ha ocurrido un error",
            message: "No pudimos obtener al cliente programado para la cita"
          };

          if (error.code) {
            errorCode = error.code;
            errorMessage = error.message;
            errorObjectMessage = {
              header: errorCode,
              message: errorMessage
            };
          }

          const toast = this.$ionic.toastController.create({
            ...errorObjectMessage,
            duration: 4000,
            translucent: true
          });

          return toast.then(response => {
            response.present();
          });
        });
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

      response2.docs.forEach(doc => {
        const data = doc.data();
        data.concepts.forEach(obj => {
          if (obj.amount !== "") inZero += Number.parseInt(obj.amount);
        });
      });

      response.docs.forEach(doc => {
        const data = doc.data();
        data.concepts.forEach(obj => {
          if (obj.amount !== "") cost += Number.parseInt(obj.amount);
        });
      });

      this.totalValue = cost;
      this.totalInZero = inZero;
      this.total = cost + inZero + this.process.utility;
    }
  },
  async mounted() {
    this.getCreatedBy();
    await this.getClient()
    setTimeout(() => (this.ready = true), 200);
    if (this.process.toStep === 4) await this.calcTotal();
    if (this.process.toStep === 6) await this.finalPrice();
    if (this.process.hasOwnProperty("utility")) {
      this.utility = this.process.utility;
    }
  },

  filters: {
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
    }
  }
};
</script>

<style>
</style>