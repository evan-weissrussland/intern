import { inctagramService } from '@/services/inctagram.service'
import {
  RequestAnswersForComment,
  RequestCreateCommentType,
  RequestCreatePost,
  RequestToPostsByUserName,
  RequestToUsersWhoLikedAnswerCommentPost,
  RequestToUsersWhoLikedCommentPost,
  RequestToUsersWhoLikedPost,
  RequestUpdateLikeStatusAnswerCommentType,
  RequestUpdateLikeStatusCommentType,
  RequestUpdateLikeStatusPostType,
  RequestUpdatePostType,
  ResponseAnswersForComment,
  ResponseCreateCommentType,
  ResponseCreateImagesPost,
  ResponseCreatePost,
  ResponsePostsByUserName,
  ResponseUsersWhoLikedPostOrCommentOrAnswerComment,
} from '@/services/types'

const mockDataGetAnswersComment = {
  items: [
    {
      commentId: 111,
      content:
        'dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J',
      createdAt: '2024-10-25T17:28:49.827Z',
      from: {
        avatars: [{ createdAt: '', fileSize: 120, height: 150, uploadId: '', url: '', width: 150 }],
        id: 1819,
        username: 'Derftyu',
      },
      id: 1234,
      isLiked: false,
      likeCount: 12345,
    },
    {
      commentId: 100,
      content: 'djf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J',
      createdAt: '2024-10-25T17:28:49.827Z',
      from: {
        avatars: [{ createdAt: '', fileSize: 120, height: 150, uploadId: '', url: '', width: 150 }],
        id: 1820,
        username: 'Reta',
      },
      id: 1000,
      isLiked: true,
      likeCount: 0,
    },
  ],
  notReadCount: 100,
  pageSize: 12,
  totalCount: 90,
}

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
      getAnswersForComment: builder.query<ResponseAnswersForComment, RequestAnswersForComment>({
        providesTags: ['getAnswersComment'],
        query: args => {
          return {
            params: args.params,
            url: `/v1/posts/${args.postId}/comments/${args.commentId}/answers`,
          }
        },
      }),
      // getAnswersForComment: builder.query<ResponseAnswersForComment, RequestAnswersForComment>({
      //   async queryFn() {
      //     console.log(1)
      //
      //     return { data: mockDataGetAnswersComment }
      //   },
      // }),
      getPostsByUserName: builder.query<ResponsePostsByUserName, RequestToPostsByUserName>({
        providesTags: ['getPostsByUserId'],
        query: args => {
          return {
            params: args.params,
            url: `/v1/posts/${args.userName}`,
          }
        },
      }),
      getUsersWhoLikedAnswerCommentPost: builder.query<
        ResponseUsersWhoLikedPostOrCommentOrAnswerComment,
        RequestToUsersWhoLikedAnswerCommentPost
      >({
        providesTags: ['usersWhoLikedAnswerCommentPost', 'getAnswersComment'],
        query: args => {
          return {
            params: args.params,
            url: `/v1/posts/${args.postId}/comments/${args?.commentId}/answers/${args.answerId}/likes`,
          }
        },
      }),

      getUsersWhoLikedCommentPost: builder.query<
        ResponseUsersWhoLikedPostOrCommentOrAnswerComment,
        RequestToUsersWhoLikedCommentPost
      >({
        providesTags: ['usersWhoLikedCommentPost', 'getComments'],
        query: args => {
          return {
            params: args.params,
            url: `/v1/posts/${args.postId}/comments/${args?.commentId}/likes`,
          }
        },
      }),

      getUsersWhoLikedPost: builder.query<
        ResponseUsersWhoLikedPostOrCommentOrAnswerComment,
        RequestToUsersWhoLikedPost
      >({
        providesTags: ['usersWhoLikedPost', 'getPostsByUserId'],
        query: args => {
          return {
            params: args.params,
            url: `/v1/posts/${args.postId}/likes`,
          }
        },
      }),

      updateLikeStatusForAnswerComment: builder.mutation<
        void,
        RequestUpdateLikeStatusAnswerCommentType
      >({
        invalidatesTags: ['getAnswersComment'],
        query: arg => {
          return {
            body: arg.body,
            method: 'PUT',
            url: `/v1/posts/${arg.postId}/comments/${arg.commentId}/answers/${arg.answerId}/like-status`,
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
        invalidatesTags: ['getPostsByUserId', 'getHomePosts'],
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
  useGetPostsByUserNameQuery,
  useGetUsersWhoLikedAnswerCommentPostQuery,
  useGetUsersWhoLikedCommentPostQuery,
  useGetUsersWhoLikedPostQuery,
  useLazyGetAnswersForCommentQuery,
  useUpdateLikeStatusForAnswerCommentMutation,
  useUpdateLikeStatusForCommentMutation,
  useUpdateLikeStatusForPostMutation,
  useUpdatePostMutation,
} = inctagramPostsService
