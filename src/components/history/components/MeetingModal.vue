<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">{{data.name}} {{data.lastname1}} {{data.lastname2}}</ion-title>

      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label text-wrap>
          {{data.description}}
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
          Número Telefónico
          <ion-label slot="end" text-wrap>{{userData.phone}}</ion-label>
        </ion-item>
        <ion-item lines="full">
          Dirección
          <ion-label slot="end" text-wrap>{{userData.address}}</ion-label>
        </ion-item>

        <ion-item lines="full">
          <ion-label>Asistió</ion-label>
          <ion-toggle :disabled="copyMeeting.canceled||disabled||copyMeeting.attended" :checked="attended" @ionChange="setAttended" />
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>
<script>
    import firebase from "@/firebase";

    import store from "@/store";

    import { mapState } from "vuex";

    export default {
        store,

        props: {
            data: Object
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
                canceledText: 'Cancelar Cita',
                canceled: false
            };
        },
        computed: {
            ...mapState({
                currentUser: state => state.user
            }),

            date() {
                var date = new Date(this.data.date);

                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();

                console.log(year);

                return `${day}/${month}/${year}`;
            },
            hour() {
                return `${this.data.hour}:${this.data.minutes}`;
            }
        },
        methods: {
            dismiss() {
                this.$ionic.modalController.dismiss();
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
                                cssClass: "secondary"
                            },
                            {
                                text: "Eliminar",
                                handler: () => {
                                    console.log(vm.trash());

                                    vm.trash().then(() => {
                                        vm.dismiss();
                                    });
                                }
                            }
                        ]
                    })
                    .then(a => a.present());
            },
            trash() {
                return firebase.client.delete("meetings", this.data.id);
            },
            getClient() {
                firebase.client.getOnce("users", this.data.user).then(response => {
                    this.userData = response;
                });
            },

            setAttended() {

                const timestamp = firebase.client.getFirestore().FieldValue.serverTimestamp();

                this.attended = !this.attended;

                if (this.attended) this.disabled = true;

                firebase.client
                    .update("meetings", this.data.id, {
                        user: this.data.user,
                        updatedBy: this.data.updatedBy,
                        hour: this.data.hour,
                        description: this.data.description,
                        dateUpdate: timestamp,
                        date: this.data.date,
                        createdBy: this.data.createdBy,
                        attended: this.attended
                    })
                    .catch(e => console.log(e));
            },

            cancelMeeting() {
                this.data.canceled = true;

                firebase.client
                    .update("meetings", this.data.id, {
                        user: this.data.user,
                        updatedBy: this.data.updatedBy,
                        hour: this.data.hour,
                        description: this.data.description,
                        dateUpdate: this.data.dateUpdate,
                        date: this.data.date,
                        createdBy: this.data.createdBy,
                        attended: false,
                        canceled: this.copyMeeting.canceled,
                    })
                    .then(() => this.canceled = true)
                    .catch(e => console.log(e));
            },

            checkAccount() {
                this.isAdmin = this.currentUser.type === "admin" || this.currentUser.type === "manager";
            },

            getAttended() {
                if (this.data.attended) this.attended = this.data.attended;
                else this.attended = false;
            },

            setCanceledText() {
                if (this.data.canceled) this.canceledText = "Cita Cancelada"
            },

            getUser() {
                firebase.client
                    .getOnce("users", this.data.user)
                    .then(user => {
                        this.user = user;
                        this.user.id = this.data.user;
                    })
                    .catch(() => console.log("error meeting modal"));
            }
        },

        created() {
            this.getClient();
            this.checkAccount();
            this.getAttended();
            this.getUser();
            this.setCanceledText();
            this.copyMeeting = this.data;
            this.canceled = this.copyMeeting.canceled || false;
        }
    };
</script>
