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
        <ion-item>
          <ion-label position="floating">Nombre</ion-label>
          <ion-input
            autocapitalize="on"
            :value="name"
            @ionInput="name = $event.target.value"
            type="text"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Apellido Paterno</ion-label>
          <ion-input
            autocapitalize="on"
            :value="lastname1"
            @ionInput="lastname1 = $event.target.value"
            type="text"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Apellido Materno</ion-label>
          <ion-input
            autocapitalize="on"
            :value="lastname2"
            @ionInput="lastname2 = $event.target.value"
            type="text"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Número Telefónico</ion-label>
          <ion-input
            autocapitalize="on"
            :value="phone"
            @ionInput="phone = $event.target.value"
            type="tel"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Correo Electrónico</ion-label>
          <ion-input
            autocapitalize="on"
            :value="email"
            @ionInput="email = $event.target.value"
            type="email"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Dirección</ion-label>
          <ion-input
            autocapitalize="on"
            :value="address"
            @ionInput="address = $event.target.value"
            type="text"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">RFC</ion-label>
          <ion-input
            autocapitalize="on"
            :value="rfc"
            @ionInput="rfc = $event.target.value"
          ></ion-input>
        </ion-item>

        <ion-item v-if="isAdmin" lines="full" button>
          <ion-label>Asesor comercial</ion-label>
          <ion-checkbox
            :checked="commercial_advisor"
            @ionChange="commercial_advisor = !commercial_advisor"
          />
        </ion-item>

        <ion-item
          lines="full"
          button
          v-if="isAdmin && this.commercial_advisor"
          @click="openLocations"
        >
          <ion-label>Sucursal</ion-label>
          {{ location.name }}
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-button
      @click="sendClientData"
      :disabled="sendingUser"
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
import validateData from "@/assets/js/validateData.js";
import { mapState } from "vuex";
import store from "@/store";
import LocationSearch from "./LocationSearch";
import DateMixing from "@/mixings/DateMixing";
export default {
  store,

  mixins: [DateMixing],

  props: {
    type: String,
    client: Object,
    clients: Array,
    mLocation: Object,
  },
  data() {
    return {
      name: "",
      lastname1: "",
      lastname2: "",
      phone: "",
      email: "",
      address: "",
      rfc: "",
      commercial_advisor: false,
      location: {},
      sendingUser: false,
      locations: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
      my_branch_office: (state) => state.my_branch_office,
    }),

    modalTitle() {
      return this.type == "create" ? "Nuevo Cliente" : "Editar Cliente";
    },
    modalButton() {
      return this.type == "create" ? "Añadir Cliente" : "Guardar Cambios";
    },
    isAdmin() {
      return this.user.type === "admin" ? true : false;
    },
  },
  methods: {
    sendClientData() {
      if (this.sendingUser) return;
      this.sendingUser = true;
      var vm = this;

      var clients = this.clients;

      const deleteThisClienteBeforeValidate = () => {
        var clientIndex = -1;
        clients.some((client, index) => {
          if (client.id == vm.client.id) {
            clientIndex = index;
            return true;
          }
        });
        return clientIndex;
      };

      // current client is not part of validation, then we delete that
      if (this.type == "edit") {
        clients.splice(deleteThisClienteBeforeValidate(), 1);
      }

      let findRfc = clients.find((client) => {
        if (vm.rfc == "") return false;
        if (vm.rfc.toLowerCase() == client.rfc.toLowerCase()) {
          if (vm.type == "edit") {
            return vm.client.id != client.id;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });

      let findPhone = clients.find((client) => {
        if (vm.phone == client.phone) {
          if (vm.type == "edit") {
            return vm.client.id != client.id;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });

      var findEmail = clients.find((client) => {
        if (vm.email.toLowerCase() == client.email.toLowerCase()) {
          if (vm.type == "edit") {
            return vm.client.id != client.id;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });

      if (findRfc) {
        this.sendingUser = false;
        return this.$ionic.alertController
          .create({
            header: "RFC Ocupado",
            message: "Este RFC ya está siendo usado por otro cliente",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else if (findPhone) {
        this.sendingUser = false;

        return this.$ionic.alertController
          .create({
            header: "Teléfono Ocupado",
            message: "Este telefono ya está siendo usado por otro cliente",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else if (findEmail) {
        this.sendingUser = false;

        return this.$ionic.alertController
          .create({
            header: "Correo Electrónico Ocupado",
            message:
              "Este correo electrónico ya está siendo usado por otro cliente",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else if (
        !this.name ||
        !this.lastname1 ||
        !this.lastname2 ||
        !this.phone ||
        !this.email
      ) {
        this.sendingUser = false;

        return this.$ionic.alertController
          .create({
            header: "Completa los campos",
            message: "Todos los campos de este formulario son obligatorios",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else if (!validateData.email(this.email)) {
        this.sendingUser = false;

        return this.$ionic.alertController
          .create({
            header: "Correo electrónico invalido",
            message: "Escribe un correo electrónico valido",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else if (!validateData.number(this.phone)) {
        this.sendingUser = false;

        return this.$ionic.alertController
          .create({
            header: "Número telefónico invalido",
            message: "Escribe un número telefónico valido",
            buttons: ["Aceptar"],
          })
          .then((a) => a.present());
      } else {
        if (this.type === "create") {
          const timestamp = firebaseApp.firestore.FieldValue.serverTimestamp();

          const data = {
            name: this.name,
            lastname1: this.lastname1,
            lastname2: this.lastname2,
            phone: this.phone,
            email: this.email,
            address: this.address,
            type: "client",
            dateUpdate: firebase.client.genTimestamp(),
            createdBy: this.user.uid,
            updatedBy: this.user.uid,
            createdAt: timestamp,
            rfc: this.rfc,
            commercial_advisor: this.commercial_advisor,
            members: [this.user.uid],
            dateStatic: this.createStaticDate(),
            branchoffice: this.my_branch_office,
          };

          if (data.commercial_advisor) {
            data.location = this.location.id;
          }

          firebase.client.create("users", data).then(() => {
            this.sendingUser = false;
            this.dismiss(true);
          });
        } else if (this.type === "edit") {
          firebase.client
            .create("history", {
              data: vm.client,
              id: this.client.id,
              collection: "users",
              timestamp: firebase.client.genTimestamp(),
            })
            .then(() => {
              const data = {
                name: this.name,
                lastname1: this.lastname1,
                lastname2: this.lastname2,
                phone: this.phone,
                email: this.email,
                address: this.address,
                dateUpdate: firebase.client.genTimestamp(),
                updatedBy: this.user.uid,
                rfc: this.rfc,
                commercial_advisor: this.commercial_advisor,
              };

              if (data.commercial_advisor) {
                data.location = this.location.id;
                console.log(data, this.location);
              }

              firebase.client.update("users", vm.client.id, data).then(() => {
                firebase.client
                  .getOnce("users", vm.client.id)
                  .then((userResponse) => {
                    vm.sendingUser = false;
                    vm.dismiss({
                      value: false,
                      user: {
                        id: this.client.id,
                        ...userResponse,
                      },
                    });
                  });
              });
            });
        }
      }
    },

    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    },

    setEditData() {
      if (this.type == "edit") {
        this.name = this.client.name;
        this.lastname1 = this.client.lastname1;
        this.lastname2 = this.client.lastname2;
        this.phone = this.client.phone;
        this.email = this.client.email;
        this.address = this.client.address;
        this.rfc = this.client.rfc;
        this.commercial_advisor = this.client.commercial_advisor;
      }
    },

    openLocations() {
      console.log(this.locations);
      if (!this.isOpen) {
        this.isOpen = true;
        return this.$ionic.modalController
          .create({
            backdropDismiss: false,
            component: LocationSearch,
            componentProps: {
              propsData: {
                locations: this.locations,
              },
            },
          })
          .then((m) => {
            m.onDidDismiss().then((response) => {
              this.location = response.data;
              this.isOpen = false;
            });
            m.present();
          });
      }
    },

    async getLocations() {
      const response = await firebase.client
        .raw()
        .collection("locations")
        .get();

      response.docs.forEach((location) => {
        this.locations.push({
          id: location.id,
          ...location.data(),
        });
      });
    },
  },
  async mounted() {
    this.setEditData();
    await this.getLocations();

    if (this.type === "edit") {
      this.location = this.mLocation;
    }
  },
};
</script>
