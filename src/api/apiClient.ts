import createClient from 'openapi-fetch'
import type { paths } from '@/api/schema'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const apiClient = createClient<paths>({
  baseUrl: baseUrl,
})
