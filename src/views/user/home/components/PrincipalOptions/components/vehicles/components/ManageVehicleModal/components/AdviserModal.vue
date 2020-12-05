<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">Asesor</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          :value="search"
          @ionInput="search = $event.target.value"
          placeholder="Buscar"
        />
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-radio-group @ionChange="clientSelected = $event.detail.value">
        <ion-item :key="'client_'+ client.id" v-for="client in clientFiltered" lines="full">
          <ion-radio slot="start" :value="JSON.stringify(client)"></ion-radio>
          <ion-label>
            <p>{{client.name}} {{client.lastname1}} {{client.lastname2}} {{client.phone}}</p>
            <ion-badge v-if="client.location">{{ client.location.name }}</ion-badge>
            <ion-badge v-else>SIN SUCURSAL</ion-badge>
          </ion-label>
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
        return client;
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
            .includes(vm.search.replace(/ /g, "").toLowerCase()) ||
          client.location.name.toLowerCase().includes(vm.search.toLowerCase())
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
              .includes(vm.search.replace(/ /g, "").toLowerCase()) ||
            client.location.name.toLowerCase().includes(vm.search.toLowerCase())
            //client.location.name.toLowerCase().replace(/ /g, "")
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