import React from 'react'

import { GetLayout, HeadMeta, PageWrapper } from '@/components'
import { PostItem } from '@/components/homePosts/PostItem'
import { Scroll } from '@/components/scroll'
import { useGetHomePostsQuery } from '@/services/inctagram.home.service'
import {
  useCreateCommentMutation,
  useUpdateLikeStatusForPostMutation,
} from '@/services/inctagram.posts.service'
import { useRouter } from 'next/router'

import s from '@/components/homePosts/home.module.scss'

export function Home() {
  const router = useRouter()

  const { data: posts } = useGetHomePostsQuery({}, { skip: router.pathname !== '/home' })

  /**
   * Запрос на сервер: Поставить/снять свой лайк посту
   */
  const [updateLikeStatusForPost] = useUpdateLikeStatusForPostMutation()

  /**
   * запрос на сервер: Создание комментария
   */
  const [createComment] = useCreateCommentMutation()

  const postsList = posts?.items.map(post => {
    return (
      <PostItem
        createComment={createComment}
        key={post.id}
        post={post}
        updateLikeStatusForPost={updateLikeStatusForPost}
      />
    )
  })

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
