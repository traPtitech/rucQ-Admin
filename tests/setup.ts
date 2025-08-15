import { beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import { config } from '@vue/test-utils'

const vuetify = createVuetify()

beforeEach(() => {
  config.global.plugins = [vuetify]
})
