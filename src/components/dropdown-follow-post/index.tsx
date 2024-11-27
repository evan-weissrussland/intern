import React, { memo, useCallback, useState } from 'react'

import { CopyLink, FollowPost, UnfollowPost } from '@/assets/icons'
import { DropDownTriggerIcon } from '@/assets/icons/dropDownTriggerIcon'
import {
  useFollowToUserMutation,
  useUnfollowFromUserMutation,
} from '@/services/inctagram.followings.service'
import { useGetUserProfileByUserNameQuery } from '@/services/inctagram.profile.service'
import {
  DropDown,
  DropDownContent,
  DropDownGroup,
  DropDownItem,
  DropDownTrigger,
  Typography,
} from '@chrizzo/ui-kit'
import clsx from 'clsx'

import s from './dropdownFollowPost.module.scss'

type Props = {
  callback: () => void
  ownerPostUserName: string
}

export const DropdownFollowPost = memo(({ callback, ownerPostUserName }: Props) => {
  /**
   * хук RTKQ. Подписка на юзера
   */
  const [followingToUser] = useFollowToUserMutation()
  /**
   * хук RTKQ. Отписаться от юзера
   */
  const [unfollow] = useUnfollowFromUserMutation()
  /**
   * открыть/закрыть модальное окно DropDown
   */
  const [open, setOpen] = useState(false)
  /**
   * запрос на сервер за профилем юзера по имени, чтобы забрать число followers
   */
  const { data: profile } = useGetUserProfileByUserNameQuery(ownerPostUserName, { skip: !open })
  /**
   * обработчик навигации + закрытие модального окна dropDown
   */
  const getToEditPostHandler = async () => {
    if (profile && profile.isFollowing) {
      await unfollow(profile?.id)
      setOpen(false)
    }
    if (profile && !profile.isFollowing) {
      await followingToUser({ selectedUserId: profile.id })
      setOpen(false)
    }
  }
  /**
   * скопировать URL и закрыть  окно dropDown
   */
  const getCopyURLHandler = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href)
    setOpen(false)
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
                {profile?.isFollowing ? <UnfollowPost /> : <FollowPost />}
                <Typography variant={'regular14'}>
                  {profile?.isFollowing ? 'Unfollow' : 'Follow'}
                </Typography>
              </DropDownItem>
              <DropDownItem className={s.item} onclick={getCopyURLHandler}>
                <CopyLink />
                <Typography variant={'regular14'}>Copy Link</Typography>
              </DropDownItem>
            </DropDownGroup>
          </div>
        </DropDownContent>
      </DropDown>
    </>
  )
})
