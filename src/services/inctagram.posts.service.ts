import { inctagramService } from '@/services/inctagram.service'
import {
  RequestCreateCommentType,
  RequestCreatePost,
  RequestUpdateLikeStatusCommentType,
  ResponseCreateCommentType,
  ResponseCreateImagesPost,
  ResponseCreatePost,
} from '@/services/types'

export const inctagramPostsService = inctagramService.injectEndpoints({
  endpoints: builder => {
    return {
      createComment: builder.mutation<ResponseCreateCommentType, RequestCreateCommentType>({
        invalidatesTags: ['getComments'],
        query: arg => {
          return {
            body: arg.body,
            method: 'POST',
            url: `/v1/posts/${arg.postId}/comments`,
          }
        },
      }),
      createImagesPost: builder.mutation<ResponseCreateImagesPost, FormData>({
        query: body => {
          return {
            body: body,
            method: 'POST',
            url: '/v1/posts/image',
          }
        },
      }),
      createPost: builder.mutation<ResponseCreatePost, RequestCreatePost>({
        invalidatesTags: ['getPostsByUserId', 'getFollowing'],
        query: body => {
          return {
            body,
            method: 'POST',
            url: '/v1/posts',
          }
        },
      }),
      deletePost: builder.mutation<void, number>({
        invalidatesTags: ['getPostsByUserId'],
        query: postId => {
          return {
            method: 'DELETE',
            url: `/v1/posts/${postId}`,
          }
        },
      }),
      updateLikeStatusForComment: builder.mutation<void, RequestUpdateLikeStatusCommentType>({
        invalidatesTags: ['getComments'],
        query: arg => {
          return {
            body: arg.body,
            method: 'PUT',
            url: `/v1/posts/${arg.postId}/comments/${arg.commentId}/like-status`,
          }
        },
      }),
    }
  },
})

export const {
  useCreateCommentMutation,
  useCreateImagesPostMutation,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdateLikeStatusForCommentMutation,
} = inctagramPostsService
