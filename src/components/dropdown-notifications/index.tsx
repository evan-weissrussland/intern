import React, { Dispatch, ReactNode, SetStateAction, memo, useState } from 'react'

import { NotificationsArray } from '@/components/dropdown-notifications/NotificationsArray'
import { Scroll } from '@/components/scroll'
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from '@/services/inctagram.notifications.service'
import { DropDown, DropDownContent, DropDownGroup, DropDownTrigger } from '@chrizzo/ui-kit'
import clsx from 'clsx'

import s from './dropdownNotifications.module.scss'

type Props = {
  callback?: () => void
  children?: ReactNode
  setEditModalPost?: Dispatch<SetStateAction<boolean>>
}

export const DropdownNotifications = memo(({ callback, children, setEditModalPost }: Props) => {
  /**
   * открыть/закрыть модальное окно DropDown
   */
  const [open, setOpen] = useState(false)

  /**
   * запрос за уведомлениями
   */
  const { data: notifications } = useGetNotificationsQuery(
    { cursor: 0, params: {} },
    { skip: !open }
  )
  /**
   * запрос с пометкой о прочтённом уведомлении
   */
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation()

  /**
   * обработчик - пометить уведомление, как прочтённое
   */
  const marNotificationAsReadHandler = (id: number) => {
    markNotificationAsRead({ ids: [id] })
  }

  return (
    <>
      <DropDown onOpenChange={setOpen} open={open}>
        <DropDownTrigger>{children}</DropDownTrigger>
        <DropDownContent align={'end'} alignOffset={-12} className={clsx(s.content)} sideOffset={8}>
          <h3>Notifications</h3>
          <div className={s.wrapperNotiefItems}>
            <Scroll>
              <DropDownGroup className={s.group}>
                <NotificationsArray
                  marNotificationAsRead={marNotificationAsReadHandler}
                  notifications={notifications?.items ?? []}
                  setEditModalPost={setEditModalPost}
                />
              </DropDownGroup>
            </Scroll>
          </div>
        </DropDownContent>
      </DropDown>
    </>
  )
})
