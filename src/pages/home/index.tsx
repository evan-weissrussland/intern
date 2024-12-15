import React from 'react'
import { useForm } from 'react-hook-form'
import ReactTimeAgo from 'react-time-ago'

import { Bookmark, DirectMessage, Herz, LikedHerz, Message } from '@/assets/icons'
import { GetLayout, HeadMeta, PageWrapper } from '@/components'
import { DropdownFollowPost } from '@/components/dropdown-follow-post'
import { ModalLikes } from '@/components/modalLikes'
import { CarouselImagesPost } from '@/components/posts/CarouselImagesPost'
import {
  CommentValue,
  createCommentSchema,
} from '@/components/posts/comments/create-comment-schema'
import { useGetHomePostsQuery } from '@/services/inctagram.home.service'
import {
  useCreateCommentMutation,
  useUpdateLikeStatusForPostMutation,
} from '@/services/inctagram.posts.service'
import { Button, Card, TextField, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRouter } from 'next/router'

import s from '@/pages/home/home.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

export function Home() {
  const router = useRouter()

  const { data: posts, isFetching } = useGetHomePostsQuery(
    {},
    { skip: router.pathname !== '/home' }
  )
  /**
   * дата создания поста
   */
  let dateAgo = new Date()

  if (!isFetching && posts?.items[4].createdAt) {
    dateAgo = new Date(posts.items[4].createdAt)
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
      body: { likeStatus: posts?.items[4].isLiked ? 'NONE' : 'LIKE' },
      postId: posts?.items[4].id ?? 0,
    })
  }
  /**
   * css для расстояния между аватарками юзеров поставивших лайк и счётчиком лайков
   */

  const likesCount = posts?.items[4].likesCount ?? 0

  const likeCountStyle = likesCount < 4 ? s['l' + posts?.items[4].likesCount] : s['l3']

  /**
   * массив из первых трёх юзеров, поставивших лайк посту
   */
  const avatarWhoLikedPost = posts?.items[4].avatarWhoLikes.slice(0, 3).map((ava, i) => {
    return (
      <span className={s.avaSmall} key={i}>
        <img alt={'ava'} src={ava ? ava : defaultAva.src} />
      </span>
    )
  })
  /**
   * запрос на сервер: Создание комментария
   */
  const [createComment] = useCreateCommentMutation()
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
   * обработчик отправки комментария
   */
  const addCommentHandler = (data: CommentValue) => {
    createComment({
      body: {
        content: data.comment,
      },
      postId: posts?.items[4].id ? posts?.items[4].id : 0,
    })
      .unwrap()
      .then(() => {
        reset()
      })
  }

  return (
    <PageWrapper className={s.padding}>
      <HeadMeta title={'Inctagram'} />
      <Card className={s.card} variant={'card'}>
        <div className={s.editLineBlock}>
          <div className={s.avaUserNameBlock}>
            <img
              alt={'ava'}
              height={36}
              src={posts?.items[4]?.avatarOwner ?? defaultAva.src}
              width={36}
            />
            <Typography variant={'h3'}>{posts?.items[4]?.userName}</Typography>
            <span className={s.dot}></span>
            {!isFetching && (
              <Typography className={s.date} variant={'small'}>
                <ReactTimeAgo date={dateAgo} />
              </Typography>
            )}
          </div>
          {!isFetching && posts?.items.length && (
            <DropdownFollowPost callback={() => {}} ownerPostUserName={posts.items[4].userName} />
          )}
        </div>
        <CarouselImagesPost className={s.carouselCss} images={posts?.items[4].images} />
        <div className={s.iconsBlock}>
          <div className={s.iconsHerzAndDirect}>
            <button className={s.button} onClick={updateLikeStatusForPostHandler} type={'button'}>
              {posts?.items[4].isLiked ? (
                <LikedHerz height={24} width={24} />
              ) : (
                <Herz height={24} width={24} />
              )}
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
          <img
            alt={'ava'}
            height={36}
            src={posts?.items[4].avatarOwner ?? defaultAva.src}
            width={36}
          />
          <div className={s.commentBlock}>
            <div className={s.descrComment}>
              <Typography as={'span'} variant={'regular14'}>
                <Typography as={'span'} variant={'regularBold14'}>
                  {posts?.items[4].userName}{' '}
                </Typography>
                {!posts?.items[4].description &&
                  `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, assumenda at beatae
                  consequatur deleniti distinctio dolores earum enim facilis itaque laborum minus, obcaecati quaerat
                   ratione repellendus reprehenderit saepe sed, sunt!`}
              </Typography>
            </div>
          </div>
        </div>
        <ModalLikes postId={posts?.items[4].id ?? 0} title={'Likes'} xType={'post'}>
          <div className={s.likesCount}>
            <div className={clsx(s.avatarsLiked)}>{avatarWhoLikedPost}</div>
            <Typography as={'span'} className={clsx(s.span, likeCountStyle)} variant={'regular14'}>
              {posts?.items[4].likesCount}&nbsp;
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
    </PageWrapper>
  )
}

Home.getLayout = GetLayout
export default Home
