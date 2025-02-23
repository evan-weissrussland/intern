import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Captcha } from '@/components/auth/forgotPassword/captcha'
import { forgotSchema } from '@/components/auth/forgotPassword/forgot-schema'
import { FormForgotValues } from '@/components/auth/forgotPassword/types'
import { FormInput } from '@/components/controll/formTextField'
import { ScrollWrapper } from '@/components/profile-settings'
import { useTranslation } from '@/hooks/useTranslation'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useForgotPassMutation } from '@/services/inctagram.auth.service'
import { Button, Card, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

import s from '@/components/auth/forgotPassword/forgot-pass.module.scss'

function ForgotPassword() {
  /**
   * ref. Пробрасываем в капчу. Там используем для запуска капчи. Здесь используем для сброса капчи после
   * нажатия на отправку формы
   */
  const recaptchaRef = useRef<any>(null)
  /**
   * храним токен из капчи. Добавляем его в body запроса на сервер
   */
  const [captchaToken, setIsCaptchaToken] = useState('')

  /**
   * стейт открытия модалки об отправке ссылки на почту
   */
  const [isShowModal, setIsShowModal] = useState(false)

  /**
   * Флаг успешного запроса за forgotPass. Нужен для скрытия капчи и отображения сообщения об успехе
   */
  const [isSuccessForgotPass, setIsSuccessForgotPass] = useState(false)

  /**
   * Обработка ошибки капчи
   */
  const [errorCaptcha, setErrorCaptcha] = useState<{ error: boolean; errorTitle: string }>({
    error: false,
    errorTitle: '',
  })
  /**
   * Переменные для обработки форм из react-hook-form
   */
  const { control, formState, handleSubmit, setError, setValue, watch } = useForm<FormForgotValues>(
    {
      mode: 'onTouched',
      resolver: zodResolver(forgotSchema),
    }
  )

  /**
   * useEffect внизу нужен для отображения почты в инпуте, после того, как успешно отправили запрос forgotPassword.
   * Потому что прячется капча, а инпут с почтой остаётся.
   */
  useEffect(() => {
    if (isSuccessForgotPass) {
      const email = localStorage.getItem('email')

      if (email) {
        setValue('email', email)
      }
    }
  }, [isSuccessForgotPass])

  /**
   * контроль за полем email. Вызывает ререндер при onChange в поле. Не помню для чего я его написал
   */
  const watchShowEmail = watch('email', '')

  /**
   * хук RTKQ for forgotPass
   */
  const [forgotPass] = useForgotPassMutation()

  /**
   * обработчик повторной отправке ссылки на почту
   */
  const againSendLinkHandler = () => {}

  /**
   * кастомный хук интенационализации
   */
  const { t } = useTranslation()
  /**
   * хук обработки URL
   */
  const router = useRouter()
  /**
   * Обработчик формы
   * @param data - данные из формы
   */
  const onSubmit = (data: FormForgotValues) => {
    const formData = {
      baseUrl: process.env.NEXT_PUBLIC_LOCAL_HOST,
      email: data.email,
      recaptcha: '',
    }

    if (captchaToken) {
      localStorage.setItem('email', watchShowEmail)
      formData.recaptcha = captchaToken
      forgotPass(formData)
        .unwrap()
        .then((e: any) => {
          setIsSuccessForgotPass(true)
          void router.push('/forgotPassword?showModal=true')
        })
        .catch((e: any) => {
          const emailError = e.data.messages.find((e: any) => e.field === 'email')
          const captchaError = e.data.messages.find((e: any) => e.field === 'recaptcha')

          emailError && setError('email', { message: emailError.message })
          captchaError && setErrorCaptcha({ error: true, errorTitle: captchaError.message })
        })
        .finally(() => {
          recaptchaRef.current.reset()
          setIsCaptchaToken('')
        })
    } else {
      setErrorCaptcha({ ...errorCaptcha, error: true })
    }
  }
  /**
   * внизу логика открытия модального окна через обработку query-параметра. Если есть
   * query-параметр showModal, то открываем модальное окно и меняем флаг успешного запроса
   * на true. Почему такая логика: чтобы она была одинакова для двух разных страниц, т.к. мы
   * должны открыть модалку и перебросить флаг успешного ресенда линки как с текущей страницы,
   * так и со страницы passwordRecovery
   */
  const params = useSearchParams()
  const toShowModal = params.get('showModal')

  useEffect(() => {
    if (toShowModal) {
      setIsSuccessForgotPass(true)
      setIsShowModal(true)
    }
  }, [params])

  /**
   * закрыть модальное окно
   */
  const closeModal = () => {
    setIsShowModal(false)
    void router.push('/forgotPassword')
  }
  /**
   * хук контроля ширины окна. Для изменений для модилок
   */
  const windowWidth = useWindowWidth()

  return (
    <ScrollWrapper className={''} height={'calc(100vh - 61px)'} mobile={windowWidth <= 360}>
      <div className={s.wrapper}>
        <Card className={s.card} variant={'dark500'}>
          <Typography className={s.title} variant={'h1'}>
            {t.forgotPassword.startPage.title}
          </Typography>
          {!isShowModal && (
            <>
              <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                  control={control}
                  label={t.common.email}
                  name={'email'}
                  placeholder={'Inctagram@gmail.com'}
                />
                <Typography className={s.forgot} variant={'regular14'}>
                  {t.forgotPassword.startPage.hint}
                </Typography>
                {isSuccessForgotPass && (
                  <Typography className={clsx(s.forgot, s.lightColorText)} variant={'regular14'}>
                    {t.forgotPassword.startPage.linkSent}
                  </Typography>
                )}
                {!isSuccessForgotPass ? (
                  <Button disabled={!captchaToken || !watchShowEmail} fullWidth type={'submit'}>
                    <Typography variant={'h3'}>{t.forgotPassword.startPage.sendLink}</Typography>
                  </Button>
                ) : (
                  <Button fullWidth onClick={againSendLinkHandler} type={'button'}>
                    <Typography variant={'h3'}>
                      {t.forgotPassword.startPage.sendLinkAgain}
                    </Typography>
                  </Button>
                )}
              </form>
              <Button as={Link} href={'/signIn'} variant={'text'}>
                <Typography variant={'h3'}>{t.forgotPassword.startPage.backToSignIn}</Typography>
              </Button>
            </>
          )}
          {!isSuccessForgotPass && !isShowModal && (
            <Captcha
              error={errorCaptcha.error}
              errorTitle={errorCaptcha.errorTitle}
              isChecked={!!captchaToken}
              label={t.captcha.label}
              onClick={(token: string) => setIsCaptchaToken(token)}
              ref={recaptchaRef}
              setErrorCaptcha={setErrorCaptcha}
              sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY || ''}
            />
          )}
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
    </ScrollWrapper>
  )
}

export default ForgotPassword
