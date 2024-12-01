import { PageWrapper } from '@/components'
import { UserProfile } from '@/components/userProfile'
import { inctagramAuthService } from '@/services/inctagram.auth.service'
import {
  inctagramPublicPostsService,
  useGetAllPostsQuery,
} from '@/services/inctagram.public-posts.service'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import s from './userProfilePage.module.scss'

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
  /**
   * вытягиваю из куки access-токен. Это та кука, которую я создал при логине
   */
  const token = req.cookies.access_token
  /**
   * если access-токен есть, то из него парсим вторую часть. Там сидит id моего аккаунта
   */
  const tokenPayload = token ? JSON.parse(atob(token?.split('.')[1])) : undefined

  if (token && tokenPayload.userId === Number(params?.id)) {
    const resProfile = await fetch(`https://inctagram.work/api/v1/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const profile: any = await resProfile.json()

    return { props: { myProfileId: tokenPayload.userId, profile } }
  } else {
    const resProfile = await fetch(
      `https://inctagram.work/api/v1/public-user/profile/${params?.id}`
    )
    const profile: any = await resProfile.json()

    return { props: { myProfileId: token ? tokenPayload.userId : null, profile } }
  }
}) satisfies GetServerSideProps<{ myProfileId: null | number; profile: any }>

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
  const { data } = useGetAllPostsQuery({})

  //********************************************
  return (
    <PageWrapper>
      <div className={s.overflowedContainer}>
        <div className={s.mainCntainer}>
          <UserProfile
            dataProfile={props.pageProps.profile}
            myProfileId={props.pageProps.myProfileId}
          />
        </div>
      </div>
    </PageWrapper>
  )
}

export default UserProfileDinamicPage
