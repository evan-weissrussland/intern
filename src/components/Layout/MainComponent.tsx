import { PropsWithChildren } from 'react'

import { Main, Nav } from '@/components'
import { ResponseAuthMe } from '@/services/types'
import { useRouter } from 'next/router'

import s from '@/components/Layout/layout.module.scss'

type Propss = {
  authMeData: ResponseAuthMe | undefined
  redirectToLogin: boolean
} & PropsWithChildren
export const MainComponent = ({ authMeData, children, redirectToLogin }: Propss) => {
  const router = useRouter()
  const path = router.pathname

  if (redirectToLogin) {
    void router.push('/login')

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
