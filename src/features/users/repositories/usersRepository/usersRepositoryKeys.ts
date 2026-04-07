export const USERS_KEYS = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
} as const
