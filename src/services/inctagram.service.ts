import { baseQueryWithReauth } from '@/services/inctagram.fetch-base-query'
import { Action, PayloadAction } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

import { AppState } from '../../store'

function isHydrateAction(action: Action): action is PayloadAction<AppState> {
  return action.type === HYDRATE
}

export const inctagramService = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({}),
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      return action.payload[reducerPath]
    }
  },
  reducerPath: 'inctagramService',
  tagTypes: [
    'currentSubscrioption',
    'login',
    'getFollowing',
    'getMyProfile',
    'getPostsByUserId',
    'getSessions',
    'getComments',
    'usersWhoLikedPost',
    'getNotifications',
    'getAnswersComment',
    'usersWhoLikedCommentPost',
    'usersWhoLikedAnswerCommentPost',
    'getHomePosts',
  ],
})
