<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">Cliente</ion-title>
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
      <ion-radio-group @ionChange="clientSelected = $event.detail.value">
        <ion-item :key="'client_'+ client.id" v-for="client in clientFiltered" lines="full">
          <ion-radio slot="start" :value="JSON.stringify(client)"></ion-radio>
          <ion-label>{{client.name}} {{client.lastname1}} {{client.lastname2}} {{client.phone}}</ion-label>
        </ion-item>
      </ion-radio-group>
    </ion-content>
  </ion-page>
</template>
<script>
import store from "@/store";
import { mapState } from "vuex";
export default {
  store,
  props: {
    clients: Array
  },
  data() {
    return {
      clientSelected: "",
      search: ""
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.user
    }),
    clientFiltered() {
      const vm = this;

      var clients = this.clients.filter(client => {

        if (this.currentUser.type !== 'admin') {
          return (
                  client.members && client.members.indexOf(this.currentUser.uid) > -1
          );
        } else if(client.commercial_advisor === false) {
          return client;
        }
      });

      return clients.filter(client => {
        if (

        (client &&
            client.name &&
            client.name.toLowerCase().includes(vm.search.toLowerCase())) ||

          (client.lastname1 &&
            client.lastname1.toLowerCase().includes(vm.search.toLowerCase())) ||

          `${client.name}${client.lastname1}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(vm.search.replace(/ /g, "").toLowerCase()) ||

          `${client.name}${client.lastname1}${client.lastname2}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(vm.search.replace(/ /g, "").toLowerCase())
        ) {
          return (

          (client.name &&
              client.name.toLowerCase().includes(vm.search.toLowerCase())) ||

          (client.lastname1 &&
            client.lastname1
              .toLowerCase()
              .includes(vm.search.toLowerCase())) ||

          (client.lastname2 &&
            client.lastname2
              .toLowerCase()
              .includes(vm.search.toLowerCase())) ||

          `${client.name}${client.lastname1}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(vm.search.replace(/ /g, "").toLowerCase()) ||

          `${client.name}${client.lastname1}${client.lastname2}`
            .toLowerCase()
            .replace(/ /g, "")
            .includes(vm.search.replace(/ /g, "").toLowerCase())
          );
        }
      });
    }
  },
  methods: {
    dismiss(value) {
      this.$ionic.modalController.dismiss(value);
    }
  },
  watch: {
    clientSelected(value) {
      this.dismiss(JSON.parse(value));
    }
  }
};
</script>