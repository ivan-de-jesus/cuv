<template>
  <ion-menu side="start" content-id="content" id="content">
    <ion-header>
      <ion-toolbar color="danger">
        <ion-avatar style="width:40px; height: 40px; margin-left:10px" slot="start">
          <img :src="user.photoURL" style="background:#f1f1f1" />
        </ion-avatar>
        <div style="margin-left:10px">
          {{user.name}}
          <br />
          <span style="font-size:12px">{{user.email}}</span>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <Options />
    </ion-content>
  </ion-menu>
</template>

<script>
import Options from "../userIcon/components/options/Options";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["user"])
  },
  components: { Options }
};
</script>

<style>
</style>