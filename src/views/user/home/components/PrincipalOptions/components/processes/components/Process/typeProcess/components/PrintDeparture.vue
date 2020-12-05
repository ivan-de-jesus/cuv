<template>
  <ion-page>
    <ion-content>
      <div class="budget-invoice">
        <div class="invoice-header">
          <img
            style="vertical-align:middle;width:130px;margin-right:5px"
            :src="require('@/assets/Print_Image.jpg')"
          />
          <h1 style="display:inline-block;vertical-align:middle">CUV</h1>
          <div style="vertical-align:middle" class="invoice-info" text-right>{{date}} <br/>Hora de Impresion {{time}}</div>
          <br />
          <div style="vertical-align:middle" class="invoice-info"> {{ client }} </div>
        </div>
        <br />

        <p>Asesor: {{clientData.name}}</p>
        <p>{{process.description}}</p>

        <h1>Datos del vehículo</h1>
        <br />

        <ion-grid>
          <ion-row>
            <ion-col>
              <b>VIN</b>
            </ion-col>
            <ion-col>{{vehicle.vin}}</ion-col>
            <ion-col>
              <b>Marca</b>
            </ion-col>
            <ion-col>{{vehicle.brand}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <b>Placas</b>
            </ion-col>
            <ion-col>{{vehicle.plate}}</ion-col>
            <ion-col>
              <b>Modelo</b>
            </ion-col>
            <ion-col>{{vehicle.model}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <b>Año</b>
            </ion-col>
            <ion-col>{{year}}</ion-col>
            <ion-col>
              <b>Color</b>
            </ion-col>
            <ion-col>{{vehicle.color}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <b>Asesor Comercial</b>
            </ion-col>
            <ion-col>{{vehicle.commercial_advisor ? advisor : "N/A"}}</ion-col>
            <ion-col>
              <b>Versión</b>
            </ion-col>
            <ion-col>{{vehicle.version}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <b>Kilometraje</b>
            </ion-col>
            <ion-col>{{vehicle.mileage}}</ion-col>
            <ion-col>
              <b>Transmisión</b>
            </ion-col>
            <ion-col>{{vehicle.transmission}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <b>Comentarios de vehiculo</b>
            </ion-col>
            <ion-col>{{vehicle.description}}</ion-col>
          </ion-row>
        </ion-grid>

        <h3>Datos de Salida</h3>

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
          <ion-row>
            <ion-col>
              <b>Fecha de Salida:</b>
            </ion-col>
            <ion-col>{{outDate}}</ion-col>
          </ion-row>
        </ion-grid>

        <h3>Datos de Entrada:</h3>

        <ion-grid>
          <ion-row>
            <ion-col>
              <b>Km. de Entrada:</b>
            </ion-col>
            <ion-col>{{process.inKm}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <b>Hora de Entrada:</b>
            </ion-col>
            <ion-col>{{process.inHours}}:{{process.inMinutes}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <b>Fecha de Entrada:</b>
            </ion-col>
            <ion-col>{{date}}</ion-col>
          </ion-row>
        </ion-grid>

        <br />
        <ion-button
          @click="dismiss"
          v-if="showPrint"
          expand="block"
          color="danger"
          fill="clear"
        >Volver</ion-button>
      </div>
      <ion-fab v-if="showPrint" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="print">
          <ion-icon name="print"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
import moment from "moment";
import firebase from "@/firebase";
export default {
  props: {
    process: Object,
    vehicle: Object,
    clientData: Object
  },
  data() {
    return {
      showPrint: true,
      client:"",
      advisor: '',
    };
  },
  computed: {

    time(){

      var date = new Date();

      if (date.getMinutes() < 10){
        return date.getHours() + ":0" + date.getMinutes();
      }
      return date.getHours() + ":" + date.getMinutes();
    },

    date() {
      var date = new Date();

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      const capitalize = s => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
      };
      return capitalize(date.toLocaleDateString("es-MX", options));
    },
    outDate() {
      var date = new Date(this.process.outDate);

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      const capitalize = s => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
      };
      return capitalize(date.toLocaleDateString("es-MX", options));
    },
    year() {
      return moment(this.vehicle.year).format("YYYY");
    }
  },
  methods: {
    print() {
      var vm = this;
      vm.showPrint = false;
      setTimeout(() => {
        window.print();
        vm.showPrint = true;
      }, 100);
    },
    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    },
    getclient() {
      firebase.client.getOnce("users" , this.vehicle.user).then( response =>{
        this.client = `${response.name} ${response.lastname1} ${response.lastname2}`;
      });
    },

    getAdvisor() {
      if (this.vehicle.commercial_advisor) {
        firebase.client.getOnce("users" , this.vehicle.commercial_advisor).then( response =>{
          this.advisor = `${response.name} ${response.lastname1} ${response.lastname2}`;
        });
      }
    },

  },
  mounted() {
    this.getclient();
    this.getAdvisor();
    this.getDeparture();
  }
};
</script>

<style>
.invoice-header {
  color: #333;
}

.invoice-info {
  padding: 10px;
  float: right;
}
</style>
