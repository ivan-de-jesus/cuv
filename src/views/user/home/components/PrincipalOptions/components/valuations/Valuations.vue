<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="stopListeningValuations(),$router.go(-1)">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">Valuaciones</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="!valuations.length && !loadedValuations" class="loading-section">
        <ion-spinner></ion-spinner>
      </div>
      <ion-list>
        <ValuationItem
          :valuation="valuation"
          :key="'valuation_' + valuation.id + index"
          v-for="(valuation, index) in valuations"
        />
      </ion-list>
    </ion-content>

    <!-- <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="createModal" color="danger">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>-->
  </ion-page>
</template>
<script>
import ManageValuationModal from "./components/ManageValuationModal/ManageValuationModal";
import ValuationItem from "./components/ValuationItem/ValuationItem";
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  components: { ValuationItem },
  data() {
    return {
      valuations: [],
      loadedValuations: false,
      listeningValuations: {},
    };
  },
  computed: {},
  methods: {
    getValuations() {
      var valuations = [];
      var listeningValuations = firebase
        .firestore()
        .collection("valuations")
        .onSnapshot((querySnapshot) => {
          valuations = [];
          querySnapshot.forEach((doc) => {
            valuations.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          this.valuations = valuations;
          this.loadedValuations = true;
        });

      this.listeningValuations = listeningValuations;
    },
    stopListeningValuations() {
      this.listeningValuations();
    },
    createModal() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ManageValuationModal,
          componentProps: {
            propsData: {
              type: "create",
            },
          },
        })
        .then((m) => m.present());
    },
  },

  mounted() {
    this.getValuations();
  },
};
</script>