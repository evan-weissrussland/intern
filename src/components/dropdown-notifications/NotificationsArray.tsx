import React, { Dispatch, SetStateAction, useCallback } from 'react'
import ReactTimeAgo from 'react-time-ago'

import { NotificationItemType } from '@/services/inctagram.notifications.service'
import { DropDownItem, Typography } from '@chrizzo/ui-kit'

import s from '@/components/dropdown-notifications/dropdownNotifications.module.scss'

type Props = {
  marNotificationAsRead: (id: number) => void
  notifications: NotificationItemType[]
  setEditModalPost?: Dispatch<SetStateAction<boolean>>
}
export const NotificationsArray = ({
  marNotificationAsRead,
  notifications,
  setEditModalPost,
}: Props) => {
  /**
   * обработчик навигации + закрытие модального окна dropDown
   */
  const getToEditPostHandler = useCallback(() => {
    if (setEditModalPost) {
      setEditModalPost(true)
    }
  }, [])

  const notificationArray = notifications?.map(n => {
    /**
     * дата создания комментария
     */
    const dateAgo = new Date(n.createdAt)

    return (
      <DropDownItem className={s.item} key={n.id} onclick={getToEditPostHandler}>
        <div
          onClick={() => {
            marNotificationAsRead(n.id)
          }}
        >
          <Typography as={'span'} variant={'regularBold14'}>
            Новое уведомление!
          </Typography>{' '}
          <Typography as={'span'} className={s.titleNewNotief} variant={'small'}>
            {n.isRead ? '' : 'Новое'}
          </Typography>
        </div>
        <p className={s.notiefMessage}>{n.message}</p>
        <Typography className={s.date} variant={'small'}>
          <ReactTimeAgo date={dateAgo} locale={'ru-RU'} />
        </Typography>
      </DropDownItem>
    )
  })

  return notificationArray
}
