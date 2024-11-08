import React from 'react'

import { ModalPostItem } from '@/components/userProfile/getPostsUser/ModalPostItem'
import { useGetPostsByUserIdQuery } from '@/services/inctagram.public-posts.service'
import { useRouter } from 'next/router'

import s from '@/components/userProfile/userProfile.module.scss'

export const GetPostsUser = () => {
  const router = useRouter()
  /**
   * запрос на сервер за постами юзера
   */
  const { data, isLoading } = useGetPostsByUserIdQuery({
    params: undefined,
    userId: Number(router.query.id),
  })

  if (isLoading) {
    return <div>....LOADING.118..</div>
  }

  const users = data?.items.map(u => {
    return <ModalPostItem key={u.id} post={u} />
  })

  return <ul className={s.cardsBlock}>{users}</ul>
}
