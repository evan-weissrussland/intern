import React, { useState } from 'react'
import ReactTimeAgo from 'react-time-ago'

import { Herz, LikedHerz } from '@/assets/icons'
import { AnswerBlock } from '@/components/posts/comments/comment-item/AnswerBlock'
import { useLazyGetAnswersForCommentQuery } from '@/services/inctagram.posts.service'
import { CommentType } from '@/services/inctagram.public-posts.service'
import { LikeSTatusType } from '@/services/types'
import { Typography } from '@chrizzo/ui-kit'
import clsx from 'clsx'

import s from './commentItem.module.scss'

import defaultAva from '../../../../../public/defaultAva.jpg'

type Props = {
  changeLikeAnswerCommentCallback: (
    answerId: number,
    postId: number,
    commentId: number,
    likeStatus: LikeSTatusType
  ) => void
  changeLikeCommentCallback: (postId: number, commentId: number, likeStatus: LikeSTatusType) => void
  comment: CommentType
  myUserId: number | undefined
}
export const CommentItem = ({
  changeLikeAnswerCommentCallback,
  changeLikeCommentCallback,
  comment,
  myUserId,
}: Props) => {
  /**
   * дата создания комментария
   */
  const dateAgo = new Date(comment.createdAt)
  /**
   * Открыть ответы на комментарий
   */
  const [showCommentAnswer, setShowCommentAnswer] = useState(false)
  /**
   * запрос за ответами на комментарий поста
   */
  const [getAnswersForComment, { data: answersForComment, isFetching }] =
    useLazyGetAnswersForCommentQuery()
  /**
   * поставить/убрать лайк комментарию
   */
  const changeLikeCommentHandler = () => {
    changeLikeCommentCallback(comment.postId, comment.id, comment.isLiked ? 'NONE' : 'LIKE')
  }
  /**
   * обработчик: сделать запрос за ответами на комментарий и показать их
   */
  const showCommentAnswerHandler = async () => {
    await getAnswersForComment({ commentId: comment.id, params: {}, postId: comment.postId })
    setShowCommentAnswer(true)
  }
  /**
   * обработчик: скрыть ответы на комментарий
   */
  const hideAnswersCommentHandler = () => {
    setShowCommentAnswer(false)
  }

  return (
    <>
      <li className={s.commentWr}>
        <img
          alt={'ava'}
          height={36}
          src={comment.from?.avatars[1]?.url ?? defaultAva.src}
          width={36}
        />
        <div className={clsx(s.commentBlock, showCommentAnswer && s.smallMarginBottom)}>
          <div className={s.descrComment}>
            <Typography as={'span'} variant={'regular14'}>
              <Typography as={'span'} variant={'regularBold14'}>
                {comment.from.username}{' '}
              </Typography>
              {comment.content}
            </Typography>
            <div className={s.statisticsData}>
              <Typography className={s.date} variant={'small'}>
                <ReactTimeAgo date={dateAgo} />
              </Typography>
              {!!comment.likeCount && (
                <Typography className={s.date} variant={'smallSemiBold'}>
                  Like: {comment.likeCount}
                </Typography>
              )}
              {!!comment.answerCount && (
                <Typography
                  className={s.date}
                  onClick={showCommentAnswerHandler}
                  variant={'smallSemiBold'}
                >
                  Answer
                </Typography>
              )}
            </div>
          </div>
          <div className={s.buttonLike}>
            {myUserId && myUserId !== comment.from.id && (
              <button onClick={changeLikeCommentHandler} type={'button'}>
                {comment.isLiked ? <LikedHerz /> : <Herz />}
              </button>
            )}
          </div>
        </div>
      </li>
      {showCommentAnswer && (
        <Typography
          className={clsx(s.date, s.hideAnswer)}
          onClick={hideAnswersCommentHandler}
          variant={'smallSemiBold'}
        >
          ----- Hide Answer ({answersForComment?.items?.length})
        </Typography>
      )}
      {showCommentAnswer && (
        <AnswerBlock
          answersForComment={answersForComment}
          changeLikeAnswerCommentCallback={changeLikeAnswerCommentCallback}
          isFetching={isFetching}
          myUserId={myUserId}
          postId={comment.postId}
        />
      )}
    </>
  )
}
