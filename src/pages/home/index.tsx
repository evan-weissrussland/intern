import React, { useEffect, useState } from 'react'

import { GetLayout, HeadMeta, PageWrapper } from '@/components'
import { PostItem } from '@/components/homePosts/PostItem'
import { Scroll } from '@/components/scroll'
import { useGetHomePostsQuery } from '@/services/inctagram.home.service'
import {
  useCreateCommentMutation,
  useUpdateLikeStatusForPostMutation,
} from '@/services/inctagram.posts.service'
import { Post } from '@/services/inctagram.public-posts.service'
import { useRouter } from 'next/router'

import s from '@/components/homePosts/home.module.scss'

export function Home() {
  const router = useRouter()

  /**
   * id последнего поста
   */
  const [endCursorpost, setEndCursorpost] = useState(0)
  /**
   * объединённый массив постов. После каждого запроса за новой орцией постов они добавляются к существующим,
   * а не перезатирают их
   */
  const [postsConcat, setPostsConcat] = useState<Post[]>([])
  /**
   * запрос за постами
   */
  const { data: posts } = useGetHomePostsQuery(
    {
      params: {
        endCursorPostId: endCursorpost,
      },
    },
    { skip: router.pathname !== '/home' }
  )

  /**
   * Запрос на сервер: Поставить/снять свой лайк посту
   */
  const [updateLikeStatusForPost] = useUpdateLikeStatusForPostMutation()

  /**
   * формируем массив постов от публичного или непубличного запроса
   */
  const postsArray = posts?.items || []

  /**
   * запрос на сервер: Создание комментария
   */
  const [createComment] = useCreateCommentMutation()

  /**
   * массив постов для рендера
   */
  const postsList = postsConcat?.map((post, i) => {
    return (
      <PostItem
        createComment={createComment}
        index={postsConcat.length - 1 === i ? post.id : null}
        key={post.id}
        post={post}
        updateLikeStatusForPost={updateLikeStatusForPost}
      />
    )
  })

  /**
   * находим id последнего поста в пришедшей порции постов с сервера. Находим сам пост и находим
   * элемент-обёртку постов (тот элемент, в котором появляется скролл, если псстов много).
   * Вешаем на эту обёртку хендлер скрола. Если элемент последнего поста появляется в зоне видимости окна, то
   * сетаем id последнего поста и этим отправляется запрос за новой порцией постов
   */
  useEffect(() => {
    const endPostCursorId = postsConcat.length ? postsConcat[postsConcat.length - 1].id : undefined

    const divCard = document.getElementById(`postHome-${endPostCursorId}`)
    const pageWrapper = document.getElementsByClassName('scroll_viewport__CiEuz')[0]

    const handleScroll = () => {
      if (divCard?.offsetTop) {
        // console.log(
        //   'divCard=',
        //   divCard?.offsetTop - 61,
        //   pageWrapper?.clientHeight + pageWrapper?.scrollTop
        // )
        if (
          endPostCursorId &&
          pageWrapper?.clientHeight + pageWrapper?.scrollTop >= divCard?.offsetTop - 61
        ) {
          setEndCursorpost(endPostCursorId)
        }
      }
    }

    pageWrapper.addEventListener('scroll', handleScroll)

    return () => {
      pageWrapper.removeEventListener('scroll', handleScroll)
    }
  }, [postsConcat])
  /**
   * сетаем массив полученных ранее постов с вновь пришедшими с сервера, кроме первого поста в каждой
   * новой порции, т.к. этот пост равен последнему посту в предыдущей порции.
   */
  useEffect(() => {
    if (postsArray.length) {
      setPostsConcat(p => p.concat(postsArray.filter(p => p.id !== endCursorpost)))
    }
  }, [posts])

  return (
    <PageWrapper className={s.padding}>
      <HeadMeta title={'Inctagram'} />
      <Scroll height={'calc(100vh - 109px)'}>
        <div className={s.ul}>{postsList}</div>
      </Scroll>
    </PageWrapper>
  )
}

Home.getLayout = GetLayout
export default Home
