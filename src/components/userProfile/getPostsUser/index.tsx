import React, { useEffect, useState } from 'react'

import { ModalPostItem } from '@/components/userProfile/getPostsUser/ModalPostItem'
import { useGetPostsByUserNameQuery } from '@/services/inctagram.posts.service'
import { Post, useGetPostsByUserIdQuery } from '@/services/inctagram.public-posts.service'
import { useRouter } from 'next/router'

import s from '@/components/userProfile/userProfile.module.scss'

type Props = {
  isILogined: boolean
  userName: string
}
export const GetPostsUser = ({ isILogined, userName }: Props) => {
  const router = useRouter()
  /**
   * id последнего поста
   */
  const [endCursorpost, setEndCursorpost] = useState(0)
  /**
   * объединённый массив постов. После каждого запроса за новыми постами они добавляются к существующим,
   * а не перезатирают их
   */
  const [postsConcat, setPostsConcat] = useState<Post[]>([])
  /**
   * запрос на публичный эндпоинт за постами юзера. Этот запрос нужен,
   * если я НЕ залогинен, иначе мы не сможем вытянуть посты юзера. Потому, что смотреть посты я
   * должен даже при отсутствии залогиненности
   */
  const { data: publicPosts, isLoading } = useGetPostsByUserIdQuery({
    endCursorPostId: endCursorpost,
    params: { pageSize: 20 },
    userId: Number(router.query.id),
  })

  /**
   * формируем массив постов от публичного или непубличного запроса
   */
  const posts = publicPosts?.items || []

  /**
   * находим id последнего поста в пришедшей порции постов с сервера. Находим сам пост и находим
   * элемент-обёртку постов (тот элемент, в котором появляется скролл, если псстов много).
   * Вешаем на эту обёртку хендлер скрола. Если элемент последнего поста появляется в зоне видимости окна, то
   * сетаем id последнего поста и этим отправляется запрос за новой порцией постов
   */
  useEffect(() => {
    const endPostCursorId = postsConcat.length ? postsConcat[postsConcat.length - 1].id : undefined

    const li = document.getElementById(`post-${endPostCursorId}`)
    const ddd = document.getElementsByClassName('userProfilePage_mainCntainer__wP2P3')[0]
    const handleScroll = () => {
      if (li?.offsetTop) {
        // console.log('li=', li?.offsetTop - 61, ddd?.clientHeight + ddd?.scrollTop)
        if (endPostCursorId && ddd?.clientHeight + ddd?.scrollTop >= li?.offsetTop - 61) {
          setEndCursorpost(endPostCursorId)
        }
      }
    }

    ddd.addEventListener('scroll', handleScroll)

    return () => {
      ddd.removeEventListener('scroll', handleScroll)
    }
  }, [postsConcat])
  /**
   * сетаем массив полученных ранее постов с вновь пришедшими с сервера.
   */
  useEffect(() => {
    if (posts.length) {
      setPostsConcat(p => p.concat(posts))
    }
  }, [publicPosts])

  if (isLoading) {
    return <div>....LOADING.118..</div>
  }

  const users = postsConcat.map((u, i) => {
    return <ModalPostItem index={postsConcat.length - 1 === i ? u.id : null} key={u.id} post={u} />
  })

  return <ul className={s.cardsBlock}>{users}</ul>
}
