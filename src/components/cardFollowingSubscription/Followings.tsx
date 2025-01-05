import { useMemo } from 'react'

import { ModalConfirm } from '@/components/modalConfirm'
import { FollowersUsersType } from '@/components/modalFollowers/types'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useUnfollowFromUserMutation } from '@/services/inctagram.followings.service'
import { Typography } from '@chrizzo/ui-kit'
import Image from 'next/image'

import s from './cardFollowingSub.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  items: FollowersUsersType[] | undefined
}
export const Followings = ({ items = [] }: Props) => {
  /**
   * кастомный хук контроля ширины окна
   */
  const windowWidth = useWindowWidth()
  /**
   * хук RTKQ. Отписаться от юзера
   */
  const [unfollow] = useUnfollowFromUserMutation()
  /**
   * коллбэк для отподписки на юзера
   * @param selectedUserId - id юзера, на которого хотим подпсаться
   * @param setFn - set-функция из модалки подтверждения отписки. Когда запрос отписки на сервер успешен,
   * то закрываем модалку подтверждения
   */
  const unfollowUser = (selectedUserId: number, setFn: any) => {
    unfollow(selectedUserId)
      .unwrap()
      .then(() => setFn(false))
  }

  /**
   * формируем массив юзеров, на которых подписан с данных с сервера
   */
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
          <div className={s.modalConfirm}>
            <ModalConfirm
              callback={unfollowUser}
              title={'Unfollow'}
              titleButtonTrigger={'Unfollow'}
              user={f}
              variantTriggerButton={'outline'}
            >
              <Typography as={'span'} className={s.questionConfirm} variant={'regular16'}>
                Do you really want to Unfollow from this user &quot;
                <Typography as={'span'} className={s.userName} variant={'h3'}>
                  {f.userName}
                </Typography>
                &quot;?
              </Typography>
            </ModalConfirm>
          </div>
        </li>
      )
    })
  }, [items])
}
