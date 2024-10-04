import { Close } from '@/assets/icons/close'
import { Button, Typography } from '@chrizzo/ui-kit'
import { toast } from 'sonner'

import pageStyles from '@/pages/generalInfo/page.module.scss'

type Props = {
  onDismiss: () => void
  title: string
}
export const Toast = ({ onDismiss, title }: Props) => {
  return (
    <div className={pageStyles.toastWrapper}>
      <Typography variant={'regular16'}>{title}</Typography>
      <Button className={pageStyles.close} onClick={onDismiss} variant={'text'}>
        <Close />
      </Button>
    </div>
  )
}