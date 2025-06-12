import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vuetify } from './plugins/vuetify'

const app = createApp(App)

app.use(router)
app.use(vuetify)

// MSW
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  await worker.start()
}

app.mount('#app')
