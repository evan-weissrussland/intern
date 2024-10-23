import React from 'react'

import { DropDownProfileEdit } from '@/components/dropdown-edit-profile'
import { Comments } from '@/components/posts/Comments'
import { DateTimeFormatOptions } from '@/components/posts/types'
import { Post, useGetCommentsForPostQuery } from '@/services/inctagram.public-posts.service'
import { Typography } from '@chrizzo/ui-kit'

import s from '@/pages/posts.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Propss = {
  callback: () => void
  open: boolean
  post: Post
}
export const CommentsWrapper = ({ callback, open, post }: Propss) => {
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
        <DropDownProfileEdit callback={showModalConfirmDeletePostHandler} />
      </div>
      <hr className={s.hr} />
      <ul className={s.commentsUl}>
        {isFetching && <>...Loading.....</>}
        {!isFetching && <Comments comments={data?.items} />}
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
