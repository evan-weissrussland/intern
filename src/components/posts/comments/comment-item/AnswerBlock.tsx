import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import { Herz, LikedHerz } from '@/assets/icons'
import { LikeSTatusType, ResponseAnswersForComment } from '@/services/types'
import { Typography } from '@chrizzo/ui-kit'
import clsx from 'clsx'

import s from '@/components/posts/comments/comment-item/commentItem.module.scss'

import defaultAva from '../../../../../public/defaultAva.jpg'

type Props = {
  answersForComment: ResponseAnswersForComment | undefined
  changeLikeAnswerCommentCallback: (
    answerId: number,
    postId: number,
    commentId: number,
    likeStatus: LikeSTatusType
  ) => void
  isFetching: boolean
  myUserId: number | undefined
  postId: number
}
export const AnswerBlock = ({
  answersForComment,
  changeLikeAnswerCommentCallback,
  isFetching,
  myUserId,
  postId,
}: Props) => {
  /**
   * формируем массив ответов на комментарий
   */
  const answersList = answersForComment?.items?.map((a, _, array) => {
    /**
     * дата создания ответа на комментарий
     */
    const dateAgo = new Date(a.createdAt)
    /**
     * обработчик: поставить лайк ответу на комментарий поста
     */
    const changeLikeAnswerCommentHandler = () => {
      changeLikeAnswerCommentCallback(a.id, postId, a.commentId, a.isLiked ? 'NONE' : 'LIKE')
    }

    return (
      <>
        <li className={clsx(s.commentWr, s.answerItem)} key={a.id}>
          <img alt={'ava'} height={36} src={a.from?.avatars[1]?.url ?? defaultAva.src} width={36} />
          <div className={s.commentBlock}>
            <div className={s.descrComment}>
              <Typography as={'span'} variant={'regular14'}>
                <Typography as={'span'} variant={'regularBold14'}>
                  {a.from.username}{' '}
                </Typography>
                {a.content}
              </Typography>
              <div className={s.statisticsData}>
                <Typography className={s.date} variant={'small'}>
                  <ReactTimeAgo date={dateAgo} />
                </Typography>

                {!!a.likeCount && (
                  <Typography className={s.date} variant={'smallSemiBold'}>
                    Like: {a.likeCount}
                  </Typography>
                )}
              </div>
            </div>
            <div className={s.buttonLike}>
              {myUserId && myUserId !== a.from.id && (
                <button onClick={changeLikeAnswerCommentHandler} type={'button'}>
                  {a.isLiked ? <LikedHerz /> : <Herz />}
                </button>
              )}
            </div>
          </div>
        </li>
      </>
    )
  })

  if (isFetching) {
    return <>!!!!LOADING!!!!</>
  }

  return <ul>{answersList}</ul>
}
