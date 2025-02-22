import { PropsWithChildren, useEffect } from 'react'

import { MainComponent } from '@/components/Layout/MainComponent'
import { Header } from '@/components/header'
import { authActions } from '@/services/auth.api'
import { useAuthMeQuery } from '@/services/inctagram.auth.service'
import clsx from 'clsx'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import s from '@/components/Layout/layout.module.scss'

import { useAppDispatch } from '../../../store'

const publicRouts = [
  '/',
  '/login',
  '/signUp',
  '/privacyPolicy',
  '/termsOfService',
  '/profile/[id]',
  '/forgotPassword',
  '/create-new-pass',
]

export const LayoutNew: NextPage<PropsWithChildren> = ({ children }) => {
  const { data, isFetching, isLoading } = useAuthMeQuery()
  const dispatch = useAppDispatch()
  const style = data || isLoading ? '' : s.gridHaveOneCol
  const router = useRouter()
  const path = router.pathname

  /**
   * диспатчим в ReduxSlice мою почту. Чтобы в других компонентах или страницах
   * не использовать запрос AuthMe, а вытянуть из Redux
   */
  useEffect(() => {
    if (data) {
      dispatch(authActions.setMyEmail({ authData: data }))
    }
  }, [data, dispatch])

  /**
   * Флаг редиректа на страницу логина: если нет data (юзер не залогинен) и юзер вводит в URL адрес, отличающийся
   * от публичного.
   */
  const isRedirectToLoginflag = !data && !isFetching && !isLoading && !publicRouts.includes(path)

  return (
    <div className={clsx(s.container, style)}>
      {isLoading ? (
        <>
          <header className={s.headerSkelet}></header>
          <nav className={s.navSkelet}></nav>
          <div className={s.mainSkelet}>LOADING</div>
        </>
      ) : (
        <>
          <Header isAuthMe={!!data} />
          <MainComponent authMeData={data} redirectToLogin={isRedirectToLoginflag}>
            {children}
          </MainComponent>
        </>
      )}
    </div>
  )
}
