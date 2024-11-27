import { z } from 'zod'

export const createCommentSchema = z.object({
  comment: z
    .string()
    .min(1)
    .max(300)
    .trim()
    .refine(data => data.trim() !== ''),
})

export type CommentValue = z.infer<typeof createCommentSchema>
