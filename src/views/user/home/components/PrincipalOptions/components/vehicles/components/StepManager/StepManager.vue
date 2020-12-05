<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="$ionic.modalController.dismiss()">
            <ion-icon slot="icon-only" name="arrow-back" />
          </ion-button>
        </ion-buttons>
        <ion-title>Miembros por etapa</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item
          button
          v-for="(step, index) of steps"
          :key="index"
          @click="openMembersModal(step)"
        >
          <ion-label>{{ step.text }}</ion-label>
          <ion-icon color="dark" name="people" />
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import firebase from "@/firebase/";
import UserModalMembers from "./UserModalMembers";

export default {
  name: "StepManager",

  data() {
    return {
      users: [],
      steps: [
        { value: 0, text: "Avalúo" },
        { value: 1, text: "Diagnóstico mecánico" },
        { value: 2, text: "Documentación" },
        { value: 3, text: "Taller Externo" },
        { value: 4, text: "Acondicionamiento Completo" },
        // { value: 5, text: "Acondicionamiento Final" },
        { value: 6, text: "Vendido" },
      ],
    };
  },

  props: {
    vehicle: Object,
  },

  methods: {
    async getMembers() {
      try {
        const users = await firebase.client.raw().collection("users").get();

        for (const doc of users.docs) {
          const { id } = doc;
          const data = doc.data();

          if (data.type !== "client") {
            this.users.push({ id, ...data });
          }
        }
      } catch (e) {
        console.log(`ERROR OBTENIENDO USUARIOS DE ETAPA: ${e}`);
      }
    },

    checkVehicleMembers() {
      if (!this.vehicle.stepMembers) {
        this.vehicle.stepMembers = {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
        };
      }
    },

    async openMembersModal(step) {
      console.log(this.vehicle.stepMembers, step);

      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: UserModalMembers,
          componentProps: {
            data: {
              step,
              vehicle: this.vehicle,
              users: this.users,
              members: this.vehicle.stepMembers[step.value],
            },
          },
        })
        .then((m) => m.present());
    },
  },

  async mounted() {
    // TODO: CHECK IF VEHICLE HAS PROPERTY MEMBERS
    this.checkVehicleMembers();
    await this.getMembers();
  },
};
</script>

<style scoped>
</style>
