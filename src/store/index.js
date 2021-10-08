import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      countries: [],
      states: [],
    }
  },
  mutations: {
    SET(state, { key, value }) {
      state[key] = value
    },
  },
})
