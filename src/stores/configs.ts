import { ref } from 'vue'
import { defineStore } from 'pinia'
import { darkTheme /*, useOsTheme */ } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'

export const useConfigStore = defineStore('configs', {
  state: () => ({
    firstRun: ref(true),
    osTheme: ref('light'),
    useSystemTheme: ref(false),
    userDarkTheme: ref(true),
    keepAlive: ref(true),
  }),
  getters: {
    currentTheme(): BuiltInGlobalTheme | null {
      return this.useDarkTheme ? darkTheme : null
    },
    useDarkTheme(state): boolean {
      return state.useSystemTheme ? state.osTheme == 'dark' : state.userDarkTheme
    }
  },
  actions: {
    changeTheme(): void {
      this.userDarkTheme = !this.userDarkTheme
    }
  },
  persist: true
})
