<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Miembros</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          :value="search"
          @ionInput="search = $event.target.value"
          placeholder="Buscar"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item
        :key="'client_' + client.id + '_' + index"
        v-for="(client, index) in clientFiltered"
        lines="full"
      >
        <ion-checkbox
          :ref="'client' + client.id"
          slot="start"
          @ionChange="addMembers(client.id)"
        ></ion-checkbox>
        <ion-avatar slot="start"><img :src="client.photoURL" alt="" /></ion-avatar>
        <ion-label>{{ client.name }} {{ client.lastname1 }}</ion-label>
        <ion-badge slot="end" v-if="client.type == 'admin'">admin</ion-badge>
      </ion-item>
    </ion-content>
    <ion-footer>
      <ion-button @click="updateMembers" expand="block" color="danger"
        >Guardar miembros</ion-button
      >
    </ion-footer>
  </ion-page>
</template>

<script>
import firebase from "@/firebase";
import firebaseApp from "firebase/app";
import "firebase/firestore";
export default {
  props: {
    collection: String,
    id: String,
  },
  data() {
    return {
      model: {},
      search: "",

      loadedMeetings: false,
      listeningMeetings: null,

      // secciones de usuarios
      adviser: [],
      admin: [],
      external: [],

      firstDataSetted: false,
    };
  },
  computed: {
    externalfilter() {
      var v = this;
      return this.external.filter((external) => {
        console.log(v.model.members, external);
        return v.model.members.includes(external.id);
      });
    },
    clientFiltered() {
      var vm = this;
      return this.users.filter((client) => {
        return (
          (client.name &&
            client.name.toLowerCase().includes(vm.search.toLowerCase())) ||
          (client.lastname1 &&
            client.lastname1.toLowerCase().includes(vm.search.toLowerCase())) ||
          (client.lastname2 &&
            client.lastname2.toLowerCase().includes(vm.search.toLowerCase()))
        );
      });
    },
    users() {
      var users = this.adviser.concat(this.admin).concat(this.externalfilter);
      users = users.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
      return users;
    },
  },
  methods: {
    addMembers(id) {
      if (this.firstDataSetted) {
        var model = this.model;

        const findId = model.members.indexOf(id);

        if (findId != -1) {
          model.members.splice(findId, 1);
        } else {
          model.members.push(id);
        }

        this.model = model;
      }
    },
    getClients(type) {
      var clients = [];
      var listeningMeetings = firebaseApp
        .firestore()
        .collection("users")
        .where("type", "==", type)
        .onSnapshot((querySnapshot) => {
          clients = [];
          querySnapshot.forEach((doc) => {
            clients.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          this[type] = clients;
          this.loadedMeetings = true;
        });
      this.listeningMeetings = listeningMeetings;
    },
    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    },
    getModel() {
      firebase.client.getOnce(this.collection, this.id).then((response) => {
        this.model = response;
      });
    },
    setFirstData() {
      var vm = this;
      setTimeout(() => {
        vm.model.members.forEach((client) => {
          vm.$refs["client" + client][0].checked = true;
        });
        setTimeout(() => {
          vm.firstDataSetted = true;
        }, 200);
      }, 500);
    },
    updateMembers() {
      firebase.client.update(this.collection, this.id, this.model);
      this.dismiss();
    },
  },

  watch: {
    adviser() {
      if (!this.firstDataSetted && this.adviser.length && this.admin.length) {
        this.setFirstData();
      }
    },
    admin() {
      if (!this.firstDataSetted && this.adviser.length && this.admin.length) {
        this.setFirstData();
      }
    },
  },
  mounted() {
    this.getModel();
    this.getClients("adviser");
    this.getClients("external");
    this.getClients("admin");
  },
};
</script>

<style>
</style>
