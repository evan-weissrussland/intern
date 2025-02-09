import { forgotSchema } from '@/components/auth/forgotPassword/forgot-schema'
import { z } from 'zod'

export type FormForgotValues = z.infer<typeof forgotSchema>
