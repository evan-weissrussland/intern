import { authActions } from '@/services/auth.api'
import { inctagramService } from '@/services/inctagram.service'
import { inctagramSessionsService } from '@/services/inctagram.sessions.service'
import { ResponseAuthMe } from '@/services/types'

export const inctagramAuthService = inctagramService.injectEndpoints({
  endpoints: builder => {
    return {
      authMe: builder.query<ResponseAuthMe, void>({
        providesTags: ['login'],
        query: () => {
          return { url: '/v1/auth/me' }
        },
      }),
      forgotPass: builder.mutation<any, any>({
        query: body => {
          return {
            body,
            method: 'POST',
            url: '/v1/auth/password-recovery',
          }
        },
      }),
      login: builder.mutation<any, any>({
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          const res = await queryFulfilled

          /**
           * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
           * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
           * эту проверку можно было бы не делать).
           */
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', res.data.accessToken)
          }
          dispatch(inctagramAuthService.util.invalidateTags(['login']))
        },
        query: body => {
          return {
            body,
            method: 'POST',
            url: '/v1/auth/login',
          }
        },
      }),

      loginWithGithub: builder.query<void, string>({
        query: redirect_url => {
          return { url: `/v1/auth/github/login?redirect_url=${redirect_url}` }
        },
      }),
      loginWithGoogle: builder.mutation<{ accessToken: string; email: string }, string>({
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          const res = await queryFulfilled

          /**
           * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
           * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
           * эту проверку можно было бы не делать).
           */
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', res.data.accessToken)
          }

          dispatch(inctagramAuthService.util.invalidateTags(['login']))
        },
        query: code => {
          return {
            body: { code },
            method: 'POST',
            url: '/v1/auth/google/login',
          }
        },
      }),
      logout: builder.mutation<void, void>({
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          await dispatch(inctagramSessionsService.endpoints.deleteAllSessions.initiate())
          /**
           * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
           * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
           * эту проверку можно было бы не делать).
           */
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
          }
          dispatch(inctagramAuthService.util.invalidateTags(['login']))
          dispatch(
            authActions.setMyEmail({
              authData: {
                email: null,
                isBlocked: false,
                userId: null,
                userName: null,
              },
            })
          )
          dispatch(inctagramAuthService.util.resetApiState())
        },
        query: () => {
          return {
            method: 'POST',
            url: '/v1/auth/logout',
          }
        },
      }),
    }
  },
})

export const {
  useAuthMeQuery,
  useForgotPassMutation,
  useLazyLoginWithGithubQuery,
  useLoginMutation,
  useLoginWithGoogleMutation,
  useLogoutMutation,
} = inctagramAuthService
