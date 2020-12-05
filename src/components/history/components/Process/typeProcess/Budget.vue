<template>
  <ion-slide>
    <div style="max-width:100vw; height:85vh; overflow:scroll">
      <ion-slides v-if="process.photos.length && ready" style="height:40vh;width:90vw" pager="true">
        <ion-slide :key="'photo_'+index" v-for="(photo,index) in process.photos">
          <div @click="showImg(photo)">
            <img loading="lazy" style="width:90vw" :src="photo" />
          </div>
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
              <h1 class="blue-primary-text">Presupuesto</h1>
              <h6 class="red-primary-text">{{ process.step | stepValue}}</h6>
              <p>{{process.description}}</p>
              <br />
              <br />
              <Table :conceptsProp="concepts" :disabled="true" type="show" />
              <br />
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
import Table from "@/views/user/home/components/PrincipalOptions/components/processes/components/manageProcessModal/components/budget/Table.vue";

export default {
  props: { process: Object },
  components: {
    Table
  },
  data() {
    return {
      clientData: {},
      ready: false,
      concepts: this.process.concepts
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
    }
  },
  methods: {
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
            message: "No pudimos obtener al usuario de la cita"
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
    }
  },
  mounted() {
    this.getCreatedBy();

    setTimeout(() => (this.ready = true), 200);
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