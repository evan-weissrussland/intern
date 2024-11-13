import React, { Dispatch, ReactNode, SetStateAction, memo, useCallback, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'

import { Scroll } from '@/components/scroll'
import {
  DropDown,
  DropDownContent,
  DropDownGroup,
  DropDownItem,
  DropDownTrigger,
  Typography,
} from '@chrizzo/ui-kit'
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
   * обработчик навигации + закрытие модального окна dropDown
   */
  const getToEditPostHandler = useCallback(() => {
    if (setEditModalPost) {
      setEditModalPost(true)
    }
  }, [])

  /**
   * обработчик навигации + закрытие модального окна dropDown
   */
  const showModalConfirmDeletePostHandler = useCallback(() => {
    if (callback) {
      setOpen(false)
      callback()
    }
  }, [])
  /**
   * дата создания комментария
   */
  const dateAgo = new Date(new Date().toISOString())

  return (
    <>
      <DropDown onOpenChange={setOpen} open={open}>
        <DropDownTrigger>{children}</DropDownTrigger>
        <DropDownContent align={'end'} alignOffset={-12} className={clsx(s.content)} sideOffset={8}>
          <h3>Notifications</h3>
          <div className={s.wrapperNotiefItems}>
            <Scroll>
              <DropDownGroup className={s.group}>
                <DropDownItem className={s.item} onclick={getToEditPostHandler}>
                  <div>
                    <Typography as={'span'} variant={'regularBold14'}>
                      Новое уведомление!
                    </Typography>{' '}
                    <Typography as={'span'} className={s.titleNewNotief} variant={'small'}>
                      Новое
                    </Typography>
                  </div>
                  <p className={s.notiefMessage}>Следующий платеж у вас спишется через 1 день</p>
                  <Typography className={s.date} variant={'small'}>
                    <ReactTimeAgo date={dateAgo} locale={'ru-RU'} />
                  </Typography>
                </DropDownItem>
              </DropDownGroup>
            </Scroll>
          </div>
        </DropDownContent>
      </DropDown>
    </>
  )
})
