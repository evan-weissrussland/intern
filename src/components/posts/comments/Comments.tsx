import React from 'react'

import { CommentItem } from '@/components/posts/comments/comment-item/CommentItem'
import { useUpdateLikeStatusForCommentMutation } from '@/services/inctagram.posts.service'
import { CommentType } from '@/services/inctagram.public-posts.service'
import { LikeSTatusType } from '@/services/types'

type Props = {
  comments: CommentType[] | undefined
  myUserId: number | undefined
}
export const Comments = ({ comments, myUserId }: Props) => {
  /**
   * запрос на поставить/убрать лайк комментарию
   */
  const [updateLikeStatusForComment] = useUpdateLikeStatusForCommentMutation()
  /**
   * callback изменения статуса лайка комментария
   */
  const changeLikeCommentCallback = (
    postId: number,
    commentId: number,
    likeStatus: LikeSTatusType
  ) => {
    updateLikeStatusForComment({
      body: {
        likeStatus,
      },
      commentId,
      postId,
    })
  }

  return comments?.map(c => {
    return (
      <CommentItem
        changeLikeCommentCallback={changeLikeCommentCallback}
        comment={c}
        key={c.id}
        myUserId={myUserId}
      />
    )
  })
}
