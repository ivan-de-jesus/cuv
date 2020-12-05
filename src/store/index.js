import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    my_branch_office: ""
  },

  mutations: {
    update_state(state, {
      propertie,
      value
    }) {
      state[propertie] = value
    },
    updateUser(state, user) {
      state.user = user;
      console.log(state.user)
    },
    resetuser(state) {
      state.user = {};
    }
  },

  actions: {
    reset(context) {
      context.commit('resetuser');
    }
  },

  modules: {

  }
})