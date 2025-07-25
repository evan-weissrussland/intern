import React, { useEffect, useState } from 'react'

import { PageWrapper } from '@/components'
import { ScrollWrapper } from '@/components/profile-settings'
import { Button, TextField, Typography } from '@chrizzo/ui-kit'
import clsx from 'clsx'
import Image from 'next/image'

import s from '@/components/messanger/messanger.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

const users = [
  { userId: 1, userName: 'A' },
  { userId: 2, userName: 'B' },
  { userId: 3, userName: 'C' },
  { userId: 4, userName: 'D' },
  { userId: 5, userName: 'E' },
  { userId: 6, userName: 'F' },
  { userId: 7, userName: 'G' },
  { userId: 8, userName: 'H' },
]

type User = (typeof users)[0]

export function Messenger() {
  const [usersList, setUsersList] = useState<typeof users>([])
  const [activeUserId, setActiveUserId] = useState(0)
  const [inputMessageValue, setInputMessageValue] = useState('')
  const [isShowButtonSendMessage, setIsShowButtonSendMessage] = useState(false)

  const focusInputMessageHandler = () => {
    // setIsShowButtonSendMessage(true)
  }
  const blurInputMessageHandler = () => {
    // setIsShowButtonSendMessage(false)
  }
  const onChangeMessageInputHandler = (value: string) => {
    if (value) {
      setIsShowButtonSendMessage(true)
    } else {
      setIsShowButtonSendMessage(false)
    }
    setInputMessageValue(value)
  }

  const onClickActiveUserHandler = (id: number) => {
    setActiveUserId(id)
  }

  useEffect(() => {
    setUsersList(users)
  }, [])
  const activeUser = usersList?.find(user => user.userId === activeUserId)

  return (
    <PageWrapper className={s.wrapper}>
      <div className={s.titleBlock}>
        <Typography className={s.title} variant={'h1'}>
          Messenger
        </Typography>
      </div>
      <div className={s.contentBlock}>
        <div className={s.searchBlock}>
          <TextField className={s.searchInput} placeholder={'Search'} type={'search'} />
        </div>
        <div className={s.userBlock}>{activeUser && <MessageUser user={activeUser} />}</div>
        <div className={s.usersListBlock}>
          <ScrollWrapper className={s.scroll} mobile={false} scroll>
            <ul className={s.usersList}>
              {usersList.map(user => {
                return (
                  <MessageUser
                    active={user.userId === activeUserId}
                    key={user.userId}
                    setActive={onClickActiveUserHandler}
                    user={user}
                  />
                )
              })}
            </ul>
          </ScrollWrapper>
        </div>
        <div className={s.messageBlock}>
          {!activeUserId && (
            <Typography className={s.chooseTitle} variant={'regular14'}>
              Choose who you would like to talk to
            </Typography>
          )}
          <div className={s.contentMessageBlock}></div>
          {!!activeUserId && (
            <div className={s.inputMessageBlock}>
              <TextField
                className={s.messageInput}
                onBlur={blurInputMessageHandler}
                onFocus={focusInputMessageHandler}
                onValueChange={onChangeMessageInputHandler}
                placeholder={'Type Message'}
                value={inputMessageValue}
              />
              {isShowButtonSendMessage && (
                <Button type={'button'} variant={'text'}>
                  <Typography className={s.sendMessageTitle} variant={'h3'}>
                    Send message
                  </Typography>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

export default Messenger

type Props = {
  // items: UsersType[] | undefined
  active?: boolean
  setActive?: (id: number) => void
  user: User
}
export const MessageUser = ({ active, setActive, user }: Props) => {
  return (
    <li className={clsx(s.li, active && s.active)} onClick={() => setActive?.(user.userId)}>
      <Image alt={'small-avatar'} className={s.image} height={48} src={defaultAva} width={48} />
      <div>
        <div className={s.userName}>
          <Typography variant={'regular16'}>{user?.userName}</Typography>
        </div>
        <div className={s.message}>
          <Typography variant={'regular14'}>fffffffffffff</Typography>
        </div>
      </div>
    </li>
  )
}
