import React from 'react'

import { ModalPostItem } from '@/components/userProfile/getPostsUser/ModalPostItem'
import { useGetPostsByUserNameQuery } from '@/services/inctagram.posts.service'
import { useGetPostsByUserIdQuery } from '@/services/inctagram.public-posts.service'
import { useRouter } from 'next/router'

import s from '@/components/userProfile/userProfile.module.scss'

type Props = {
  isILogined: boolean
  userName: string
}
export const GetPostsUser = ({ isILogined, userName }: Props) => {
  const router = useRouter()
  /**
   * запрос на публичный эндпоинт за постами юзера. Этот запрос нужен,
   * если я НЕ залогинен, иначе мы не сможем вытянуть посты юзера. Потомоу, что смотреть посты я
   * должен даже при отсутствии залогиненности
   */
  const { data: publicPosts, isLoading } = useGetPostsByUserIdQuery(
    {
      params: undefined,
      userId: Number(router.query.id),
    },
    { skip: !userName || isILogined }
  )
  /**
   * запрос на закрытый эндпоинт за постами юзера по имени. Если я залогинен,
   * то этот запрос выполняется
   */
  const { data: privatePosts, isLoading: isLoadingPrivate } = useGetPostsByUserNameQuery(
    {
      params: {},
      userName: userName,
    },
    { skip: !userName || !isILogined }
  )

  if (isLoading || isLoadingPrivate) {
    return <div>....LOADING.118..</div>
  }
  /**
   * формируем массив постов от публичного или непубличного запроса
   */
  const posts = privatePosts?.items || publicPosts?.items || []

  const users = posts.map(u => {
    return <ModalPostItem key={u.id} post={u} />
  })

  return <ul className={s.cardsBlock}>{users}</ul>
}
