import { Close } from '@/assets/icons/close'
import { Button, Typography } from '@chrizzo/ui-kit'

import s from '@/components/toast/toast.module.scss'

type Props = {
  onDismiss: () => void
  title: string
}
export const Toast = ({ onDismiss, title }: Props) => {
  return (
    <div className={s.toastWrapper}>
      <Typography className={s.typographyToast} variant={'regular16'}>
        {title}
      </Typography>
      <Button className={s.close} onClick={onDismiss} variant={'text'}>
        <Close />
      </Button>
    </div>
  )
}
