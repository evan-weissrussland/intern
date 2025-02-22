import { z } from 'zod'

export const createPassSchema = z
  .object({
    confirmPass: z.string(),
    newPass: z
      .string({ message: 'Поля не должны быть пустыми' })
      .min(6, 'Password has to be at least 6 characters long')
      .max(20, 'Password has to be no longer 20 characters long'),
  })
  .refine(data => data.newPass === data.confirmPass, {
    message: 'Passwords do not match',
    path: ['confirmPass'],
  })
