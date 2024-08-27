import { PropsWithChildren, ReactElement } from 'react'

import { Layout } from '@/components/Layout'
import { LoginNavigate } from '@/hoc/LoginNavigate'
import { NextPage } from 'next'

export const NavLayout: NextPage<PropsWithChildren> = ({ children }) => {
  return <Layout showNav>{children}</Layout>
}

export const GetNavLayout = (page: ReactElement) => {
  console.log('GetNavLayout')

  return <NavLayout>{page}</NavLayout>
}
