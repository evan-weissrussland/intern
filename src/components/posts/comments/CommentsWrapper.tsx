import React, { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'

import { Bookmark, DirectMessage, Herz, LikedHerz } from '@/assets/icons'
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
import {
  useCreateCommentMutation,
  useUpdateLikeStatusForPostMutation,
} from '@/services/inctagram.posts.service'
import { Post, useGetCommentsForPostQuery } from '@/services/inctagram.public-posts.service'
import { Button, TextField, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { useRouter } from 'next/router'

import s from './commentWrapper.module.scss'

import defaultAva from '../../../../public/defaultAva.jpg'

type Props = {
  callback: () => void
  open: boolean
  post: Post
  setEditModalPost: Dispatch<SetStateAction<boolean>>
}
export const CommentsWrapper = ({ callback, open, post, setEditModalPost }: Props) => {
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
  /**
   * Запрос на сервер: Поставить/снять свой лайк посту
   */
  const [updateLikeStatusForPost] = useUpdateLikeStatusForPostMutation()
  /**
   * Поставить/снять свой лайк посту
   */
  const updateLikeStatusForPostHandler = () => {
    updateLikeStatusForPost({
      body: { likeStatus: post.isLiked ? 'NONE' : 'LIKE' },
      postId: post.id,
    })
  }
  /**
   * массив из первых трёх юзеров, поставивших лайк посту
   */
  const avatarWhoLikedPost = post.avatarWhoLikes.slice(0, 3).map((ava, i) => {
    return (
      <span className={s.avaSmall} key={i}>
        <img alt={'ava'} src={ava ? ava : defaultAva.src} />
      </span>
    )
  })
  /**
   * css для расстояния между аватарками юзеров поставивших лайк и счётчиком лайков
   */
  const likeCountStyle = post.likesCount < 4 ? s['l' + post.likesCount] : s['l3']

  return (
    <div className={s.commentsWr}>
      <div className={s.editLineBlock}>
        <div className={s.avaUserNameBlock}>
          <img alt={'ava'} height={36} src={post.avatarOwner ?? defaultAva} width={36} />
          <Typography variant={'h3'}>{post.userName}</Typography>
        </div>
        {authMe?.userId && authMe?.userId === userId && (
          <DropdownPostEdit
            callback={showModalConfirmDeletePostHandler}
            setEditModalPost={setEditModalPost}
          />
        )}
        {authMe?.userId && authMe?.userId !== userId && (
          <DropdownFollowPost callback={() => {}} ownerPostUserName={post.userName} />
        )}
      </div>
      <hr className={s.hr} />
      <ul className={s.commentsUl}>
        <Scroll>
          <div className={s.commentsBlock}>
            {isFetching && <>...Loading.....</>}
            {!isFetching && <Comments comments={data?.items} myUserId={authMe?.userId} />}
          </div>
        </Scroll>
      </ul>
      <hr className={s.hr} />
      <div className={clsx(s.likesBlock, !authMe?.userId && s.public)}>
        {authMe?.userId && (
          <div className={s.iconsBlock}>
            <div className={s.iconsHerzAndDirect}>
              <button className={s.button} onClick={updateLikeStatusForPostHandler} type={'button'}>
                {post.isLiked ? (
                  <LikedHerz height={24} width={24} />
                ) : (
                  <Herz height={24} width={24} />
                )}
              </button>
              <button className={s.button} type={'button'}>
                <DirectMessage />
              </button>
            </div>
            <button className={s.button} type={'button'}>
              <Bookmark />
            </button>
          </div>
        )}
        <div className={s.likesCountDateBlock}>
          <div className={s.likesCount}>
            <div className={clsx(s.avatarsLiked)}>{avatarWhoLikedPost}</div>
            <Typography as={'span'} className={clsx(s.span, likeCountStyle)} variant={'regular14'}>
              {post.likesCount}&nbsp;
            </Typography>
            <Typography
              as={'span'}
              className={clsx(s.span, likeCountStyle)}
              variant={'regularBold14'}
            >
              &quot;Like&quot;
            </Typography>
          </div>
          <Typography className={s.date} variant={'small'}>
            {formattedDate}
          </Typography>
        </div>
      </div>
      {authMe?.userId && (
        <>
          <hr className={s.hr} />
          <form className={s.form} onSubmit={handleSubmit(addCommentHandler)}>
            <TextField
              className={s.input}
              {...register('comment')}
              placeholder={'Add a comment...'}
            />
            <Button type={'submit'} variant={'text'}>
              Publish
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
