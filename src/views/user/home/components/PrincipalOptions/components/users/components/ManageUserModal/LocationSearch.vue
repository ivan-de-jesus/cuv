<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="dismiss(false)">
                        <ion-icon color="dark" slot="icon-only" name="arrow-back"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title color="danger">Sucursal</ion-title>
            </ion-toolbar>
            <ion-toolbar>
                <ion-searchbar
                :value="search"
                @ionInput="search = $event.target.value"
                placeholder="Buscar" />
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-radio-group @ionChange="locationSelected = $event.detail.value">
                <ion-item :key="'client_'+ location.id" v-for="location in locationFiltered" lines="full">
                    <ion-radio slot="start" :value="JSON.stringify(location)"></ion-radio>
                    <ion-label>{{ location.name }}</ion-label>
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
            locations: Array
        },
        data() {
            return {
                locationSelected: "",
                search: ""
            };
        },
        computed: {
            ...mapState({
                currentUser: state => state.user
            }),
            locationFiltered() {
                const vm = this;

                const clients = this.locations.filter(client => {
                    return client;
                });

                return clients.filter(client => {
                    if (
                        (client &&
                            client.name &&
                            client.name.toLowerCase().includes(vm.search.toLowerCase()))
                    ) {
                        return (

                            (client.name &&
                                client.name.toLowerCase().includes(vm.search.toLowerCase()))
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
            locationSelected(value) {
                this.dismiss(JSON.parse(value));
            }
        }
    };
</script>