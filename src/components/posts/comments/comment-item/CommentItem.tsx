import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import { Herz, LikedHerz } from '@/assets/icons'
import { CommentType } from '@/services/inctagram.public-posts.service'
import { Button, Typography } from '@chrizzo/ui-kit'
import { useRouter } from 'next/router'

import s from './commentItem.module.scss'

import defaultAva from '../../../../../public/defaultAva.jpg'

type Props = {
  comment: CommentType
}
export const CommentItem = ({ comment }: Props) => {
  const router = useRouter()
  const userId = Number(router.query.id)
  /**
   * дата создания комментария
   */
  const dateAgo = new Date(comment.createdAt)

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
          {userId !== comment.from.id && (
            <button type={'button'}>{comment.isLiked ? <LikedHerz /> : <Herz />}</button>
          )}
        </div>
      </div>
    </li>
  )
}
