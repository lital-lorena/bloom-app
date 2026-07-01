const raw = import.meta.env.VITE_API_URL
export const API_URL = (typeof raw === 'string' && raw.trim())
  ? raw.trim().replace(/\/$/, '')
  : 'http://127.0.0.1:5000'
