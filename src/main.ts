import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { vuetify } from './plugins/vuetify'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './plugins/vue-query'
import './assets/markdown.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(vuetify)
app.use(VueQueryPlugin, { queryClient })

// MSW
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  await worker.start()
}

app.mount('#app')
