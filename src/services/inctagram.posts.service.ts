import { inctagramService } from '@/services/inctagram.service'
import {
  RequestCreateCommentType,
  RequestCreatePost,
  RequestToUsersWhoLikedPost,
  RequestUpdateLikeStatusCommentType,
  RequestUpdateLikeStatusPostType,
  RequestUpdatePostType,
  ResponseCreateCommentType,
  ResponseCreateImagesPost,
  ResponseCreatePost,
  ResponseUsersWhoLikedPost,
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
      getUsersWhoLikedPost: builder.query<ResponseUsersWhoLikedPost, RequestToUsersWhoLikedPost>({
        providesTags: ['usersWhoLikedPost'],
        query: args => {
          return {
            params: args.params,
            url: `/v1/posts/${args.postId}/likes`,
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
      updateLikeStatusForPost: builder.mutation<void, RequestUpdateLikeStatusPostType>({
        invalidatesTags: ['getPostsByUserId'],
        query: arg => {
          return {
            body: arg.body,
            method: 'PUT',
            url: `/v1/posts/${arg.postId}/like-status`,
          }
        },
      }),
      updatePost: builder.mutation<void, RequestUpdatePostType>({
        invalidatesTags: ['getPostsByUserId'],
        query: args => {
          return {
            body: args.body,
            method: 'PUT',
            url: `/v1/posts/${args.postId}`,
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
  useGetUsersWhoLikedPostQuery,
  useUpdateLikeStatusForCommentMutation,
  useUpdateLikeStatusForPostMutation,
  useUpdatePostMutation,
} = inctagramPostsService
