type RuntimeEnvKey = 'VITE_API_BASE_URL' | 'VITE_USE_MOCK'

const fromWindow: Partial<Record<RuntimeEnvKey, string>> =
  typeof window !== 'undefined' && window._env_ ? window._env_ : {}

const read = (key: RuntimeEnvKey, fallback: string): string => {
  const v = fromWindow[key]
  if (v !== undefined && v !== '') return v
  const buildTime = import.meta.env[key] as string | undefined
  return buildTime !== undefined && buildTime !== '' ? buildTime : fallback
}

export const runtimeEnv = {
  VITE_API_BASE_URL: read('VITE_API_BASE_URL', 'http://localhost:8080'),
  VITE_USE_MOCK: read('VITE_USE_MOCK', 'false'),
} as const
