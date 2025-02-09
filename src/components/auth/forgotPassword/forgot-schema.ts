import { z } from 'zod'

export const forgotSchema = z.object({
  email: z.string({ message: 'Поля не должны быть пустыми' }).email({
    message:
      'Email must contain 0-9, a-z, A-Z, ! " # $ % &\n' +
      "' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _` { | } ~",
  }),
})
