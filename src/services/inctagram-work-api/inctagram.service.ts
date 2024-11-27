import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from './inctagram.fetch-base-query'

export const inctagramWorkApiService = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({}),
  reducerPath: 'inctagram-work-api',
  tagTypes: ['login', 'getFollowing', 'ME', 'I_AM_FOLLOWED', 'I_AM_FOLLOWING'],
})
