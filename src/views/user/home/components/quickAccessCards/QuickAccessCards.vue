<template>
  <div class="scrollmenu" style="text-align: center">
    <ion-card style="text-align: left" class="card" v-if="cards.meeting">
      <ion-card-content @click="openMeeting">
        <ion-icon
          style="display: inline-block; vertical-align: middle"
          class="icon-card"
          name="paper"
          color="light"
        ></ion-icon>
        <div class="title truncate">
          {{ dateToFormat(cards.meeting.date) }}
          <p>Última Cita Creada</p>
        </div>
        <br />
        <br />
        <div>
          <ion-icon
            style="
              display: inline-block;
              vertical-align: middle;
              font-size: 20px;
            "
            name="person"
            color="light"
          ></ion-icon>
          <div class="title truncate">
            <p style="font-size: 17px" class="truncate">
              {{ clientDataForMeeting.name }}
              {{ clientDataForMeeting.lastname1 }}
              {{ clientDataForMeeting.lastname2 }}
            </p>
          </div>
        </div>
        <div>
          <ion-icon
            style="
              display: inline-block;
              vertical-align: middle;
              font-size: 20px;
            "
            name="call"
            color="light"
          ></ion-icon>
          <div class="title truncate">
            <p style="font-size: 17px" class="truncate">
              {{ clientDataForMeeting.phone }}
            </p>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
    <ion-card style="text-align: left" class="card" v-if="cards.user">
      <ion-card-content @click="openUser">
        <ion-icon
          style="display: inline-block; vertical-align: middle"
          class="icon-card"
          name="person"
          color="light"
        ></ion-icon>
        <div class="title truncate">
          {{ cards.user.name }} {{ cards.user.lastname1 }}
          {{ cards.user.lastname2 }}
          <p>Último Cliente</p>
        </div>
        <br />
        <br />
        <div>
          <ion-icon
            style="
              display: inline-block;
              vertical-align: middle;
              font-size: 20px;
            "
            name="call"
            color="light"
          ></ion-icon>
          <div class="title truncate">
            <p style="font-size: 17px" class="truncate">
              {{ cards.user.phone }}
            </p>
          </div>
        </div>
        <div>
          <ion-icon
            style="
              display: inline-block;
              vertical-align: middle;
              font-size: 20px;
            "
            name="mail"
            color="light"
          ></ion-icon>
          <div class="title truncate">
            <p style="font-size: 17px" class="truncate">
              {{ cards.user.email }}
            </p>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
    <ion-card style="text-align: left" class="card" v-if="cards.vehicle">
      <ion-card-content @click="openVehicle">
        <ion-icon
          style="display: inline-block; vertical-align: middle"
          class="icon-card"
          name="car"
          color="light"
        />
        <div class="title truncate">
          {{ cards.vehicle.brand }}
          <p>Último Vehiculo</p>
        </div>
        <br />
        <br />
        <div>
          <ion-icon
            style="
              display: inline-block;
              vertical-align: middle;
              font-size: 20px;
            "
            name="person"
            color="light"
          />
          <div class="title truncate">
            <p style="font-size: 17px" class="truncate">
              {{ vehicleUserOwner.name }}
            </p>
          </div>
        </div>
        <div>
          <ion-icon
            style="
              display: inline-block;
              vertical-align: middle;
              font-size: 20px;
            "
            name="car"
            color="light"
          ></ion-icon>
          <div class="title truncate">
            <p style="font-size: 17px" class="truncate">
              {{ cards.vehicle.plate }}
            </p>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>
<script>
import moment from "moment";
import firebase from "@/firebase";
import UserModal from "@/views/user/home/components/PrincipalOptions/components/users/components/UserModal/UserModal.vue";
import { mapState } from "vuex";
import VehicleModal from "../PrincipalOptions/components/vehicles/components/VehicleModal/VehicleModal";
import MeetingModal from "../PrincipalOptions/components/meetings/components/MeetingModal/MeetingModal";

export default {
  data() {
    return {
      cards: {},
      clientDataForMeeting: {},
      vehicleUserOwner: {},
      showing: false,
    };
  },
  methods: {
    dateToFormat(value) {
      return moment(value).format("DD MMM, YYYY");
    },

    getQuickAccessCards() {
      firebase.client
        .getQuickAccessCardsById(this.currentUser.uid)
        .then((response) => {
          this.cards = response;
          this.getMeetingClientForMeeting();
          this.getVehicleOwner();
        });
    },

    getVehicleOwner() {
      if (this.cards.vehicle) {
        firebase.client
          .getOnce("users", this.cards.vehicle.user)
          .then((resp) => (this.vehicleUserOwner = resp))
          .catch((error) => console.log(error));
      }
    },

    openMeeting() {
      var vm = this;
      if (!this.showing) {
        this.showing = true;
        let meetingData = { ...this.cards.meeting };
        meetingData.user = this.cards.meeting.user;

        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: MeetingModal,
            componentProps: {
              propsData: {
                meeting: meetingData,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then(() => {
              vm.showing = false;
            });
            m.present();
          });
      }
    },

    openVehicle() {
      var vm = this;
      if (!this.showing) {
        this.showing = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: VehicleModal,
            componentProps: {
              propsData: {
                vehicle_: this.cards.vehicle,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then(() => {
              vm.showing = false;
            });
            m.present();
          });
      }
    },

    openUser() {
      var vm = this;
      if (!this.showing) {
        this.showing = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: UserModal,
            componentProps: {
              propsData: {
                client: this.cards.user,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then(() => {
              vm.showing = false;
            });
            m.present();
          });
      }
    },
    getMeetingClientForMeeting() {
      if (this.cards.meeting) {
        firebase.client
          .getOnce("users", this.cards.meeting.user)
          .then((response) => {
            this.clientDataForMeeting = response;
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
      }
    },
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),
  },

  mounted() {
    this.getQuickAccessCards();
  },
};
</script>
<style>
.scrollmenu {
  overflow: auto;
  white-space: nowrap;
}
.scrollmenu .card {
  display: inline-block;
  color: #fff;
  background: linear-gradient(to bottom right, #ff8888, #d64040);
  width: calc(100% - 20px);
  margin: 10px;
}

@media (min-width: 450px) {
  .scrollmenu .card {
    width: 260px;
  }
}
.card .title {
  white-space: nowrap;

  vertical-align: middle;
  margin-left: 10px;
  font-weight: bold;
  font-size: 20px;
}

.card .truncate {
  width: 195px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.card .icon-card {
  font-size: 40px;
}
</style>