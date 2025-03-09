import { authActions } from '@/services/auth.api'
import { inctagramService } from '@/services/inctagram.service'
import { inctagramSessionsService } from '@/services/inctagram.sessions.service'
import { sockets } from '@/services/socket/socket'
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
      checkRecoveryCode: builder.mutation<any, { recoveryCode: string }>({
        query: body => {
          return {
            body,
            method: 'POST',
            url: '/v1/auth/check-recovery-code',
          }
        },
      }),
      createNewPass: builder.mutation<any, any>({
        query: body => {
          return {
            body,
            method: 'POST',
            url: '/v1/auth/new-password',
          }
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
          sockets.socketInit(res.data.accessToken)
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
          sockets.socketInit(res.data.accessToken)
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
          sockets?.closeConnection()
        },
        query: () => {
          return {
            method: 'POST',
            url: '/v1/auth/logout',
          }
        },
      }),
      registration: builder.mutation<any, any>({
        query: body => {
          return {
            body,
            method: 'POST',
            url: '/v1/auth/registration',
          }
        },
      }),
      registrationConfirmation: builder.mutation<any, { confirmationCode: string }>({
        query: body => {
          return {
            body,
            method: 'POST',
            url: '/v1/auth/registration-confirmation',
          }
        },
      }),
      registrationEmailResending: builder.mutation<any, { baseUrl: string; email: string }>({
        query: body => {
          return {
            body,
            method: 'POST',
            url: '/v1/auth/registration-email-resending',
          }
        },
      }),
    }
  },
})

export const {
  useAuthMeQuery,
  useCheckRecoveryCodeMutation,
  useCreateNewPassMutation,
  useForgotPassMutation,
  useLazyLoginWithGithubQuery,
  useLoginMutation,
  useLoginWithGoogleMutation,
  useLogoutMutation,
  useRegistrationConfirmationMutation,
  useRegistrationEmailResendingMutation,
  useRegistrationMutation,
} = inctagramAuthService
