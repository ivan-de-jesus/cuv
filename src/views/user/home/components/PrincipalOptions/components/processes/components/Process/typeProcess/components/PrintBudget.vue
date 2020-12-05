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
          <div style="vertical-align:middle" class="invoice-info">{{date}}</div>
          <br />
          <div style="vertical-align:middle" class="invoice-info">{{ client }}</div>
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

        <br />
        <h1>Presupuesto</h1>
        <section v-if="process.step == 3">
          <h3>Taller: {{workshop.name}}</h3>
        </section>
        <br />
        <br />
        <Table :disabled="true" type="show" :conceptsProp="process.concepts" />
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
import Table from "@/views/user/home/components/PrincipalOptions/components/processes/components/manageProcessModal/components/budget/Table.vue";
import firebase from "@/firebase";
export default {
  props: {
    vehicle: Object,
    process: Object,
    clientData: Object,
  },
  components: {
    Table,
  },
  data() {
    return {
      showPrint: true,
      client: "",
      advisor: "",
      workshop: "",
    };
  },
  computed: {
    date() {
      var date = new Date(this.process.createdAt);

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const capitalize = (s) => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
      };
      return capitalize(date.toLocaleDateString("es-MX", options));
    },
    year() {
      return moment(this.vehicle.year).format("YYYY");
    },
  },
  methods: {
    getProcess() {
      var v = this;
      firebase.client.valuation
        .getProcesses(this.vehicle.id)
        .then(async (response) => {
          var processes = response;
          setTimeout(async () => {
            const index = response.findIndex((el) => {
              return el.id == v.process.id;
            });
            var counter = index;

            async function findExternal() {
              if (
                processes[counter + 1].toStep &&
                processes[counter + 1].toStep == 3
              ) {
                v.workshop = await firebase.client.getOnce(
                  "locations",
                  processes[counter + 1].workshop
                );
              } else {
                counter--;
                if (counter > -1) await findExternal();
              }
            }
            await findExternal();

            this.$forceUpdate();
          }, 1000);
        });
    },
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
      firebase.client.getOnce("users", this.vehicle.user).then((response) => {
        this.client = `${response.name} ${response.lastname1} ${response.lastname2}`;
      });
    },

    getAdvisor() {
      if (this.vehicle.commercial_advisor) {
        firebase.client
          .getOnce("users", this.vehicle.commercial_advisor)
          .then((response) => {
            this.advisor = `${response.name} ${response.lastname1} ${response.lastname2}`;
          });
      }
    },
  },
  mounted() {
    this.getclient();
    this.getAdvisor();
    this.getProcess();
  },
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