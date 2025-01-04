import React, { ReactNode, memo, useState } from 'react'

import { Close } from '@/assets/icons/close'
import { CardFollowingsSubscribers } from '@/components/cardFollowingSubscription/CardFollowingsSubscribers'
import {
  Modalka,
  ModalkaButtonCancel,
  ModalkaContent,
  ModalkaTitle,
  ModalkaTrigger,
} from '@/components/modal'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { Button, Typography } from '@chrizzo/ui-kit'

import s from './modalFollowin.module.scss'
import st from '@/components/modalFollowing/modalFollowin.module.scss'

type Props = {
  callbackTrigger?: () => void
  className?: string
  followingCount?: number | string
  isMyProfile: boolean
  userName: string | undefined
}

export const ModalFollowing = memo(
  ({ callbackTrigger, followingCount, isMyProfile, userName }: Props) => {
    /**
     * кастомный хук контроля ширины окна
     */
    const windowWidth = useWindowWidth()
    /**
     * хук useState для управления open/close AlertDialog.Root. Нужен для того,
     * чтобы модалка закрывалась после передачи на сервер данных из формы,
     * иначе она просто закрывается и данные не передаются
     */
    const [open, setOpen] = useState(false)

    return (
      <Modalka onOpenChange={setOpen} open={isMyProfile ? open : false}>
        <ModalkaTrigger asChild>
          <div className={st.following} onClick={() => (callbackTrigger ? callbackTrigger() : {})}>
            <Typography variant={windowWidth > 360 ? 'regularBold14' : 'smallSemiBold'}>
              {followingCount}
            </Typography>
            <Typography variant={windowWidth > 360 ? 'regular14' : 'small'}>Following</Typography>
          </div>
        </ModalkaTrigger>
        <ModalkaContent aria-describedby={undefined} className={s.content}>
          <ModalkaTitle className={s.title}>
            <Typography variant={'h1'}>{followingCount} Following</Typography>
            <ModalkaButtonCancel asChild>
              <Button className={s.close} variant={'text'}>
                <Close />
              </Button>
            </ModalkaButtonCancel>
          </ModalkaTitle>
          <CardFollowingsSubscribers isMyProfile={isMyProfile} open={open} userName={userName} />
        </ModalkaContent>
      </Modalka>
    )
  }
)
