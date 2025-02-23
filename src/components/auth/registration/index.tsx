import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SocialAuthButtons } from '@/components/auth'
import { SignUpFormType, signUpSchema } from '@/components/auth/registration/registration-shema'
import { FormCheckbox } from '@/components/controll/formCheckbox'
import { FormInput } from '@/components/controll/formTextField'
import { Toast } from '@/components/toast/Toast'
import { useTranslation } from '@/hooks/useTranslation'
import { useRegistrationMutation } from '@/services/inctagram.auth.service'
import { Button, Card, Typography } from '@chrizzo/ui-kit'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { omit } from 'remeda'
import { toast } from 'sonner'

import s from './singUp.module.scss'

export const SingUp = () => {
  const router = useRouter()
  /**
   * хук RTKQ регистрации
   */
  const [registration] = useRegistrationMutation()
  /**
   * use-hook-form
   */
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpFormType>({ mode: 'onSubmit', resolver: zodResolver(signUpSchema) })

  /**
   * стейт открытия модалки об отправке ссылки на почту
   */
  const [isShowModal, setIsShowModal] = useState(false)
  /**
   * Обработчик формы. Сначала zod валидирует поля, и если всё норм, то уже отрабатывает эта функция
   * @param data - данные из полей формы
   */
  const onHandleSubmit = async (data: SignUpFormType) => {
    registration(omit(data, ['confirmPassword', 'rememberMe']))
      .unwrap()
      .then(() => {
        localStorage.setItem('email', data.email)
        void router.push('/signUp?showModal=true')
      })
      .catch(e => {
        /**
         * всплывашка
         */
        toast.custom(
          jsx => <Toast onDismiss={() => toast.dismiss(jsx)} title={e.data.messages[0].message} />,
          {
            className: 'errorToast',
          }
        )
      })
  }
  /**
   * интернационализация
   */
  const { t } = useTranslation()

  /**
   * внизу логика открытия модального окна через обработку query-параметра. Если есть
   * query-параметр showModal, то открываем модальное окно и меняем флаг успешного запроса
   * на true
   */
  const params = useSearchParams()
  const toShowModal = params.get('showModal')

  useEffect(() => {
    if (toShowModal) {
      setIsShowModal(true)
    }
  }, [params])

  /**
   * закрыть модальное окно
   */
  const closeModal = () => {
    setIsShowModal(false)
    void router.push('/signUp')
  }

  return (
    <div className={s.wrapper}>
      <Card className={s.card} variant={'dark500'}>
        <Typography className={s.title} textAlign={'center'} variant={'h1'}>
          {t.signUp.title}
        </Typography>
        <SocialAuthButtons />
        <form onSubmit={handleSubmit(onHandleSubmit)}>
          <DevTool control={control} />
          <div className={s.wrap}>
            <FormInput
              className={s.Form}
              control={control}
              error={errors.email?.message}
              label={t.signUp.userName}
              name={'userName'}
              placeholder={'username'}
            />
            <FormInput
              className={s.Form}
              control={control}
              error={errors.email?.message}
              label={t.signUp.emailTitle}
              name={'email'}
              placeholder={'Email'}
            />
            <FormInput
              className={s.Form}
              control={control}
              error={errors.password?.message}
              label={t.signUp.passTitle}
              name={'password'}
              placeholder={'Password'}
              type={'password'}
            />
            <FormInput
              control={control}
              error={errors.confirmPassword?.message}
              label={t.signUp.confirmPass}
              name={'confirmPassword'}
              placeholder={'Confirm Password'}
              type={'password'}
            />
            <FormCheckbox
              control={control}
              label={
                <Typography className={s.checkboxwrapper} variant={'small'}>
                  I agree to the{' '}
                  <Typography as={Link} href={'/termsOfService'} variant={'smallLink'}>
                    Terms of Service
                  </Typography>{' '}
                  and{' '}
                  <Typography as={Link} href={'/privacyPolicy'} variant={'smallLink'}>
                    Privacy Policy
                  </Typography>
                </Typography>
              }
              name={'rememberMe'}
            />
            {errors.rememberMe && (
              <Typography style={{ color: 'red' }} variant={'small'}>
                {errors.rememberMe?.message}
              </Typography>
            )}
            <Button className={s.SingUpButton} type={'submit'}>
              {t.signUp.signUp}
            </Button>
          </div>
        </form>
        <Typography className={s.title} textAlign={'center'} variant={'regular16'}>
          {t.signUp.haveAcc}
        </Typography>
        <Button as={Link} className={s.SingInButton} href={'/login'} variant={'text'}>
          {t.signUp.signInButton}
        </Button>
      </Card>
      {isShowModal && (
        <div className={s.modalWrapper}>
          <Card className={s.card}>
            <div className={s.emailSentTitleBlock}>
              <Typography variant={'h1'}>Email sent</Typography>
              <button onClick={closeModal} type={'button'}>
                X
              </button>
            </div>
            <hr className={s.hrLine} />
            <div className={s.descriptionSentBlock}>
              <Typography variant={'regular16'}>
                We have sent a link to confirm your email to {localStorage.getItem('email')}
              </Typography>
              <Button className={s.buttonOk} onClick={closeModal} type={'button'}>
                <Typography variant={'h3'}>OK</Typography>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
