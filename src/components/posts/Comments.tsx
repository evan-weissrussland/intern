import React from 'react'

import { CommentItem } from '@/components/posts/CommentItem'
import { CommentType } from '@/services/inctagram.public-posts.service'

type Props = {
  comments: CommentType[] | undefined
}
export const Comments = ({ comments }: Props) => {
  return comments?.map(c => {
    return <CommentItem comment={c} key={c.id} />
  })
}
