import { useForm } from 'react-hook-form'

import { createPassSchema } from '@/components/auth/createNewPass/createPass-schema'
import { FormCreatePassValues } from '@/components/auth/createNewPass/types'
import { FormInput } from '@/components/controll/formTextField'
import { ScrollWrapper } from '@/components/profile-settings'
import { Toast } from '@/components/toast/Toast'
import { useTranslation } from '@/hooks/useTranslation'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useCreateNewPassMutation } from '@/services/inctagram.auth.service'
import { Button, Card, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import s from '@/components/auth/createNewPass/create-new-pass.module.scss'

export function CreateNewPassword() {
  /**
   * кастомный хук интенационализации
   */
  const { router, t } = useTranslation()
  /**
   * Переменные для обработки форм из react-hook-form
   */
  const { control, handleSubmit } = useForm<FormCreatePassValues>({
    mode: 'onTouched',
    resolver: zodResolver(createPassSchema),
  })
  const [createNewPass] = useCreateNewPassMutation()
  /**
   * Обработчик формы
   * @param data - данные из формы
   */
  const onSubmit = (data: FormCreatePassValues) => {
    createNewPass({ newPassword: data.newPass, recoveryCode: '' })
      .unwrap()
      .then((e: any) => {
        void router.push('/login')
      })
      .catch((e: any) => {
        /**
         * всплывашка
         */
        toast.custom(
          jsx => <Toast onDismiss={() => toast.dismiss(jsx)} title={e.data.messages[1].message} />,
          {
            className: s.errorToast,
          }
        )
      })
  }
  /**
   * контроль ширины окна
   */
  const windowWidth = useWindowWidth()

  return (
    <ScrollWrapper className={''} height={'calc(100vh - 61px)'} mobile={windowWidth <= 360}>
      <div className={s.wrapper}>
        <Card className={s.card} variant={'dark500'}>
          <Typography className={s.title} variant={'h1'}>
            {t.createNewPass.title}
          </Typography>
          <form className={s.form} id={'createForm'} onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              control={control}
              label={t.createNewPass.formInput}
              name={'newPass'}
              placeholder={'*****'}
              type={'password'}
            />
            <FormInput
              control={control}
              label={t.createNewPass.inputConfirm}
              name={'confirmPass'}
              placeholder={'******'}
              type={'password'}
            />
          </form>
          <Typography className={s.forgot} variant={'regular14'}>
            {t.createNewPass.description}
          </Typography>
          <Button form={'createForm'} fullWidth type={'submit'}>
            <Typography variant={'h3'}>{t.createNewPass.title}</Typography>
          </Button>
        </Card>
      </div>
    </ScrollWrapper>
  )
}

export default CreateNewPassword
