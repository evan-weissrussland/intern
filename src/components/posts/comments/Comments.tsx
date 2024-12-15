import React from 'react'

import { CommentItem } from '@/components/posts/comments/comment-item/CommentItem'
import {
  useUpdateLikeStatusForAnswerCommentMutation,
  useUpdateLikeStatusForCommentMutation,
} from '@/services/inctagram.posts.service'
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
   * запрос на поставить/убрать лайк ответу на комментарий
   */
  const [updateLikeStatusForAnswerComment] = useUpdateLikeStatusForAnswerCommentMutation()
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
  /**
   * callback изменения статуса лайка ответа на комментарий
   */
  const changeLikeAnswerCommentCallback = (
    postId: number,
    commentId: number,
    answerId: number,
    likeStatus: LikeSTatusType
  ) => {
    updateLikeStatusForAnswerComment({
      answerId,
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
        changeLikeAnswerCommentCallback={changeLikeAnswerCommentCallback}
        changeLikeCommentCallback={changeLikeCommentCallback}
        comment={c}
        key={c.id}
        myUserId={myUserId}
      />
    )
  })
}
