<template>
  <div v-if="process.sameStep !== true">
    <div v-if="process.toStep == 3">
      Taller Seleccionado:
      <b>{{workshop.name}}</b>
    </div>
    <ion-button
      color="danger"
      expand="block"
      class="ion-text-wrap"
      @click="confirmStep"
      v-if="isAdmin && !process.stepConfirmed && process.toStep !== -1"
      text-wrap
    >Confirmar Cambio a ({{stepName}})</ion-button>
    <ion-button
      color="danger"
      expand="block"
      disabled
      v-else-if="!isAdmin && !process.stepConfirmed && process.toStep !== -1"
      text-wrap
    >Esperando confirmación a ({{stepName}})</ion-button>
    <ion-button
      color="danger"
      expand="block"
      disabled
      class="ion-text-wrap"
      v-else-if="process.stepConfirmed"
      text-wrap
    >Etapa ({{stepName}}) Confirmado</ion-button>
  </div>
</template>

<script>
import firebase from "@/firebase";

export default {
  data() {
    return {
      workshop: {},
    };
  },
  props: {
    process: Object,
    isAdmin: Boolean,
  },
  computed: {
    stepName() {
      let number = Number.parseInt(this.process.toStep);

      switch (number) {
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
          return "";
      }
    },
  },
  methods: {
    confirmStep() {
      var vm = this;
      firebase.client
        .update("processes", this.process.id, {
          stepConfirmed: true,
        })
        .then(() => {
          vm.$emit("activeButton");
          vm.$emit("getProcesses");
          firebase.client
            .update("vehicles", this.process.vehicle, {
              step: vm.process.toStep,
            })
            .then(() => console.log("xd")); // TODO DELETE
        });
    },
  },
  async mounted() {
    if (this.process.toStep === 3) {
      this.workshop = await firebase.client.getOnce(
        "locations",
        this.process.workshop
      );
    }
  },
};
</script>

<style>
</style>