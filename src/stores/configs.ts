import { ref } from 'vue'
import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'

export const useConfigStore = defineStore('configs', {
  state: () => ({
    firstRun: ref(true),
    useDark: ref(false),
  }),
  getters: {
    curTheme(state) {
      return state.useDark ? darkTheme : null
    }
  },
  actions: {
    changeTheme() {
      this.useDark = !this.useDark
    },
  },
  persist: true
})
