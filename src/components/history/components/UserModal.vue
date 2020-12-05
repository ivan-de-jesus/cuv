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
      <ion-list>
        <ion-list-header>
          <ion-label>{{ title }}</ion-label>
        </ion-list-header>
        <ion-item v-if="data.name">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Nombre</span>
            <h1>{{data.name}}</h1>
          </ion-label>
        </ion-item>
        <ion-item v-if="data.lastname1">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Apellido Paterno</span>
            <h1>{{data.lastname1}}</h1>
          </ion-label>
        </ion-item>
        <ion-item v-if="data.lastname2">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Apellido Materno</span>
            <h1>{{data.lastname2}}</h1>
          </ion-label>
        </ion-item>
        <a :href="`tel:${data.phone}`">
          <ion-item button v-if="data.phone">
            <ion-icon slot="start" color="danger" name="call"></ion-icon>
            <ion-label>
              <span class="label-title">Número Telefónico</span>
              <h1>{{data.phone}}</h1>
            </ion-label>
          </ion-item>
        </a>
        <a :href="`mailto:${data.email}`">
          <ion-item button v-if="data.email">
            <ion-icon slot="start" color="danger" name="mail"></ion-icon>
            <ion-label>
              <span class="label-title">Correo Electrónico</span>
              <h1>{{data.email}}</h1>
            </ion-label>
          </ion-item>
        </a>
        <ion-item v-if="data.address">
          <ion-icon slot="start" color="danger" name="locate"></ion-icon>
          <ion-label>
            <span class="label-title">Dirección</span>
            <h1>{{data.address}}</h1>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">RFC</span>
            <h1>{{ data.rfc }}</h1>
          </ion-label>
        </ion-item>

        <ion-item v-if="data.commercial_advisor">
          <ion-icon slot="start" color="danger" name="person"></ion-icon>
          <ion-label>
            <span class="label-title">Sucursal</span>
            <h1>{{ location.name }}</h1>
          </ion-label>
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

        data: () => ({
            isAdmin: false,
            isOpen: false,
            location: ""
        }),

        computed: {
            ...mapState({
                currentUser: state => state.user
            }),

            title() {
                if (this.data.commercial_advisor) {
                    return "DATOS DEL ASESOR COMERCIAL";
                } else {
                    return "DATOS DEL CLIENTE";
                }
            }
        },

        props: {
            data: Object,
            clients: Array
        },
        methods: {


            dismiss() {
                this.$ionic.modalController.dismiss();
            },
            verifyTrash() {
                var vm = this;
                return this.$ionic.alertController
                    .create({
                        header: "¿Realmente deseas eliminar este cliente?",
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
                                    vm.trash().then(() => {
                                        vm.dismiss();
                                    });
                                }
                            }
                        ]
                    })
                    .then(a => a.present());
            },

            getLocation() {
                firebase.client
                    .getOnce("locations", this.data.location)
                    .then(result => {
                        this.location = result;
                    });
            },

            trash() {
                return firebase.client.delete("users", this.data.id);
            },


            checkAccount() {
                this.isAdmin =
                    this.currentUser.type === "admin" ||
                    this.currentUser.type === "manager";
            }
        },

        mounted() {
            this.checkAccount();

            if (this.data.commercial_advisor && this.data.location) {
                this.getLocation();
            }
        }
    };
</script>
