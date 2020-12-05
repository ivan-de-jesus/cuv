<template>
  <Process
    @showModal="showModal"
    :stepMembers="stepMembers"
    @activeButton="$emit('activeButton')"
    @getProcesses="$emit('getProcesses')"
    v-if="process.processType == 0 || process.processType == 2 "
    :process="process"
    :vehicle="vehicle"
    :disabled="disabled"
  />
  <Budget
    @showModal="showModal"
    :stepMembers="stepMembers"
    @getProcesses="$emit('getProcesses')"
    @activeButton="$emit('activeButton')"
    v-else-if="process.processType == 1"
    :process="process"
    :vehicle="vehicle"
    :disabled="disabled"
  />
  <Departure
    @showModal="showModal"
    :stepMembers="stepMembers"
    @getProcesses="$emit('getProcesses')"
    @activeButton="$emit('activeButton')"
    v-else-if="process.processType == 3"
    :process="process"
    :vehicle="vehicle"
    :disabled="disabled"
  />
</template>

<script>
import Process from "./typeProcess/Process";
import Budget from "./typeProcess/Budget";
import Departure from "./typeProcess/Departure";

export default {
  props: {
    process: Object,
    vehicle: Object,
    disabled: Boolean,
    onStep: Boolean,
    stepMembers: Object,
    user: String,
  },

  components: {
    Departure,
    Process,
    Budget,
  },

  methods: {
    showModal(url) {
      this.$emit("showModal", url);
    },
  },
};
</script>

<style>
</style>