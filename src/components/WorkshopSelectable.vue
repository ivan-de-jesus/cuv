<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title color="danger">Talleres</ion-title>
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
            <p>
              {{ client.name }}
            </p>
            <ion-badge>{{ client.adress }}</ion-badge>
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

    name: "WorkshopSelectable",

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
        var vm = this;

        var clients = this.clients.filter(client => {
          return client;
        });

        return clients.filter(client => {
          return (
            (client.name &&
                client.name.toLowerCase().includes(vm.search.toLowerCase())) ||

            (client.adress &&
              client.adress
              .toLowerCase()
              .includes(vm.search.toLowerCase())) ||

            (client.location &&
              client.location
              .toLowerCase()
              .includes(vm.search.toLowerCase())) ||

            `${client.name}${client.adress}`
              .toLowerCase()
              .replace(/ /g, "")
              .includes(vm.search.replace(/ /g, "").toLowerCase()) ||

            `${client.name}${client.location}${client.location}`
              .toLowerCase()
              .replace(/ /g, "")
              .includes(vm.search.replace(/ /g, "").toLowerCase())
          );
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
  }
</script>

<style scoped>

</style>