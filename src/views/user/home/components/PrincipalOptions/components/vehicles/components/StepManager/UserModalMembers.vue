<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Miembros de {{ step.text }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <UserCheckBox
          @onMemberChange="userEvent"
          v-for="(item, i) of checklist"
          :key="i"
          :user-member="item"
        />
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-button @click="storeStepMembers(true)" expand="full" color="danger"
        >Salir</ion-button
      >
    </ion-footer>
  </ion-page>
</template>

<script>
import UserCheckBox from "./UserCheckBox";
import firebase from "@/firebase/";

export default {
  name: "UserModalMembers",

  components: {
    UserCheckBox,
  },

  data() {
    return {
      step: {},
      users: [],
      vehicle: {},
      members: [],
      checklist: [],
    };
  },

  methods: {
    userEvent(payload) {
      if (this.members.includes(payload)) {
        // con este filter filtramos todos los que no sean el que seleccionó
        // en pocas palabras, eliminando
        this.members = this.members.filter((id) => {
          if (id !== payload) return id;
        });
      } else {
        this.members.push(payload);
      }

      this.storeStepMembers(false);
    },

    async storeStepMembers(closeModal) {
      var v = this;
      try {
        this.vehicle.stepMembers[v.step.value] = this.members;
        await firebase.client
          .raw()
          .collection("vehicles")
          .doc(this.vehicle.id)
          .update({
            stepMembers: this.vehicle.stepMembers,
          });
        if (closeModal) {
          await this.closeModal();
        }
      } catch (e) {
        console.log(e);
      }
    },

    async closeModal() {
      return this.$ionic.modalController.dismiss();
    },
  },

  mounted() {
    var v = this;
    this.checklist = this.users
      .filter((user) => {
        return (
          v.vehicle.members.includes(user.id) ||
          (user.type == "external" && this.members.includes(user.id))
        );
      })
      .map((user) => {
        return {
          user,
          isMember: this.members.includes(user.id),
        };
      });
    console.log(this.checklist);
  },
};
</script>

<style scoped>
</style>