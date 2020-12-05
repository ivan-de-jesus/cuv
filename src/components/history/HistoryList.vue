<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Historial</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <template v-for="(history,index) in historyList">
          <ion-item
            @click="showHistoryVersion(history)"
            button
            v-if="createdByList[history.data.updatedBy]"
            :key="`history-item-${history.id}-${index}`"
          >
            <ion-avatar slot="start">
              <img loading="lazy" :src="createdByList[history.data.updatedBy].photoURL" />
            </ion-avatar>
            <ion-label text-wrap>
              <h2>{{createdByList[history.data.updatedBy].name}}</h2>
              <p>{{createdByList[history.data.updatedBy].phone}}</p>
              <!-- <pre>
                  {{history}}
              </pre>
              <pre>
                {{createdByList[history.data.updatedBy]}}
              </pre>-->
            </ion-label>
            <ion-note slot="end" color="danger">{{parseDate(history.data.dateUpdate)}}</ion-note>
          </ion-item>
        </template>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script>
import firebaseApp from "@/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

// modal components

import UserModal from "./components/UserModal";
import MeetingModal from "./components/MeetingModal";
import VehicleModal from "./components/VehicleModal";
import Process from "./components/Process/Process";

export default {
  props: {
    id: String,
    collection: String,
  },
  data() {
    return {
      historyList: [],
      loadedHistoryList: false,
      listeningHistoryList: null,
      clientData: {},
      createdByList: {},
    };
  },
  methods: {
    showHistoryVersion(history) {
      var component;

      switch (this.collection) {
        case "users":
          component = UserModal;
          break;

        case "meetings":
          component = MeetingModal;
          break;

        case "vehicles":
          component = VehicleModal;
          break;

        case "processes":
          component = Process;
          break;

        default:
          break;
      }

      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: component,
          componentProps: {
            propsData: {
              data: history.data,
            },
          },
        })
        .then((m) => m.present());
    },
    parseDate(date) {
      let originalDate;

      if (date instanceof Object) {
        originalDate = date.toDate();
      } else {
        originalDate = new Date(date);
      }

      let year = originalDate.getFullYear();
      let month = originalDate.getMonth() + 1;
      let day = originalDate.getDate();

      return `${day}/${month}/${year}`;
    },
    getHistory() {
      // var vm = this;

      var historyList = [];
      var listeningHistoryList = firebase
        .firestore()
        .collection("history")
        .where("collection", "==", this.collection)
        .orderBy("timestamp", "desc")
        .where("id", "==", this.id)
        .onSnapshot((querySnapshot) => {
          historyList = [];
          querySnapshot.forEach((doc) => {
            // vm.getCreatedBy(doc.data().data.updatedBy);
            historyList.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          console.log(historyList);

          this.historyList = historyList;
          this.loadedHistoryList = true;
          this.getCreatedBy();
        });

      this.listeningHistoryList = listeningHistoryList;
    },
    getCreatedBy() {
      var createdByList = {};

      this.historyList.forEach((item) => {
        createdByList[item.data.updatedBy] = true;
      });

      createdByList = Object.keys(createdByList);

      var vm = this;
      var usersList = this.createdByList;

      createdByList.forEach((userId) => {
        firebaseApp.client
          .getOnce("users", userId)
          .then((response) => {
            usersList[userId] = response;
            vm.createdByList = usersList;
            this.$forceUpdate();
          })
          .catch((error) => {
            var errorCode;
            var errorMessage;
            var errorObjectMessage = {
              header: "Ha ocurrido un error",
              message: "No pudimos obtener resultados",
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
      });
    },
    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    },
  },
  watch: {
    historyList() {
      this.getCreatedBy();
    },
  },
  created() {
    this.getHistory();
  },
};
</script>