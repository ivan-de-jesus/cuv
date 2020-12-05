<template>
  <div id="app">
    <ion-app>
      <ion-vue-router />
    </ion-app>
  </div>
</template>

<script>
require("@/firebase");

export default {
  name: "app"
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
  height:5px
}

ion-title {
  font-size: 17px
}

</style>