import { inctagramService } from '@/services/inctagram.service'
import { RequestCreatePost, ResponseCreateImagesPost, ResponseCreatePost } from '@/services/types'

export const inctagramPostsService = inctagramService.injectEndpoints({
  endpoints: builder => {
    return {
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
    }
  },
})

export const { useCreateImagesPostMutation, useCreatePostMutation, useDeletePostMutation } =
  inctagramPostsService
