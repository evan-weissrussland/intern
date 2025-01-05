import React, { ReactNode, memo, useState } from 'react'

import { Close } from '@/assets/icons/close'
import { CardFollowersSubscribers } from '@/components/cardFollowersSubscription/CardFollowersSubscribers'
import {
  Modalka,
  ModalkaButtonCancel,
  ModalkaContent,
  ModalkaTitle,
  ModalkaTrigger,
} from '@/components/modal'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { Button, Typography } from '@chrizzo/ui-kit'

import s from './modalFollowers.module.scss'

type Props = {
  callbackTrigger?: () => void
  className?: string
  followersCount?: number | string
  isMyProfile: boolean
  trigger?: ReactNode
  userName: string | undefined
}

export const ModalFollowers = memo(
  ({ callbackTrigger, followersCount, isMyProfile, userName }: Props) => {
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
          <div className={s.followers} onClick={() => (callbackTrigger ? callbackTrigger() : {})}>
            <Typography variant={windowWidth > 360 ? 'regularBold14' : 'smallSemiBold'}>
              {followersCount}
            </Typography>
            <Typography variant={windowWidth > 360 ? 'regular14' : 'small'}>Followers</Typography>
          </div>
        </ModalkaTrigger>
        <ModalkaContent className={s.content}>
          <ModalkaTitle className={s.title}>
            <Typography variant={'h1'}>{followersCount} Followers</Typography>
            <ModalkaButtonCancel asChild>
              <Button className={s.close} variant={'text'}>
                <Close />
              </Button>
            </ModalkaButtonCancel>
          </ModalkaTitle>
          <CardFollowersSubscribers isMyProfile={isMyProfile} open={open} userName={userName} />
        </ModalkaContent>
      </Modalka>
    )
  }
)
