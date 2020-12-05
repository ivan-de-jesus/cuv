<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button @click="stopListeningClients(),$router.go(-1)">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Clientes</ion-title>
      </ion-toolbar>
      <ion-toolbar color="danger">
        <ion-searchbar mode="ios" placeholder="Buscar" @ionInput="search = $event.target.value" />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="!clients.length && !loadedClients" class="loading-section">
        <ion-spinner></ion-spinner>
      </div>
      <ion-list>
        <UserItem
          :client="client"
          :clients="clients"
          :key="'user_' + client.id + index"
          v-for="(client, index) in clientsFiltered"
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
import ManageUserModal from "./components/ManageUserModal/ManageUserModal";
import UserItem from "./components/UserItem/UserItem";
import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";
import { mapState } from "vuex";
export default {
  store,
  components: { UserItem },
  data() {
    return {
      clients: [],
      loadedClients: false,
      listeningClients: {},
      search: "",
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user,
    }),

    clientsFiltered() {
      var clients = this.clients;
      // finding my clients and them dont be commercial advisor if I dont be admin
      // clients = clients.filter((client) => {
      //   if (this.currentUser.type !== "admin") {
      //     return (
      //       client.members &&
      //       client.members.indexOf(this.currentUser.uid) > -1 &&
      //       client.commercial_advisor == false
      //     );
      //   } else {
      //     return client;
      //   }
      // });

      if (this.currentUser.type !== "admin") {
        clients = clients.filter((client) => {
          return client.members.indexOf(this.currentUser.uid) != -1;
        });
      }

      return clients.filter((client) => {
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
    },
  },

  methods: {
    getUsers() {
      let clients = [];
      var v = this;
      /*
      const customSorter = (a, b) =>
        new Date(a.dateUpdate).getTime() - new Date(b.dateUpdate).getTime();*/

      var listeningClients = console.log(v.currentUser.type);

      listeningClients = firebase
        .firestore()
        .collection("users")
        .where("type", "==", "client")
        .orderBy("dateUpdate", "desc");

      this.listeningClients = listeningClients.onSnapshot((querySnapshot) => {
        clients = [];
        querySnapshot.forEach((doc) => {
          clients.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        //clients.sort(customSorter).reverse(); // TODO: SORTER

        this.clients = clients;

        this.loadedClients = true;
      });
    },
    stopListeningClients() {
      if (this.listeningClients) {
        this.listeningClients();
      }
    },
    createModal() {
      var vm = this;

      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: ManageUserModal,
          componentProps: {
            propsData: {
              type: "create",
              clients: vm.clients,
            },
          },
        })
        .then((m) => m.present());
    },
  },

  created() {
    this.getUsers();
  },
};
</script>