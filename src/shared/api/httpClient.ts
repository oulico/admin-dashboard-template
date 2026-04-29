import {
  ACCESS_TOKEN_COOKIE,
  clearAuthCookies,
  getCookie,
  setAccessTokenCookie,
} from '@/shared/lib/auth'
import { ApiError } from './errorHandler'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type HttpClientOptions = {
  method?: HttpMethod
  body?: string
  headers?: Record<string, string>
  params?: Record<string, string>
  /** @internal — set by the client itself when retrying after a refresh */
  _retried?: boolean
}

export type HttpClient = <T>(
  path: string,
  options?: HttpClientOptions,
) => Promise<T>

const REFRESH_PATH = '/v1/auth/refresh'
// Endpoints that must never trigger a refresh-and-retry cycle.
// (refresh itself, and public auth endpoints whose 401 is a real failure)
const NO_REFRESH_PATHS = [REFRESH_PATH, '/v1/auth/login', '/v1/auth/register']

let refreshing: Promise<string> | null = null

const refreshAccessToken = async (baseUrl: string): Promise<string> => {
  refreshing ??= (async () => {
    const url = new URL(REFRESH_PATH, baseUrl).toString()
    const res = await fetch(url, { method: 'POST', credentials: 'include' })
    if (!res.ok) throw new ApiError(res.status, 'refresh failed')
    const data = (await res.json()) as { access_token: string }
    setAccessTokenCookie(data.access_token)
    return data.access_token
  })().finally(() => {
    refreshing = null
  })
  return refreshing
}

export const createHttpClient = (baseUrl: string): HttpClient =>
  async function client<T>(
    path: string,
    options?: HttpClientOptions,
  ): Promise<T> {
    const url = new URL(path, baseUrl)
    if (options?.params) {
      Object.entries(options.params).forEach(([k, v]) =>
        url.searchParams.set(k, v),
      )
    }
    const token = getCookie(ACCESS_TOKEN_COOKIE)
    const res = await fetch(url.toString(), {
      method: options?.method ?? 'GET',
      body: options?.body,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })

    if (
      res.status === 401 &&
      !options?._retried &&
      !NO_REFRESH_PATHS.includes(path)
    ) {
      try {
        await refreshAccessToken(baseUrl)
        return client<T>(path, { ...options, _retried: true })
      } catch {
        clearAuthCookies()
        window.location.href = '/login'
        throw new ApiError(401, 'Unauthorized')
      }
    }

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { detail?: string; message?: string }
      throw new ApiError(res.status, body?.detail ?? body?.message ?? res.statusText)
    }
    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }
