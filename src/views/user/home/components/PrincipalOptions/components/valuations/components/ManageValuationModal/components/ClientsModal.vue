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
  export default {
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
      clientFiltered() {
        const vm = this;

        return this.clients.filter(client => {

          if (client.name.toLowerCase().includes(vm.search.toLowerCase())) {

            return (
                    client.name.toLowerCase().includes(vm.search.toLowerCase()) ||
                    client.lastname1.toLowerCase().includes(vm.search.toLowerCase()) ||
                    client.lastname2.toLowerCase().includes(vm.search.toLowerCase())
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