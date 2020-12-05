<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="stopListeningMeetings(),$router.go(-1)">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Citas</ion-title>
      </ion-toolbar>
      <ion-toolbar color="danger">
        <ion-searchbar mode="ios" placeholder="Buscar" @ionInput="search = $event.target.value" />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="!meetings.length && !loadedMeetings" class="loading-section">
        <ion-spinner></ion-spinner>
      </div>
      <ion-list>
        <MeetingItem
          :meeting="meeting"
          :key="'meeting_' + meeting.id + index"
          v-for="(meeting, index) in meetingsFiltered"
        />
      </ion-list>
    </ion-content>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="createModal" color="danger">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>
<script>
import { mapState } from "vuex";

import ManageMeetingModal from "./components/ManageMeetingModal/ManageMeetingModal";
import MeetingItem from "./components/MeetingItem/MeetingItem";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  components: { MeetingItem },
  data() {
    return {
      meetings: [],
      loadedMeetings: false,
      listeningMeetings: {},
      search: "",
      userIds: [],
      users: [],
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),
    meetingsFiltered() {
      let usersFiltered = this.users.filter((client) => {
        return (
          (client.name &&
            client.name.toLowerCase().includes(this.search.toLowerCase())) ||
          (client.lastname1 &&
            client.lastname1
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (client.lastname2 &&
            client.lastname2
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          `${client.name}${client.lastname1}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(this.search.replace(/ /g, "").toLowerCase()) ||
          `${client.name}${client.lastname1}${client.lastname2}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(this.search.replace(/ /g, "").toLowerCase())
        );
      });

      return this.meetings.filter((meeting) => {
        for (let i = 0; i < usersFiltered.length; i++) {
          if (usersFiltered[i].id === meeting.user) return meeting;
        }
      });

      //return this.meetings;
    },
  },

  methods: {
    getMeetings() {
      let meetings;
      if (this.currentUser.type !== "admin") {
        meetings = [];
        this.listeningMeetings = firebase

          .firestore()
          .collection("meetings")
          .where("createdBy", "==", this.currentUser.uid)
          .orderBy("dateUpdate", "desc")
          .onSnapshot((querySnapshot) => {
            meetings = [];
            querySnapshot.forEach((doc) => {
              meetings.push({
                id: doc.id,
                ...doc.data(),
              });
            });

            this.meetings = meetings;

            meetings.forEach((meeting) => {
              firebase
                .firestore()
                .collection("users")
                .doc(meeting.user)
                .get()
                .then((docs) => {
                  this.users.push({
                    id: docs.id,
                    ...docs.data(),
                  });
                })
                .catch((e) => console.log(e));
            });
            this.loadedMeetings = true;
          });
      } else {
        meetings = [];

        this.listeningMeetings = firebase
          .firestore()
          .collection("meetings")
          .orderBy("dateUpdate", "desc")
          .onSnapshot((querySnapshot) => {
            meetings = [];
            querySnapshot.forEach((doc) => {
              meetings.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            this.meetings = meetings;

            meetings.forEach((meeting) => {
              firebase
                .firestore()
                .collection("users")
                .doc(meeting.user)
                .get()
                .then((docs) => {
                  this.users.push({
                    id: docs.id,
                    ...docs.data(),
                  });
                })
                .catch((e) => console.log(e));
            });

            this.loadedMeetings = true;
          });
      }
    },
    stopListeningMeetings() {
      this.listeningMeetings();
    },
    createModal() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ManageMeetingModal,
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
    this.getMeetings();
  },
};
</script>