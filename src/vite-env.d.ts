/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  _env_?: Partial<Record<'VITE_API_BASE_URL' | 'VITE_USE_MOCK', string>>
}
