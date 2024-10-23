import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import { CommentType } from '@/services/inctagram.public-posts.service'
import { Typography } from '@chrizzo/ui-kit'

import s from '@/pages/posts.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  comments: CommentType[] | undefined
}
export const Comments = ({ comments }: Props) => {
  return comments?.map(c => {
    /**
     * дата создания комментария
     */
    const dateAgo = new Date(c.createdAt)

    return (
      <li className={s.commentWr} key={c.id}>
        <img alt={'ava'} height={36} src={c.from?.avatars[1]?.url ?? defaultAva} width={36} />
        <div className={s.commentBlock}>
          <Typography as={'span'} variant={'regular14'}>
            <Typography as={'span'} variant={'regularBold14'}>
              {c.from.username}{' '}
            </Typography>
            {c.content}
          </Typography>
          <Typography className={s.date} variant={'small'}>
            <ReactTimeAgo date={dateAgo} />
          </Typography>
        </div>
      </li>
    )
  })
}
