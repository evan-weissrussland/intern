import React from 'react'
import { useForm } from 'react-hook-form'
import ReactTimeAgo from 'react-time-ago'

import { Bookmark, DirectMessage, Herz, LikedHerz, Message } from '@/assets/icons'
import { DropdownFollowPost } from '@/components/dropdown-follow-post'
import { ModalLikes } from '@/components/modalLikes'
import { CarouselImagesPost } from '@/components/posts/CarouselImagesPost'
import {
  CommentValue,
  createCommentSchema,
} from '@/components/posts/comments/create-comment-schema'
import { CreateCommentMutation, UpdateLikeStatusForPost } from '@/services/inctagram.posts.service'
import { Post } from '@/services/types'
import { Button, Card, TextField, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'

import s from '@/components/homePosts/home.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  createComment: CreateCommentMutation
  post: Post
  updateLikeStatusForPost: UpdateLikeStatusForPost
}
export const PostItem = ({ createComment, post, updateLikeStatusForPost }: Props) => {
  /**
   * дата создания поста
   */
  const dateAgo = new Date(post.createdAt)
  /**
   * Переменные для обработки форм из react-hook-form
   */
  const { handleSubmit, register, reset } = useForm<CommentValue>({
    resolver: zodResolver(createCommentSchema),
  })
  /**
   * обработчик отправки комментария
   */
  const addCommentHandler = (data: CommentValue) => {
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
    <Card className={s.card} variant={'card'}>
      <div className={s.editLineBlock}>
        <div className={s.avaUserNameBlock}>
          <img alt={'ava'} height={36} src={post.avatarOwner ?? defaultAva.src} width={36} />
          <Typography variant={'h3'}>{post.userName}</Typography>
          <span className={s.dot}></span>
          <Typography className={s.date} variant={'small'}>
            <ReactTimeAgo date={dateAgo} />
          </Typography>
        </div>
        <DropdownFollowPost callback={() => {}} ownerPostUserName={post.userName} />
      </div>
      <CarouselImagesPost className={s.carouselCss} images={post.images} />
      <div className={s.iconsBlock}>
        <div className={s.iconsHerzAndDirect}>
          <button className={s.button} onClick={updateLikeStatusForPostHandler} type={'button'}>
            {post.isLiked ? <LikedHerz height={24} width={24} /> : <Herz height={24} width={24} />}
          </button>
          <button className={s.button} type={'button'}>
            <Message />
          </button>
          <button className={s.button} type={'button'}>
            <DirectMessage />
          </button>
        </div>
        <button className={s.button} type={'button'}>
          <Bookmark />
        </button>
      </div>
      <div className={s.commentWr}>
        <img alt={'ava'} height={36} src={post.avatarOwner ?? defaultAva.src} width={36} />
        <div className={s.commentBlock}>
          <div className={s.descrComment}>
            <Typography as={'span'} variant={'regular14'}>
              <Typography as={'span'} variant={'regularBold14'}>
                {post.userName}{' '}
              </Typography>
              {post.description
                ? post.description
                : `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, assumenda at beatae
                  consequatur deleniti distinctio dolores earum enim facilis itaque laborum minus, obcaecati quaerat
                   ratione repellendus reprehenderit saepe sed, sunt!`}
            </Typography>
          </div>
        </div>
      </div>
      <ModalLikes postId={post.id} title={'Likes'} xType={'post'}>
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
      </ModalLikes>
      <Typography className={s.viewAllComments} variant={'regularBold14'}>
        View All Comments ()
      </Typography>
      <>
        <form className={s.form} onSubmit={handleSubmit(addCommentHandler)}>
          <TextField
            className={s.input}
            {...register('comment')}
            placeholder={'Add a comment...'}
          />
          <Button className={s.publishButton} type={'submit'} variant={'text'}>
            Publish
          </Button>
        </form>
      </>
    </Card>
  )
}
