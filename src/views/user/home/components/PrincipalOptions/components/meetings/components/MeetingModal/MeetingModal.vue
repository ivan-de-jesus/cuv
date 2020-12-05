<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Cita con {{userData.name}}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="toMembers" v-if="isAdmin">
            <ion-icon slot="icon-only" name="people"></ion-icon>
          </ion-button>
          <ion-button @click="toHistory">
            <ion-icon slot="icon-only" name="filing"></ion-icon>
          </ion-button>
          <ion-button @click="edit">
            <ion-icon slot="icon-only" name="create"></ion-icon>
          </ion-button>
          <ion-button @click="verifyTrash" v-if="isAdmin">
            <ion-icon slot="icon-only" name="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label text-wrap>
          {{meeting.description}}
          <br />
          <br />
          <div style="font-size:12px">
            {{date}}
            {{hour}}
          </div>
          <br />
        </ion-label>
      </ion-item>
      <ion-list>
        <ion-list-header>
          <ion-label>DATOS DEL CLIENTE</ion-label>
        </ion-list-header>
        <ion-item lines="full">
          Nombre
          <ion-label
            slot="end"
            text-wrap
          >{{userData.name}} {{userData.lastname1}} {{userData.lastname2}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Correo Electrónico
          <ion-label slot="end" text-wrap>{{userData.email}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Númerico Telefónico
          <ion-label slot="end" text-wrap>{{userData.phone}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Dirección
          <ion-label slot="end" text-wrap>{{userData.address}}</ion-label>
        </ion-item>

        <ion-item lines="full">
          <ion-label>Asistió</ion-label>
          <ion-toggle
            :disabled="copyMeeting.canceled||disabled||copyMeeting.attended"
            :checked="attended"
            @ionChange="setAttended"
          />
        </ion-item>
      </ion-list>

      <ion-button
        v-if="isAdmin"
        :disabled="canceled||disabled||copyMeeting.attended"
        @click="cancelMeeting"
        color="danger"
        expand="block"
      >{{ canceledText }}</ion-button>
    </ion-content>
  </ion-page>
</template>
<script>
import firebase from "@/firebase";
import ManageMeetingModal from "../ManageMeetingModal/ManageMeetingModal";
import HistoryList from "@/components/history/HistoryList.vue";
import store from "@/store";
import Members from "@/components/members/Members.vue";

import { mapState } from "vuex";

export default {
  store,

  props: {
    meeting: Object,
  },
  data() {
    return {
      userData: {},
      attended: false,
      isAdmin: false,
      isOpen: false,
      user: {},
      disabled: false,
      copyMeeting: null,
      canceledText: "Cancelar Cita",
      canceled: false,
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),

    date() {
      var date = new Date(this.meeting.date);

      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      console.log(year);

      return `${day}/${month}/${year}`;
    },
    hour() {
      return `${this.meeting.hour}:${this.meeting.minutes}`;
    },
  },
  methods: {
    dismiss() {
      this.$ionic.modalController.dismiss();
    },
    toMembers() {
      var vm = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: Members,
          componentProps: {
            propsData: {
              id: vm.meeting.id,
              collection: "meetings",
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then(() => {
            this.getClient();
            this.checkAccount();
            this.getAttended();
            this.getUser();
          });
          m.present();
        });
    },
    toHistory() {
      var vm = this;
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: HistoryList,
          componentProps: {
            propsData: {
              id: vm.meeting.id,
              collection: "meetings",
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then(() => {
            this.getClient();
            this.checkAccount();
            this.getAttended();
            this.getUser();
          });
          m.present();
        });
    },
    verifyTrash() {
      var vm = this;
      return this.$ionic.alertController
        .create({
          header: "¿Realmente deseas eliminar esta cita?",
          message: "Esta acción no se puede revertir",
          buttons: [
            {
              text: "Cancelar",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Eliminar",
              handler: () => {
                console.log(vm.trash());

                vm.trash().then(() => {
                  vm.dismiss();
                });
              },
            },
          ],
        })
        .then((a) => a.present());
    },
    trash() {
      return firebase.client.delete("meetings", this.meeting.id);
    },
    getClient() {
      firebase.client.getOnce("users", this.meeting.user).then((response) => {
        this.userData = response;
      });
    },
    edit() {
      if (!this.isOpen) {
        this.isOpen = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: ManageMeetingModal,
            componentProps: {
              propsData: {
                type: "edit",
                customUser: this.user,
                meeting: this.meeting,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then((response) => {
              this.isOpen = false;
              if (response.data) {
                //this.dismiss();
                this.meeting = response.data;
              }
            });
            m.present();
          });
      }
    },

    setAttended() {
      const timestamp = firebase.client
        .getFirestore()
        .FieldValue.serverTimestamp();

      this.attended = !this.attended;

      if (this.attended) this.disabled = true;

      firebase.client
        .update("meetings", this.meeting.id, {
          user: this.meeting.user,
          updatedBy: this.meeting.updatedBy,
          hour: this.meeting.hour,
          description: this.meeting.description,
          dateUpdate: timestamp,
          date: this.meeting.date,
          createdBy: this.meeting.createdBy,
          attended: this.attended,
        })
        .catch((e) => console.log(e));
    },

    cancelMeeting() {
      this.meeting.canceled = true;

      firebase.client
        .update("meetings", this.meeting.id, {
          user: this.meeting.user,
          updatedBy: this.meeting.updatedBy,
          hour: this.meeting.hour,
          description: this.meeting.description,
          dateUpdate: this.meeting.dateUpdate,
          date: this.meeting.date,
          createdBy: this.meeting.createdBy,
          attended: false,
          canceled: this.copyMeeting.canceled,
        })
        .then(() => (this.canceled = true))
        .catch((e) => console.log(e));
    },

    checkAccount() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
    },

    getAttended() {
      if (this.meeting.attended) this.attended = this.meeting.attended;
      else this.attended = false;
    },

    setCanceledText() {
      if (this.meeting.canceled) this.canceledText = "Cita Cancelada";
    },

    getUser() {
      firebase.client
        .getOnce("users", this.meeting.user)
        .then((user) => {
          this.user = user;
          this.user.id = this.meeting.user;
        })
        .catch(() => console.log("error meeting modal"));
    },
  },

  created() {
    this.getClient();
    this.checkAccount();
    this.getAttended();
    this.getUser();
    this.setCanceledText();
    this.copyMeeting = this.meeting;
    this.canceled = this.copyMeeting.canceled || false;
  },
};
</script>
