<template>
  <ion-item-sliding>
    <ion-item @click="openView()" button>
      <ion-label text-wrap>
        <h2>{{clientData.name}} {{clientData.lastname1}} {{clientData.lastname2}}</h2>
        <p>
          <ion-icon color="danger" name="call" />
          {{clientData.phone}}
        </p>
        <p>
          <ion-icon color="danger" name="paper" />
          {{date}}
        </p>

        <p v-if="meeting.canceled">
          <ion-badge color="danger">Cancelada</ion-badge>
        </p>

        <p v-if="meeting.attended">
          <ion-badge color="primary">Asistió</ion-badge>
        </p>
      </ion-label>
      <ion-button :href="`tel:${clientData.phone}`" v-if="clientData.phone" fill="clear">
        <ion-icon name="call" color="danger"></ion-icon>
      </ion-button>
    </ion-item>
    <ion-item-options side="start" v-if="isAdmin">
      <ion-item-option @click="verifyTrash()" color="danger">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-item-option>
    </ion-item-options>
    <ion-item-options side="end">
      <ion-item-option @click="edit()">
        <ion-icon slot="icon-only" name="create"></ion-icon>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>
<script>
import firebase from "@/firebase";
import ManageMeetingModal from "../ManageMeetingModal/ManageMeetingModal";
import MeetingModal from "../MeetingModal/MeetingModal";
import store from "@/store";

import moment from "moment";
import { mapState } from "vuex";

export default {
  store,
  props: {
    meeting: Object,
  },

  data() {
    return {
      clientData: {},
      isAdmin: false,
      openingMeetingModal: false,
    };
  },
  computed: {
    date() {
      return (
        moment(this.meeting.date).format("DD/MM/YYYY") +
        " " +
        this.meeting.hour +
        ":" +
        this.meeting.minutes
      );
    },

    ...mapState({
      currentUser: (state) => state.user,
    }),
  },
  methods: {
    verifyTrash() {
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
                this.trash();
              },
            },
          ],
        })
        .then((a) => a.present());
    },
    trash() {
      firebase.client.delete("meetings", this.meeting.id);
    },
    edit() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ManageMeetingModal,
          componentProps: {
            propsData: {
              type: "edit",
              meeting: this.meeting,
            },
          },
        })
        .then((m) => m.present());
    },
    openView() {
      var vm = this;
      if (!this.openingMeetingModal) {
        this.openingMeetingModal = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: MeetingModal,
            componentProps: {
              propsData: {
                meeting: this.meeting,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then(() => {
              vm.openingMeetingModal = false;
            });
            m.present();
          });
      }
    },
    getMeetingClient() {
      firebase.client
        .getOnce("users", this.meeting.user)
        .then((response) => {
          this.clientData = response;
        })
        .catch((error) => {
          var errorCode;
          var errorMessage;

          var errorObjectMessage = {
            header: "Ha ocurrido un error",
            message: "No pudimos obtener al usuario de la cita",
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
    },

    checkAccount() {
      this.isAdmin =
        this.currentUser.type === "admin" ||
        this.currentUser.type === "manager";
    },
  },
  watch: {
    meeting(newValue, oldValue) {
      if (newValue != oldValue) {
        this.getMeetingClient();
      }
    },
  },
  created() {
    this.getMeetingClient();
    this.checkAccount();
  },
};
</script>