import { type ComponentPropsWithoutRef, forwardRef, useEffect, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

import { CaptchaCheckd } from '@/assets/icons/captcha/captchaCheckd'
import { CaptchaLoad } from '@/assets/icons/captcha/captchaLoad'
import { ReCaptcha } from '@/assets/icons/captcha/reCaptcha'
import clsx from 'clsx'

import s from './captcha.module.scss'

type OwnerProps = {
  error?: boolean
  errorTitle?: string
  expired?: boolean
  expiredTitle?: string
  isChecked?: boolean
  label?: string
  load?: boolean
  onClick?: (token: string) => void
  setErrorCaptcha?: (p: { error: boolean; errorTitle: string }) => void
  sitekey: string
  theme?: 'dark' | 'light'
}

export type CaptchaProps = Omit<ComponentPropsWithoutRef<'div'>, keyof OwnerProps> & OwnerProps

export const Captcha = forwardRef(
  (
    {
      className,
      error = false,
      errorTitle = 'Please verify that you are not a robot',
      expired = false, //только для сторибука
      expiredTitle = 'Verifiction expired. Check the  again.',
      isChecked = false, //только для сторибука
      label = `I'm not a robot`,
      load = false, //только для сторибука
      onClick,
      setErrorCaptcha,
      sitekey,
      theme = 'light',
      ...restProps
    }: CaptchaProps,
    ref: any
  ) => {
    const [isLoad, setIsLoad] = useState(false)
    const [isCheckd, setIsCheckd] = useState(false)
    const [isExpired, setIsExpired] = useState(false)
    /**
     * @function
     * Обработчик запуска капчи
     */
    const loadHandler = () => {
      setIsLoad(true)
      setIsExpired(false)
      setErrorCaptcha && setErrorCaptcha({ error: false, errorTitle: '' })
      if (ref?.current) {
        ref?.current.execute()
      }
    }
    /**
     * для сторибука
     */

    useEffect(() => {
      setIsLoad(false)
    }, [expired, isChecked])

    useEffect(() => {
      if (!isCheckd && !isChecked) {
        setIsCheckd(false)
      }
      if (!isCheckd && isChecked) {
        setIsCheckd(true)
      }
      if (isCheckd && !isChecked) {
        setIsCheckd(false)
      }
    }, [isChecked])

    /**
     * для сторибука
     */

    useEffect(() => {
      if (!isLoad && !load) {
        setIsLoad(false)
      }
      if (!isLoad && load) {
        setIsLoad(true)
      }
      if (isLoad && !load) {
        setIsLoad(false)
      }
    }, [load])
    /**
     * стили общего контейнера / стили при ошибке / стили для темы
     */
    const classNames = clsx(s.captcha, error && s.error, s[theme], className)

    return (
      <>
        <div className={classNames} {...restProps}>
          <div className={s.container}>
            {(isExpired || expired) && <span className={clsx(s.expiredTitle)}>{expiredTitle}</span>}
            <div className={s.blockForInputLabel}>
              {(isCheckd || isChecked) && (
                <div className={s.iconCaptchaChekd}>
                  <CaptchaCheckd />
                </div>
              )}
              {isLoad && (
                <div className={s.iconCaptchaLoad}>
                  <CaptchaLoad />
                </div>
              )}
              <input
                className={isCheckd || isLoad ? s.checkboxTransparent : ''}
                id={'captcha-id'}
                onClick={!isCheckd && !isLoad ? loadHandler : undefined}
                tabIndex={1}
                type={'checkbox'}
              />
              <label className={clsx(s.dark)} htmlFor={'captcha-id'}>
                {label}
              </label>
            </div>
            <div className={s.figure}>
              <ReCaptcha />
              <span className={clsx(s.descriptionReCAPTCHA, s.dark)}>reCAPTCHA</span>
              <span className={clsx(s.descriptionPrivacyTerms, s.dark)}>Privacy - Terms</span>
            </div>
          </div>
          {error && <span className={clsx(s.errorTitle)}>{errorTitle}</span>}
        </div>
        <ReCAPTCHA
          onChange={token => {
            //капча успешно пройдена
            setIsLoad(false)
            if (token && onClick) {
              onClick(token)
            }
          }}
          onErrored={() => {
            //только ошибка сети. Если неправильно вводить карчу, то не срабатывает
            setIsLoad(false)
            setErrorCaptcha && setErrorCaptcha({ error: true, errorTitle: 'Network error' })
          }}
          onExpired={() => {
            //капча протухла. Через 2 минуты после успешного срабатывания
            setIsExpired(true)
            setIsCheckd(false)
            onClick && onClick('')
            ref?.current.reset()
          }}
          ref={ref}
          sitekey={sitekey}
          size={'invisible'}
        />
      </>
    )
  }
)
