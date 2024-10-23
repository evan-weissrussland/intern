import React, { memo, useCallback, useState } from 'react'

import { DeletePost, EditIcon } from '@/assets/icons'
import { DropDownTriggerIcon } from '@/assets/icons/dropDownTriggerIcon'
import {
  DropDown,
  DropDownContent,
  DropDownGroup,
  DropDownItem,
  DropDownTrigger,
  Typography,
} from '@chrizzo/ui-kit'
import clsx from 'clsx'

import s from './dropDownEditProfile.module.scss'

type Props = {
  callback: () => void
}

export const DropDownProfileEdit = memo(({ callback }: Props) => {
  /**
   * открыть/закрыть модальное окно DropDown
   */
  const [open, setOpen] = useState(false)
  /**
   * обработчик навигации + закрытие модального окна dropDown
   */
  const getToEditPostHandler = useCallback(() => {}, [])

  /**
   * обработчик навигации + закрытие модального окна dropDown
   */
  const showModalConfirmDeletePostHandler = useCallback(() => {
    setOpen(false)
    callback()
  }, [])

  return (
    <>
      <DropDown onOpenChange={setOpen} open={open}>
        <DropDownTrigger>
          <div className={clsx(s.trigger, s.openColor)}>
            <DropDownTriggerIcon />
          </div>
        </DropDownTrigger>
        <DropDownContent align={'end'} alignOffset={0} className={clsx(s.content)} sideOffset={0}>
          <div>
            <DropDownGroup className={s.group}>
              <DropDownItem className={s.item} onclick={getToEditPostHandler}>
                <EditIcon />
                <Typography variant={'regular14'}>Edit Post</Typography>
              </DropDownItem>
              <DropDownItem className={s.item} onclick={showModalConfirmDeletePostHandler}>
                <DeletePost />
                <Typography variant={'regular14'}>Delete Post</Typography>
              </DropDownItem>
            </DropDownGroup>
          </div>
        </DropDownContent>
      </DropDown>
    </>
  )
})
