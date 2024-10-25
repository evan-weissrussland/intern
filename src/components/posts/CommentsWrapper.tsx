import React from 'react'

import { DropdownPostEdit } from '@/components/dropdown-edit-profile'
import { DropdownFollowPost } from '@/components/dropdown-follow-post'
import { Comments } from '@/components/posts/Comments'
import { DateTimeFormatOptions } from '@/components/posts/types'
import { Scroll } from '@/components/scroll'
import { useAuthMeQuery } from '@/services/inctagram.auth.service'
import { Post, useGetCommentsForPostQuery } from '@/services/inctagram.public-posts.service'
import { Typography } from '@chrizzo/ui-kit'
import { useRouter } from 'next/router'

import s from '@/pages/posts.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  callback: () => void
  open: boolean
  post: Post
}
export const CommentsWrapper = ({ callback, open, post }: Props) => {
  const router = useRouter()
  const userId = Number(router.query.id)
  /**
   * запрос authMe
   */
  const { data: authMe } = useAuthMeQuery(undefined, { skip: !open })
  /**
   * запрос за комментариями к посту
   */
  const { data, isFetching } = useGetCommentsForPostQuery(
    {
      params: undefined,
      postId: post.id,
    },
    { skip: !open }
  )

  if (data) {
    localStorage.removeItem('postId')
  }
  /**
   * показать модалку-подтверждения удаления поста
   */
  const showModalConfirmDeletePostHandler = () => {
    callback()
  }
  /**
   * дата создания поста
   */
  const date = new Date(post.createdAt)
  const options: DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const formattedDate = date.toLocaleDateString('en-US', options)

  return (
    <div className={s.commentsWr}>
      <div className={s.editLineBlock}>
        <div className={s.avaUserNameBlock}>
          <img alt={'ava'} height={36} src={post.avatarOwner ?? defaultAva} width={36} />
          <Typography variant={'h3'}>{post.userName}</Typography>
        </div>
        {authMe?.userId && authMe?.userId === userId && (
          <DropdownPostEdit callback={showModalConfirmDeletePostHandler} />
        )}
        {authMe?.userId && authMe?.userId !== userId && <DropdownFollowPost callback={() => {}} />}
      </div>
      <hr className={s.hr} />
      <ul className={s.commentsUl}>
        <Scroll>
          <div className={s.commentsBlock}>
            {isFetching && <>...Loading.....</>}
            {!isFetching && <Comments comments={data?.items} />}
          </div>
        </Scroll>
      </ul>
      <hr className={s.hr} />
      <div className={s.likesBlock}>
        <div className={s.avatarsLiked}></div>
        <Typography as={'span'} variant={'regular14'}>
          {post.likesCount}{' '}
          <Typography as={'span'} variant={'regularBold14'}>
            &quot;Like&quot;
          </Typography>
        </Typography>
        <Typography className={s.date} variant={'small'}>
          {formattedDate}
        </Typography>
      </div>
    </div>
  )
}
