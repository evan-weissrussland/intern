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

/**
 * публичные страницы, с которых должен быть редирект на профиль юзера, если юзер залогинен
 */
const publicRoutes = ['/login', '/signUp', '/forgotPassword', '/create-new-pass']
/**
 * публичные страницы, на которые юзер может зайти, если он не залогинен
 */
const publicRouts = ['/', '/privacyPolicy', '/termsOfService', '/profile/[id]', ...publicRoutes]

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
  /**
   * Флаг редиректа на страницу профиля юзера: если есть data (юзер залогинен) и юзер вводит в URL публичного адрес
   */
  const isRedirectToMyProfileFlag =
    !!data && !isFetching && !isLoading && publicRoutes.includes(path)

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
          <MainComponent
            authMeData={data}
            redirectToLogin={isRedirectToLoginflag}
            redirectToProfile={isRedirectToMyProfileFlag}
          >
            {children}
          </MainComponent>
        </>
      )}
    </div>
  )
}
