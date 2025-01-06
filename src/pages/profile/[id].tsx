import React from 'react'

import { PageWrapper } from '@/components'
import { Scroll } from '@/components/scroll'
import { UserProfile } from '@/components/userProfile'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { inctagramAuthService } from '@/services/inctagram.auth.service'
import { inctagramPublicPostsService } from '@/services/inctagram.public-posts.service'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { wrapper } from '../../../store'

/**
 * SSR
 */
export const getServerSideProps = wrapper.getServerSideProps(store => async ({ params, req }) => {
  //********************************************************************************************
  /**
   * чисто для проверки работы Redux на сервере: делается запрос за authMe, потом запрос за постами,
   * потом авейтится Промис - ждём пока все запросы RTKQ пройдут. Результаты запросов попадут в КЭШ Redux.
   * Потом на клиенте при "гидрации" эти данные тоже попадут в КЭШ запросов authMe и постов.
   * И если мы будем делать запрос authMe и запрос за постами на клиенте черех хуки RTKQ,
   * то реальный запрос не пойдёт, а данные возьмутся из КЭШа
   */
  store.dispatch(inctagramAuthService.endpoints.authMe.initiate())
  store.dispatch(inctagramPublicPostsService.endpoints.getAllPosts.initiate({}))
  await Promise.all(store.dispatch(inctagramPublicPostsService.util.getRunningQueriesThunk()))
  //**********************************************************************************************

  const resProfile = await fetch(`https://inctagram.work/api/v1/public-user/profile/${params?.id}`)
  const profile: any = await resProfile.json()

  return {
    props: { profile },
  }
}) satisfies GetServerSideProps<{ profile: any }>

/**
 * Компонент
 */
function UserProfileDinamicPage(props: {
  pageProps: InferGetServerSidePropsType<typeof getServerSideProps>
}) {
  //************************************************
  /**
   * Запрос ниже чисто для проверки работы Redux на сервере: на сервере мы сделали запрос за постами
   * и при "гидрации" КЭШ Redux сервера синхронизировался с КЕШем Redux на клиенте и запрсо ниже не пройдёт,
   * а данные возьмутся из КЭШа (првоерено во вкладке Network браузера)
   */
  // const { data } = useGetAllPostsQuery({})

  //********************************************

  /**
   * кастомный хук контроля ширины окна
   */
  const windowWidth = useWindowWidth()

  const style = windowWidth > 360 ? 'calc(100vh - 61px)' : 'calc(100vh - 121px)'

  return (
    <PageWrapper>
      <Scroll height={style}>
        <UserProfile dataProfile={props.pageProps.profile} />
      </Scroll>
    </PageWrapper>
  )
}

export default UserProfileDinamicPage
