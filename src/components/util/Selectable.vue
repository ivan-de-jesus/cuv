<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss(false)">
            <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Selecionar</ion-title>

        <ion-buttons slot="secondary">
          <ion-button @click="dismiss(true)">HECHO</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list v-if="multiple">
        <ion-item text-wrap v-for="(item, j) in multipleOptions" :key="j">
          <!-- TEXT FROM SELECT -->
          <ion-label text-wrap>{{ item.text }}</ion-label>
          <!--  CHECKED OPTIONS  -->
          <ion-checkbox @ionChange="item.active = !item.active" :checked="item.active" />
        </ion-item>
      </ion-list>

      <ion-list v-else>
        <ion-item text-wrap v-for="(item, k) in genericData" :key="k">
          <ion-label>{{ item.text }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  name: "Selectable",

  mounted() {
    if (this.multiple && this.values) {
      this.multipleOptions = this.genericData.map((data) => ({
        text: data.text,
        value: data.value,
        active: this.values.includes(data.value),
      }));
    } else {
      this.multipleOptions = this.genericData.map((data) => ({
        text: data.text,
        value: data.value,
        active: false,
      }));
    }
  },

  data() {
    return {
      simpleSelection: "",
      multipleOptions: [],
      multipleSelection: [],
    };
  },

  props: {
    values: Array,
    genericData: Array,
    multiple: Boolean,
  },

  methods: {
    dismiss(update) {
      if (this.multiple) {
        const items = [];

        for (let i = 0; i < this.multipleOptions.length; i++) {
          if (this.multipleOptions[i].active) {
            delete this.multipleOptions[i].active;
            items.push(this.multipleOptions[i].value);
          }
        }

        this.$ionic.modalController.dismiss({
          text: items.toString(),
          items,
          update,
        });
      }
    },
  },
};
</script>

<style scoped>
</style>