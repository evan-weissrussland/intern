import React, { Dispatch, ReactNode, SetStateAction } from 'react'

import { Close } from '@/assets/icons/close'
import { Modalka, ModalkaButtonCancel, ModalkaContent, ModalkaTitle } from '@/components/modal'
import { Button, Card, Typography } from '@chrizzo/ui-kit'

import s from './modalConfirmCloseEditPost.module.scss'

type Props = {
  callback: () => void
  children: ReactNode
  closeThisModal: Dispatch<SetStateAction<boolean>>
  title: string
}
export const ModalConfirmCloseEditPost = ({ callback, children, closeThisModal, title }: Props) => {
  /**
   * функция вызова коллбэка из пропсов по клику на кнопку Yes.
   */
  const closeModalEditHandler = () => {
    callback()
  }

  return (
    <Modalka onOpenChange={(_: boolean) => {}} open>
      <ModalkaContent aria-describedby={undefined} className={s.content}>
        <ModalkaTitle className={s.title}>
          <Typography variant={'h1'}>{title}</Typography>
          <ModalkaButtonCancel asChild>
            <Button className={s.close} onClick={() => closeThisModal(false)} variant={'text'}>
              <Close />
            </Button>
          </ModalkaButtonCancel>
        </ModalkaTitle>
        <Card className={s.card} maxWidth={'644px'} variant={'dark300'}>
          <div className={s.questionConfirmBlock}>{children}</div>
          <div className={s.buttonBlock}>
            <Button className={s.yesButton} onClick={closeModalEditHandler} variant={'outline'}>
              <Typography variant={'h3'}>Yes</Typography>
            </Button>
            <ModalkaButtonCancel asChild>
              <Button
                className={s.noButton}
                onClick={() => closeThisModal(false)}
                variant={'primary'}
              >
                <Typography variant={'h3'}>No</Typography>
              </Button>
            </ModalkaButtonCancel>
          </div>
        </Card>
      </ModalkaContent>
    </Modalka>
  )
}
