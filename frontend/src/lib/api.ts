import createClient from 'openapi-fetch'
import type { paths } from '../types/api'

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})

export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function getAuthHeaders() {
  const token = localStorage.getItem('access_token')

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}