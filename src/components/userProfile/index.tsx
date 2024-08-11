import { PaidAccount } from '@/assets/icons/paidAccount'
import { useAuthMeQuery } from '@/services/inctagram.auth.service'
import { useGetUserProfileByUserIdQuery } from '@/services/inctagram.profile.service'
import { useGetMySubscriptionsQuery } from '@/services/inctagram.subscriptions.service'
import { Button, Typography } from '@chrizzo/ui-kit'
import Image from 'next/image'
import { useRouter } from 'next/router'

import s from './userProfile.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  userName: string | undefined
}

export function UserProfile({ userName }: Props) {
  const router = useRouter()

  /**
   * запрос на сервер за профилем юзера по имени, чтобы забрать число followers
   */
  const { data } = useGetUserProfileByUserIdQuery(userName ?? '')

  /**
   * запрос за проверкой подписки (для отображения вкладки статистики)
   */
  const { data: subscriptionData } = useGetMySubscriptionsQuery()

  /**
   * проверка залогинен или нет
   */
  const { data: authMeData } = useAuthMeQuery()

  /**
   * открыть настройки
   */
  const openSettings = () => {
    //открыть настройки
  }

  const openFollowers = () => {
    if (!authMeData) {
      return null
    }
    alert('openFolowwers')
    //открыть модалку фоловеров
  }
  const openFollowings = () => {
    if (!authMeData) {
      return null
    }
    alert('openFollowings')
    //открыть модалку подписок
  }
  const openPublications = () => {
    if (!authMeData) {
      return null
    }
    alert('openPublications')
    //открыть модалку публикаций
  }

  return (
    <>
      <div className={s.avaAndDescrBlock}>
        <Image
          alt={'avatar'}
          className={s.image}
          height={data?.avatars[0]?.height ?? 204}
          src={data?.avatars[0]?.url ?? defaultAva}
          width={data?.avatars[0]?.width ?? 204}
        />
        <section className={s.aboutUserBlock}>
          <div className={s.userNameSettingsButtonBlock}>
            <Typography className={s.userName} variant={'h1'}>
              {data?.userName ?? 'UserName'}
              {subscriptionData?.length ? <PaidAccount /> : null}
            </Typography>
            {authMeData && (
              <Button onClick={openSettings} variant={'secondary'}>
                <Typography variant={'h3'}>Profile Settings</Typography>
              </Button>
            )}
          </div>
          <div className={s.countsFolowwers}>
            <div className={s.following} onClick={openFollowings}>
              <Typography variant={'regularBold14'}>{data?.followingCount ?? 2218}</Typography>
              <Typography variant={'regular14'}>Following</Typography>
            </div>
            <div className={s.followers} onClick={openFollowers}>
              <Typography variant={'regularBold14'}>{data?.followersCount ?? 2358}</Typography>
              <Typography variant={'regular14'}>Followers</Typography>
            </div>
            <div className={s.publications} onClick={openPublications}>
              <Typography variant={'regularBold14'}>{data?.publicationsCount ?? 2764}</Typography>
              <Typography variant={'regular14'}>Publications</Typography>
            </div>
          </div>
          <article className={s.aboutMe}>
            <Typography variant={'regular16'}>
              {data?.aboutMe ??
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
              ea commodo consequat.`}
            </Typography>
          </article>
        </section>
      </div>
      <section className={s.cardsBlock}>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
        <div className={s.card}></div>
      </section>
    </>
  )
}