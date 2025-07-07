import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { vuetify } from './plugins/vuetify'
import { worker } from './mocks/browser'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(vuetify)

// MSW
if (import.meta.env.DEV) {
  worker.start()
}

app.mount('#app')
