import { memo } from 'react'

import ConfirmImg from '@/assets/image/confirmError.png'
import { useTranslation } from '@/hooks/useTranslation'
import { Button, Typography } from '@chrizzo/ui-kit'
import Image from 'next/image'
import { useRouter } from 'next/router'

import s from './mailVerificationError.module.scss'

type MailVerificationErrorProps = {
  email: string
  resentCallback: () => void
}

export const MailVerificationError = memo(({ resentCallback }: MailVerificationErrorProps) => {
  const { t } = useTranslation()

  return (
    <div className={s.pageWrapper}>
      <div className={s.itemWrapper}>
        <Typography className={s.title} variant={'h1'}>
          {t.signUp.emailExpired}
        </Typography>
        <Typography className={s.description} variant={'regular16'}>
          {t.signUp.expiredDescription}
        </Typography>
        <Button className={s.button} onClick={() => resentCallback()} variant={'primary'}>
          <Typography className={s.signin} variant={'h3'}>
            {t.signUp.resendVerificationLink}
          </Typography>
        </Button>
        <Image alt={'error signup'} className={s.img} src={ConfirmImg} />
      </div>
    </div>
  )
})
