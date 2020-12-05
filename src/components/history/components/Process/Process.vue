<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">Historial</ion-title>
      </ion-toolbar>
    </ion-header>

    <Process
      @getProcesses="$emit('getProcesses')"
      v-if="data.processType == 0"
      :process="data"
    />

    <Budget
      @getProcesses="$emit('getProcesses')"
      v-else-if="data.processType == 1"
      :process="data"
    />

    <Process
      @getProcesses="$emit('getProcesses')"
      v-if="data.toStep === 6"
      :process="data"
    />

    <!---SALIDA-->
    <DepartuteHistory
      @getProcesses="$emit('getProcesses')"
      @activeButton="$emit('activeButton')"
      v-else-if="data.processType === 3"
      :process="data"
      :vehicle="data"
      :disabled="true"
    />

    <!--ENTRADA-->
    <Process
      @getProcesses="$emit('getProcesses')"
      v-if="data.processType === 2"
      :process="data"
    />


  </ion-page>
</template>

<script>
import Process from "./typeProcess/Process";
import Budget from "./typeProcess/Budget";
import DepartuteHistory from "@/components/history/components/Process/typeProcess/DepartuteHistory";

export default {
  props: { data: Object },
  components: {DepartuteHistory, Process, Budget },
  methods: {
    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    },
  },
};
</script>

<style>
</style>