import { z } from 'zod'

export const userGeneralInfoSchema = z.object({
  aboutMe: z.string().max(200).optional(),
  // .regex(
  //   /^[0-9A-Za-zА-Яа-я\s!@#$%^&*()_+\-=[\]{};':"\\|,./?]+$/,
  //   'Поле "about" может содержать цифры, буквы латинского и кириллического алфавита, а также специальные символы'
  city: z.string().min(3).optional(),
  country: z.string().min(3).optional(),
  // ),
  dateOfBirth: z
    .string()
    // .min(10, 'Дата введена неполностью')
    // .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Дата должна быть в формате ДД.ММ.ГГГГ')
    .refine(date => {
      console.log('date', date)
      const [year, month, day] = date.split('-').map(Number)
      const dateObj = new Date(year, month - 1, day)

      console.log(day, month, year)

      return (
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day
      )
    }, 'Введена недействительная дата'),
  firstName: z
    .string()
    .min(1)
    .max(50)
    .regex(
      /^[a-zA-Zа-яА-Я]+$/,
      'Имя должно содержать только буквы латинского алфавита или кириллицы'
    ),
  lastName: z
    .string()
    .min(1)
    .max(50)
    .regex(
      /^[a-zA-Zа-яА-Я]+$/,
      'Фамилия должна содержать только буквы латинского алфавита или кириллицы'
    ),
  userName: z
    .string()
    .min(6)
    .max(30)
    .regex(
      /^[0-9A-Za-z_-]+$/,
      'Логин может содержать цифры, буквы латинского и кириллического алфавита, а также специальные символы'
    ),
})

export type UserGeneralInfoData = z.infer<typeof userGeneralInfoSchema>
