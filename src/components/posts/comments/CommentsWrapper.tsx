import React, { MutableRefObject, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Bookmark, DirectMessage, Herz } from '@/assets/icons'
import { logInSchema } from '@/components/auth/logIn/logIn-schema'
import { FormValues } from '@/components/auth/logIn/types'
import { DropdownPostEdit } from '@/components/dropdown-edit-profile'
import { DropdownFollowPost } from '@/components/dropdown-follow-post'
import { Comments } from '@/components/posts/comments/Comments'
import {
  CommentValue,
  createCommentSchema,
} from '@/components/posts/comments/create-comment-schema'
import { DateTimeFormatOptions } from '@/components/posts/types'
import { Scroll } from '@/components/scroll'
import { useAuthMeQuery } from '@/services/inctagram.auth.service'
import { useCreateCommentMutation } from '@/services/inctagram.posts.service'
import { Post, useGetCommentsForPostQuery } from '@/services/inctagram.public-posts.service'
import { Button, TextField, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

import s from './commentWrapper.module.scss'

import defaultAva from '../../../../public/defaultAva.jpg'

type Props = {
  callback: () => void
  open: boolean
  post: Post
}
export const CommentsWrapper = ({ callback, open, post }: Props) => {
  const router = useRouter()
  const userId = Number(router.query.id)

  /**
   * Переменные для обработки форм из react-hook-form
   */
  const {
    formState: {},
    handleSubmit,
    register,
    reset,
  } = useForm<CommentValue>({
    resolver: zodResolver(createCommentSchema),
  })

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
   * запрос на сервер: Создание комментария
   */
  const [createComment] = useCreateCommentMutation()

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

  /**
   * обработчик отправки комментария
   */
  const addCommentHandler = (data: CommentValue) => {
    // console.log(data)
    createComment({
      body: {
        content: data.comment,
      },
      postId: post.id,
    })
      .unwrap()
      .then(() => {
        reset()
      })
  }

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
        <div className={s.iconsBlock}>
          <div className={s.iconsHerzAndDirect}>
            <button className={s.button} type={'button'}>
              <Herz height={24} width={24} />
            </button>
            <button className={s.button} type={'button'}>
              <DirectMessage />
            </button>
          </div>
          <button className={s.button} type={'button'}>
            <Bookmark />
          </button>
        </div>
        <div>
          <div className={s.avatarsLiked}></div>
          <Typography as={'span'} variant={'regular14'}>
            {post.likesCount}{' '}
          </Typography>
          <Typography as={'span'} variant={'regularBold14'}>
            &quot;Like&quot;
          </Typography>
          <Typography className={s.date} variant={'small'}>
            {formattedDate}
          </Typography>
        </div>
      </div>
      <hr className={s.hr} />
      <form className={s.form} onSubmit={handleSubmit(addCommentHandler)}>
        <TextField className={s.input} {...register('comment')} placeholder={'Add a comment...'} />
        <Button type={'submit'} variant={'text'}>
          Publish
        </Button>
      </form>
    </div>
  )
}
