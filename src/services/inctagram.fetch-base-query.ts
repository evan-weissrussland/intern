import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

// eslint-disable-next-line no-duplicate-imports
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
// create a new mutex
const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://inctagram.work/api',
  credentials: 'include',
  prepareHeaders: headers => {
    /**
     * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
     * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
     * эту проверку можно было бы не делать).
     */
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

export const baseQueryWithReauth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  /**
   * если делаем запрос на логин или на логин через гугл, то делаем "credentials:include",
   * тем самым у нас сохраняется рефреш-токен
   */
  const isLoginRequest =
    typeof args !== 'string' &&
    (args.url === '/v1/auth/login' || args.url === '/v1/auth/google/login')
  // let result = await baseQuery(args, api, extraOptions)
  let result = await baseQuery(
    typeof args === 'string'
      ? args
      : { ...args, credentials: isLoginRequest ? 'include' : undefined },
    api,
    extraOptions
  )

  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshResult = await baseQuery(
          {
            credentials: 'include',
            method: 'POST',
            url: '/v1/auth/update-tokens',
          },
          api,
          extraOptions
        )

        if (
          typeof refreshResult.data === 'object' &&
          refreshResult.data !== null &&
          'accessToken' in refreshResult.data &&
          refreshResult.data?.accessToken &&
          typeof refreshResult.data?.accessToken === 'string'
        ) {
          const payloadFromJWT = JSON.parse(atob(refreshResult.data?.accessToken.split('.')[1]))
          const dateExparedAccessToken = new Date(payloadFromJWT.exp * 1000).toUTCString()

          document.cookie = `access_token=${refreshResult.data.accessToken}; expires=${dateExparedAccessToken}; SameSite=None; Secure`
          /**
           * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
           * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
           * эту проверку можно было бы не делать).
           */
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', refreshResult.data.accessToken)
          }
          result = await baseQuery(args, api, extraOptions)
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
