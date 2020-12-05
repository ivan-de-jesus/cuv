<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss">
            <ion-icon color="danger" slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
          <ion-button @click="setPanzoom">
            <ion-icon color="danger" slot="icon-only" name="locate"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div id="img-modal-scene">
        <img :src="img" style="width:100vw" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import panzoom from "panzoom";
export default {
  props: {
    img: String,
  },
  methods: {
    setPanzoom() {
      var element = document.querySelector("#img-modal-scene");
      panzoom(element);
    },
    dismiss() {
      this.$ionic.modalController.dismiss();
    },
  },
  mounted() {
    setTimeout(() => {
      this.setPanzoom();
    }, 500);
  },
};
</script>

<style>
</style>