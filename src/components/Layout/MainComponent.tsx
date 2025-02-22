import { PropsWithChildren } from 'react'

import { Main, Nav } from '@/components'
import { ResponseAuthMe } from '@/services/types'
import { useRouter } from 'next/router'

import s from '@/components/Layout/layout.module.scss'

type Propss = {
  authMeData: ResponseAuthMe | undefined
  redirectToLogin: boolean
  redirectToProfile: boolean
} & PropsWithChildren
export const MainComponent = ({
  authMeData,
  children,
  redirectToLogin,
  redirectToProfile,
}: Propss) => {
  const router = useRouter()
  const path = router.pathname

  /**
   * если не залогинен и руками ввожу в URL приватный путь, то редирект на логин
   */
  if (redirectToLogin) {
    void router.push('/login')

    return (
      <>
        <div className={s.mainSkelet}>LOADING</div>
      </>
    )
  }
  /**
   * если залогинен и руками ввожу в URL путь "логина", "регистрации", "смены пароля", "забыл пароль", то редирект
   * на страницу профиля юзера
   */
  if (authMeData && redirectToProfile) {
    void router.push(`/profile/${authMeData.userId}`)

    return (
      <>
        <div className={s.mainSkelet}>LOADING</div>
      </>
    )
  }

  return (
    <>
      {authMeData && (
        <Nav isSpecialAccount myEmail={authMeData.email} myProfileId={authMeData.userId} />
      )}
      <Main>{!(path === '/login' && authMeData) && children}</Main>
    </>
  )
}
