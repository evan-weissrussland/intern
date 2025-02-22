import { createPassSchema } from '@/components/auth/createNewPass/createPass-schema'
import { z } from 'zod'

export type FormCreatePassValues = z.infer<typeof createPassSchema>
