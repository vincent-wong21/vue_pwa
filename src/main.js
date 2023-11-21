import { createApp } from 'vue'
import './scss/styles.scss'
import * as bootstrap from 'bootstrap'

import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

const intervalMS = 3 * 1000

const updateSW = registerSW({
  onRegistered(r) {
    r && setInterval(() => {
      console.log('update');
      r.update()
    }, intervalMS)
  }
})
registerSW({ immediate: true })

createApp(App).mount('#app')
