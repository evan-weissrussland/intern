import React, { ReactNode } from 'react'

import { Close } from '@/assets/icons/close'
import { Modalka, ModalkaButtonCancel, ModalkaContent, ModalkaTitle } from '@/components/modal'
import { Button, Card, Typography } from '@chrizzo/ui-kit'

import s from './modalConfirmDeletePost.module.scss'

type Props = {
  callback: () => void
  children: ReactNode
  closeThisModal: () => void
  title: string
}
export const ModalConfirmDeletePost = ({ callback, children, closeThisModal, title }: Props) => {
  /**
   * функция вызова коллбэка из пропсов по клику на кнопку Yes.
   */
  const logoutHandler = () => {
    callback()
  }

  return (
    <Modalka onOpenChange={(_: boolean) => {}} open>
      <ModalkaContent aria-describedby={'open viewport followers'} className={s.content}>
        <ModalkaTitle className={s.title}>
          <Typography variant={'h1'}>{title}</Typography>
          <ModalkaButtonCancel asChild>
            <Button className={s.close} onClick={() => closeThisModal()} variant={'text'}>
              <Close />
            </Button>
          </ModalkaButtonCancel>
        </ModalkaTitle>
        <Card className={s.card} maxWidth={'644px'} variant={'dark300'}>
          <div className={s.questionConfirmBlock}>{children}</div>
          <div className={s.buttonBlock}>
            <Button className={s.yesButton} onClick={logoutHandler} variant={'outline'}>
              <Typography variant={'h3'}>Yes</Typography>
            </Button>
            <ModalkaButtonCancel asChild>
              <Button className={s.noButton} onClick={() => closeThisModal()} variant={'primary'}>
                <Typography variant={'h3'}>No</Typography>
              </Button>
            </ModalkaButtonCancel>
          </div>
        </Card>
      </ModalkaContent>
    </Modalka>
  )
}
