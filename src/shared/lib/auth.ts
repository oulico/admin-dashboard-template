export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number }
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export const checkAuthAndRedirect = (): void => {
  const token = getCookie('token')
  if (!token || isTokenExpired(token)) {
    window.location.href = '/login'
  }
}
