import { ApiError } from './errorHandler'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type HttpClientOptions = {
  method?: HttpMethod
  body?: string
  headers?: Record<string, string>
  params?: Record<string, string>
}

export type HttpClient = <T>(
  path: string,
  options?: HttpClientOptions,
) => Promise<T>

export const createHttpClient = (baseUrl: string): HttpClient =>
  async <T>(path: string, options?: HttpClientOptions): Promise<T> => {
    const url = new URL(path, baseUrl)
    if (options?.params) {
      Object.entries(options.params).forEach(([k, v]) =>
        url.searchParams.set(k, v),
      )
    }
    const token = getCookieValue('token')
    const res = await fetch(url.toString(), {
      method: options?.method ?? 'GET',
      body: options?.body,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })
    if (res.status === 401) {
      window.location.href = '/login'
      throw new ApiError(401, 'Unauthorized')
    }
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string }
      throw new ApiError(res.status, body?.message ?? res.statusText)
    }
    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }

const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}
