import { inctagramService } from '@/services/inctagram.service'

const mockDataGetProfile = {
  items: [
    {
      answerCount: 100,
      content:
        'dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J',
      createdAt: '2024-10-25T17:28:49.827Z',
      from: {
        avatars: [{}],
        id: 1819,
        username: 'Derftyu',
      },
      id: 1234,
      isLiked: false,
      likeCount: 12345,
      postId: 111,
    },
    {
      answerCount: 100,
      content:
        'dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J',
      createdAt: '2024-10-25T17:28:49.827Z',
      from: {
        avatars: [{}],
        id: 819,
        username: 'Derftyu',
      },
      id: 134,
      isLiked: true,
      likeCount: 0,
      postId: 111,
    },
    {
      answerCount: 100,
      content:
        'dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J dvjjd wjefjwefj wej fowjefj  wefjwejf k wefk kew k -wefwe-fk k -wef kok wefk kK EWF J0JEQWFI JEFJ J',
      createdAt: '2024-10-25T17:28:49.827Z',
      from: {
        avatars: [{}],
        id: 819,
        username: 'Derftyu',
      },
      id: 134,
      isLiked: true,
      likeCount: 0,
      postId: 111,
    },
  ],
  pageSize: 12,
  totalCount: 90,
}

export const inctagramPublicPostsService = inctagramService.injectEndpoints({
  endpoints: builder => {
    return {
      getAllPosts: builder.query<ResponseAllPosts, GetAllPostsType>({
        query: args => {
          return { params: args.params, url: `/v1/public-posts/all/${args.endCursorPostId}` }
        },
      }),
      getCommentsForPost: builder.query<ResponseCommentsForPost, RequestByComments>({
        providesTags: ['getComments'],
        query: args => {
          return { params: args.params, url: `/v1/public-posts/${args.postId}/comments` }
        },
        // getCommentsForPost: builder.query<any, RequestByComments>({
        //   async queryFn() {
        //     return { data: mockDataGetProfile }
        //   },
      }),
      getPostsByUserId: builder.query<ResponsePostsByUsedId, RequestToPostsByUserId>({
        providesTags: ['getPostsByUserId'],
        query: args => {
          return {
            params: args.params,
            url: `v1/public-posts/user/${args.userId}/${args.endCursorPostId}`,
          }
        },
      }),
    }
  },
})

export const { useGetAllPostsQuery, useGetCommentsForPostQuery, useGetPostsByUserIdQuery } =
  inctagramPublicPostsService

type RequestByComments = {
  params:
    | {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDirection?: string
      }
    | undefined
  postId: number
}

export type CommentType = {
  answerCount: number
  content: string
  createdAt: string
  from: {
    avatars: {
      createdAt: string
      fileSize: number
      height: number
      url: string
      width: number
    }[]
    id: number
    username: string
  }
  id: number
  isLiked: boolean
  likeCount: number
  postId: number
}

type ResponseCommentsForPost = {
  items: CommentType[]
  pageSize: number
  totalCount: number
}

type GetAllPostsType = {
  endCursorPostId?: number
  params?: { pageSize?: number; sortBy?: string; sortDirection?: string }
}
export type ImagesPost = {
  createdAt: string
  fileSize: number
  height: number
  uploadId: string
  url: string
  width: number
}
export type Post = {
  avatarOwner: string
  avatarWhoLikes: string[]
  createdAt: string
  description: string
  id: number
  images: ImagesPost[]
  isLiked: boolean
  likesCount: number
  location: string
  owner: {
    firstName: string
    lastName: string
  }
  ownerId: number
  updatedAt: string
  userName: string
}
export type ResponseAllPosts = {
  items: Post[]
  pageSize: number
  totalCount: number
  totalUsers: number
}
type ResponsePostsByUsedId = {
  items: Post[]
  pageSize: number
  totalCount: number
  totalUsers: number
}
type RequestToPostsByUserId = {
  endCursorPostId?: number
  params:
    | {
        pageSize?: number
        sortBy?: string
        sortDirection?: string
      }
    | undefined
  userId: number
}
