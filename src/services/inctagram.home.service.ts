import { inctagramService } from '@/services/inctagram.service'
import { RequestHomePosts, ResponseHomePosts } from '@/services/types'

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

export const inctagramHomeService = inctagramService.injectEndpoints({
  endpoints: builder => {
    return {
      getHomePosts: builder.query<ResponseHomePosts, RequestHomePosts>({
        providesTags: ['getHomePosts'],
        query: args => {
          return {
            params: args.params,
            url: `/v1/home/publications-followers`,
          }
        },
      }),
      // getHomePosts: builder.query<ResponseAnswersForComment, RequestAnswersForComment>({
      //   async queryFn() {
      //     console.log(1)
      //
      //     return { data: mockDataGetAnswersComment }
      //   },
      // }),
    }
  },
})

export const { useGetHomePostsQuery } = inctagramHomeService
