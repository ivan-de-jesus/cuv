<template>
  <ion-item @click="openSelect">
    <ion-label position="floating">{{ title }}</ion-label>
    <ion-input autocapitalize="on" readonly :disabled="disabled" :value="dataText" />
  </ion-item>
</template>

<script>
import Selectable from "./Selectable";

export default {
  name: "SelectItem",

  computed: {
    dataText: {
      get() {
        let myArray = [];

        this.genericData.map((data) => {
          if (this.values.includes(data.value)) myArray.push(data.text);
        });

        return myArray;
      },

      set(mArray) {
        let myArray = [];

        this.genericData.map((data) => {
          if (mArray.includes(data.value)) myArray.push(data.text);
        });

        return myArray;
      },
    },
  },

  props: {
    title: String,
    values: Array,
    disabled: Boolean,
    genericData: Array,
    multiple: Boolean,
  },

  methods: {
    openSelect() {
      return this.$ionic.modalController
        .create({
          backdropDismiss: false,
          component: Selectable,
          componentProps: {
            propsData: {
              genericData: this.genericData,
              multiple: true,
              values: this.values,
            },
          },
        })
        .then((m) => {
          m.onDidDismiss().then(({ data }) => {
            if (data.update) {
              this.dataText = data.items;
              this.$emit("onSelected", data);
            }
          });
          m.present();
        });
    },
  },
};
</script>

<style scoped>
</style>