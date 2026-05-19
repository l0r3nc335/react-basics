import { mockResolver } from './mock'

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const base = import.meta.env.VITE_API_URL as string | undefined

  if (!useMock && base) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...init?.headers,
        },
      })
      if (res.ok) {
        if (res.status === 204) return undefined as T
        return res.json() as Promise<T>
      }
    } catch {
      // fall through to mock
    }
  }

  return mockResolver<T>(path, init)
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('hris_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem('hris_token', token)
  else localStorage.removeItem('hris_token')
}

export function getAuthToken(): string | null {
  return localStorage.getItem('hris_token')
}
