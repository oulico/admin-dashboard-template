import { z } from 'zod'

export const TokenEntitySchema = z.object({
  accessToken: z.string(),
  isAdmin: z.boolean(),
})

export type TokenEntity = z.infer<typeof TokenEntitySchema>
