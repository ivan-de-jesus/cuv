<template>
  <ion-item v-if="userData.user">
    <ion-avatar slot="start"><img :src="userData.user.photoURL" /></ion-avatar>
    <ion-label text-wrap>
      {{ userData.user.name }} {{ userData.user.lastname1 }}
      {{ userData.user.lastname2 }}</ion-label
    >
    <ion-badge
      slot="end"
      v-if="userData && userData.user && userData.user.type == 'admin'"
      >admin</ion-badge
    >
    <ion-checkbox
      slot="end"
      @ionChange="emitAndUpdate"
      :checked="userData.isMember"
    />
    <!-- {{userData.user.type}} -->
  </ion-item>
</template>

<script>
export default {
  name: "UserCheckBox",

  props: ["userMember"],

  data() {
    return {
      userData: {},
    };
  },

  methods: {
    emitAndUpdate() {
      this.userMember.isMember = !this.userMember.isMember;
      this.$emit("onMemberChange", this.userMember.user.id);
    },
  },

  mounted() {
    this.userData = this.userMember;
  },
};
</script>