import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import { Herz, LikedHerz } from '@/assets/icons'
import { CommentType } from '@/services/inctagram.public-posts.service'
import { LikeSTatusType } from '@/services/types'
import { Typography } from '@chrizzo/ui-kit'

import s from './commentItem.module.scss'

import defaultAva from '../../../../../public/defaultAva.jpg'

type Props = {
  changeLikeCommentCallback: (postId: number, commentId: number, likeStatus: LikeSTatusType) => void
  comment: CommentType
  myUserId: number | undefined
}
export const CommentItem = ({ changeLikeCommentCallback, comment, myUserId }: Props) => {
  /**
   * дата создания комментария
   */
  const dateAgo = new Date(comment.createdAt)

  /**
   * поставить/убрать лайк комментарию
   */
  const changeLikeCommentHandler = () => {
    changeLikeCommentCallback(comment.postId, comment.id, comment.isLiked ? 'NONE' : 'LIKE')
  }

  return (
    <li className={s.commentWr}>
      <img
        alt={'ava'}
        height={36}
        src={comment.from?.avatars[1]?.url ?? defaultAva.src}
        width={36}
      />
      <div className={s.commentBlock}>
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
            <Typography className={s.date} variant={'smallSemiBold'}>
              Answer
            </Typography>
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
  )
}
