import {
  FollowersUsersType,
  RequestForFollowersUsers,
  RequestType,
  UsersType,
} from '@/components/ModalFollowers/types'
import { inctagramService } from '@/services/inctagram.service'

export const inctagramUsersFollowingsService = inctagramService.injectEndpoints({
  endpoints: builder => {
    return {
      followToUser: builder.mutation<void, { selectedUserId: number }>({
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          await queryFulfilled

          dispatch(
            inctagramUsersFollowingsService.util.invalidateTags([
              'getFollowing',
              'usersWhoLikedPost',
            ])
          )
        },
        query: body => {
          return { body, method: 'POST', url: `/v1/users/following` }
        },
      }),
      getFollowersUsers: builder.query<RequestType<FollowersUsersType>, RequestForFollowersUsers>({
        providesTags: ['getFollowing'],
        query: args => {
          return {
            params: args.params ? args.params : undefined,
            url: `/v1/users/${args.username}/followers`,
          }
        },
      }),
      getFollowingUsers: builder.query<RequestType<FollowersUsersType>, RequestForFollowersUsers>({
        providesTags: ['getFollowing'],
        query: args => {
          return {
            params: args.params ? args.params : undefined,
            url: `/v1/users/${args.username}/following`,
          }
        },
      }),
      getProfileUsers: builder.query<RequestType<UsersType>, void>({
        query: () => {
          return { url: `/v1/users` }
        },
      }),
      unfollowFromUser: builder.mutation<void, number>({
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          await queryFulfilled

          dispatch(
            inctagramUsersFollowingsService.util.invalidateTags([
              'getFollowing',
              'usersWhoLikedPost',
            ])
          )
        },
        query: userId => {
          return { method: 'DELETE', url: `/v1/users/follower/${userId}` }
        },
      }),
    }
  },
})

export const {
  useFollowToUserMutation,
  useGetFollowersUsersQuery,
  useGetFollowingUsersQuery,
  useGetProfileUsersQuery,
  useUnfollowFromUserMutation,
} = inctagramUsersFollowingsService
