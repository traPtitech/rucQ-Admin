import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  display: {
    mobileBreakpoint: 'md',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: '#F6F6F6',
          surface: '#FFFFFF',
          primary: '#FF7300',
          secondary: '#005CDD',
          success: '#4CAF50',
          warning: '#FF7300',
          error: '#FF4D00',
          info: '#008CFF',
          accent: '#FF7300',
        },
      },
    },
  },
})
