import { useMemo } from 'react'

import {
  useFollowToUserMutation,
  useUnfollowFromUserMutation,
} from '@/services/inctagram.followings.service'
import { LikesItemType } from '@/services/types'
import { Button, Typography } from '@chrizzo/ui-kit'
import Image from 'next/image'

import s from './modalLikesPost.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  items: LikesItemType[] | undefined
}
export const LikesList = ({ items = [] }: Props) => {
  /**
   * хук RTKQ. Подписка на юзера
   */
  const [followingToUser] = useFollowToUserMutation()
  /**
   * хук RTKQ. Отписаться от юзера
   */
  const [unfollow] = useUnfollowFromUserMutation()
  /**
   * коллбэк для подписки на юзера
   * @param selectedUserId - id юзера, на которого хотим подпсаться
   * @param isFollowing - подписан ли я я на юзера, поставившего лайк
   */
  const toFollowUser = async (selectedUserId: number, isFollowing: boolean) => {
    if (isFollowing) {
      await unfollow(selectedUserId).unwrap()
    } else {
      await followingToUser({ selectedUserId }).unwrap()
    }
  }

  return useMemo(() => {
    return items?.map(f => {
      return (
        <li className={s.li} key={f.id}>
          <div className={s.avaAndUserNameBlock}>
            <Image
              alt={'small-avatar'}
              className={s.image}
              height={36}
              src={f.avatars[0]?.url ?? defaultAva}
              width={36}
            />
            <Typography variant={'regular16'}> {f.userName}</Typography>
          </div>
          <div className={s.followButtonsBlock}>
            <Button
              className={s.followButton}
              onClick={() => {
                toFollowUser(f.userId, f.isFollowing)
              }}
              variant={f.isFollowing ? 'outline' : 'primary'}
            >
              {f.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
        </li>
      )
    })
  }, [items])
}
