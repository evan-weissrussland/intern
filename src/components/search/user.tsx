import React, { useMemo } from 'react'

import { UsersType } from '@/components/modalFollowers/types'
import { Typography } from '@chrizzo/ui-kit'
import Image from 'next/image'
import { useRouter } from 'next/router'

import s from '@/components/search/search.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  items: UsersType[] | undefined
}
export const User = ({ items = [] }: Props) => {
  /**
   * хук навигации
   */
  const router = useRouter()
  /**
   * Переход на страницу юзера
   * @param user - id юзера
   */
  const navigateToProfileUserHandler = (user: UsersType) => {
    const usersListFromLocalStorage = localStorage.getItem('searchedProfileUsersList')

    if (usersListFromLocalStorage) {
      const parsedUsersList: UsersType[] = JSON.parse(usersListFromLocalStorage)
      const newUsersList = parsedUsersList.find(u => u.id === user.id)

      if (!newUsersList) {
        parsedUsersList.unshift(user)

        localStorage.setItem('searchedProfileUsersList', JSON.stringify(parsedUsersList))
      }
    } else {
      localStorage.setItem('searchedProfileUsersList', JSON.stringify([user]))
    }
    void router.push(`/profile/${user.id}`)
  }

  return useMemo(() => {
    return items?.map(f => {
      return (
        <li
          className={s.li}
          key={f.id}
          onClick={() => {
            navigateToProfileUserHandler(f)
          }}
        >
          <Image
            alt={'small-avatar'}
            className={s.image}
            height={48}
            src={f.avatars[0]?.url ?? defaultAva}
            width={48}
          />
          <div>
            <div className={s.userName}>
              <Typography variant={'regular16'}>{f.userName}</Typography>
            </div>
            <div className={s.firstLastNamesBlock}>
              <Typography variant={'regular14'}>
                {f.firstName} {f.lastName}
              </Typography>
            </div>
          </div>
        </li>
      )
    })
  }, [items])
}
