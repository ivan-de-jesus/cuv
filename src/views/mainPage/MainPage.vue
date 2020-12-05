<template>
  <ion-page>
    <ion-content>
      <div class="red-primary" style="color:white; min-height:100vh; text-align:center">
        <AccessScreen />
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import AccessScreen from "./components/AccessScreen/AccessScreen";
import slides from "./components/slides";
import firebase from "@/firebase";

export default {
  name: "MainPage",
  components: {
    AccessScreen
  },
  data() {
    return {
      slideOpts: {
        initialSlide: 1,
        speed: 400
      },
      slides
    };
  },
  methods: {
    logOut() {
      firebase.auth.logOut();
    }
  },
  mounted() {
    this.logOut();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>