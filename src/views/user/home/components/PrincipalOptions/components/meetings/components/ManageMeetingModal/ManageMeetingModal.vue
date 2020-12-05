<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon
              color="dark"
              slot="icon-only"
              name="arrow-back"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">{{ modalTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item button @click="openClientsModal">
          <ion-label>Cliente</ion-label>
          {{
            user && user.name
              ? `${user.name} ${user.lastname1} ${user.lastname2}`
              : ""
          }}
        </ion-item>

        <ion-item>
          <ion-label>Fecha (DD MM AAAA)</ion-label>
          <ion-datetime
            :value="date"
            :min="currentDate"
            @ionChange="setDate"
            cancel-text="Cancelar"
            done-text="Aceptar"
            display-format="DD MM YYYY"
            picker-format="DD MM YYYY"
          />
        </ion-item>

        <ion-item v-show="showHour">
          <ion-label>Seleccionar hora</ion-label>

          <ion-select @ionChange="setHours" :value="hour">
            <ion-select-option
              v-for="(hour, key) in minHour"
              :key="key"
              :value="hour"
              >{{ hour }}</ion-select-option
            >
          </ion-select>

          <ion-select @ionChange="setMinutes" :value="minutes">
            <ion-select-option
              v-for="(minute, mKey) in minMinutes"
              :key="mKey"
              :value="minute"
              >{{ minute }}</ion-select-option
            >
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Comentarios</ion-label>
          <ion-textarea
            :value="description"
            @ionInput="description = $event.target.value"
          ></ion-textarea>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-button
      @click="sendClientData"
      :disabled="sendingMeeting"
      color="danger"
      expand="block"
      >{{ modalButton }}</ion-button
    >
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
import firebaseApp from "firebase/app";
import "firebase/firestore";

import store from "@/store";
import { mapState } from "vuex";

import ClientsModal from "./components/ClientsModal";

import timestamp from "time-stamp";
import DateMixing from "@/mixings/DateMixing";

export default {
  store,
  props: {
    type: String,
    meeting: Object,
    customUser: Object,
  },

  mixins: [DateMixing],

  data() {
    return {
      clients: [],
      observe: false,

      currentDate: timestamp(),

      showHour: false,

      minHour: null,
      minMinutes: null,

      user: {},
      date: null,
      hour: null,
      minutes: null,
      description: "",
      isOpen: false,

      loadedMeetings: false,
      listeningMeetings: {},

      openingUserSelectModal: false,

      sendingMeeting: false,
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
      my_branch_office: (state) => state.my_branch_office,
    }),
    modalTitle() {
      return this.type == "create" ? "Nueva Cita" : "Editar Cita";
    },
    modalButton() {
      return this.type == "create" ? "Añadir Cita" : "Guardar Cambios";
    },
  },

  methods: {
    openClientsModal() {
      if (!this.isOpen) {
        this.isOpen = true;
        var vm = this;

        if (!this.openingUserSelectModal) {
          this.openingUserSelectModal = true;
          return this.$ionic.modalController
            .create({
              backdropDismiss: false,
              component: ClientsModal,
              componentProps: {
                propsData: {
                  clients: this.clients,
                },
              },
            })
            .then((m) => {
              m.onDidDismiss().then((response) => {
                vm.isOpen = false;
                vm.openingUserSelectModal = false;
                vm.user = response.data;
              });
              m.present();
            });
        }
      }
    },
    getClients() {
      var clients = [];
      var listeningMeetings = firebaseApp
        .firestore()
        .collection("users")
        .where("type", "==", "client")
        .orderBy("dateUpdate")
        .onSnapshot((querySnapshot) => {
          const customSorter = (a, b) =>
            new Date(a.dateUpdate).getTime() - new Date(b.dateUpdate).getTime();

          clients = [];

          querySnapshot.forEach((doc) => {
            clients.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          clients.sort(customSorter).reverse(); // TODO: SORTER

          this.clients = clients;
          console.log(clients);

          this.loadedMeetings = true;
        });
      this.listeningMeetings = listeningMeetings;
    },

    sendClientData() {
      const timestamp = firebase.client
        .getFirestore()
        .FieldValue.serverTimestamp();

      if (this.sendingMeeting) return;
      this.sendingMeeting = true;
      var vm = this;
      if (
        (this.type == "create" && !this.user.id) ||
        !this.date ||
        !this.description
      ) {
        this.sendingMeeting = false;
        return this.$ionic.alertController
          .create({
            header: "Completa los campos",
            message: "Todos los campos de este formulario son obligatorios",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else {
        if (this.type == "create") {
          console.log(this.user);

          firebase.client
            .create("meetings", {
              updatedBy: this.currentUser.uid,
              createdBy: this.currentUser.uid,
              dateUpdate: timestamp,
              user: this.user.id,
              members: this.user.members,
              date: this.date,
              hour: this.hour,
              minutes: this.minutes,
              description: this.description,
              dateStatic: this.createStaticDate(),
              branchoffice: this.my_branch_office,
            })
            .then(() => {
              this.sendingMeeting = false;
              this.dismiss(true);
            });
        } else if (this.type == "edit") {
          firebase.client
            .create("history", {
              data: vm.meeting,
              id: vm.meeting.id,
              collection: "meetings",
              timestamp: firebase.client.genTimestamp(),
            })
            .then(() => {
              const meet = {
                id: this.meeting.id,
                user: this.user.id, // TODO: CHECK IN OTHERS VIEWS
                date: this.date,
                hour: this.hour,
                description: this.description,
                dateUpdate: timestamp,
                minutes: this.minutes,
                updatedBy: this.currentUser.uid,
              };

              firebase.client
                .update("meetings", this.meeting.id, meet)
                .then(() => {
                  this.sendingMeeting = false;
                  this.dismiss(meet);
                });
            });
        }
      }
    },

    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    },

    setHours({ target }) {
      this.hour = target.value;

      let actualHour = new Date();
      let hourSelected = Number.parseInt(target.value);
      let day = this.parseCurrentDate(this.date);
      /*

      console.log(`HORA SELECIONADA: ${hourSelected}`);
      console.log(`HORA ACTUAL: ${actualHour.getHours()}`);

      console.log(`HOY ES EL DIA: ${this.date}`);
*/

      if (hourSelected > actualHour.getHours()) {
        this.minutes = "00";
        this.minMinutes = this.createArrayMinutes(0);
      } else {
        if (day.getDate() > actualHour.getDate()) {
          this.minutes = "00";
          this.minMinutes = this.createArrayMinutes(0);
        } else {
          this.minutes = `${this.getCurrentMinutes()}`;
          this.minMinutes = this.createArrayMinutes(this.getCurrentMinutes());
        }
      }
    },

    setMinutes({ target }) {
      this.minutes = target.value;
    },

    setEditData() {
      if (this.type == "edit") {
        this.user = this.meeting.user;
        this.date = this.meeting.date;
        this.hour = this.meeting.hour;
        this.minutes = this.meeting.minutes;
        this.description = this.meeting.description;
        this.setDateRangeTime(this.meeting.hour, this.meeting.minutes);

        console.log(this.meeting);
      }
    },

    getCurrentHour() {
      let date = new Date();
      return date.getHours();
    },

    getCurrentMinutes() {
      let date = new Date();
      return date.getMinutes();
    },

    setDateRangeTime(hours, minutes) {
      this.minHour = this.createArrayHours(Number.parseInt(hours));
      this.minMinutes = this.createArrayMinutes(Number.parseInt(minutes));
    },

    setRangeTime(val) {
      let actualDate = new Date();
      let dateSelected = this.parseCurrentDate(val);

      /*console.log("UTC DATE")
      console.log(`ACTUAL: ${actualDate.getDate()} DE ${actualDate.getUTCMonth()} DEL 2020`);
      console.log(`SELECIONADO: ${dateSelected.getDate()} DE ${dateSelected.getUTCMonth()}  DEL 2020`);*/

      if (
        (dateSelected.getDate() >= actualDate.getDate() &&
          dateSelected.getMonth() > actualDate.getMonth()) ||
        (dateSelected.getDate() > actualDate.getDate() &&
          dateSelected.getMonth() >= actualDate.getMonth()) ||
        dateSelected.getMonth() > actualDate.getMonth()
      ) {
        this.hour = "00";
        this.minutes = "00";
        this.minHour = this.createArrayHours(0);
        this.minMinutes = this.createArrayMinutes(0);
      } else {
        this.hour = `${this.getCurrentHour()}`;
        this.minutes = `${this.getCurrentMinutes()}`;
        this.minHour = this.createArrayHours(this.getCurrentHour());
        this.minMinutes = this.createArrayMinutes(this.getCurrentMinutes());
      }
    },

    parseCurrentDate(dateString) {
      return new Date(dateString);
    },

    setDate(e) {
      this.date = e.detail.value;
      this.showHour = true;
      this.setRangeTime(this.date);
    },

    createArrayHours(min) {
      const hours = [];

      for (let i = min; i <= 23; i++) {
        if (i < 10) {
          hours.push(`0${i}`);
        } else {
          hours.push(`${i}`);
        }
      }

      return hours;
    },

    createArrayMinutes(min) {
      const minutes = [];

      for (let i = min; i < 60; i++) {
        if (i < 10) {
          minutes.push(`0${i}`);
        } else {
          minutes.push(`${i}`);
        }
      }

      return minutes;
    },
  },
  mounted() {
    this.setEditData();
    this.getClients();
    this.user = this.customUser;

    if (this.type === "edit") {
      this.showHour = true;
    }
  },

  /*watch: {
    date: function(val) {

    }
  }*/
};
</script>
