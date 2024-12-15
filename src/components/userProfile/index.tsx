import { PaidAccount } from '@/assets/icons/paidAccount'
import { ModalFollowers } from '@/components/ModalFollowers'
import { ModalFollowing } from '@/components/modalFollowing'
import { GetPostsUser } from '@/components/userProfile/getPostsUser'
import {
  useFollowToUserMutation,
  useUnfollowFromUserMutation,
} from '@/services/inctagram.followings.service'
import { useGetUserProfileByUserNameQuery } from '@/services/inctagram.profile.service'
import { useGetPublicProfileForUserByIdQuery } from '@/services/inctagram.public-user.service'
import { useGetMyCurrentSubscriptionQuery } from '@/services/inctagram.subscriptions.service'
import { Button, Typography } from '@chrizzo/ui-kit'
import Image from 'next/image'
import { useRouter } from 'next/router'

import s from './userProfile.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  dataProfile: any
  myProfileId: null | number
}

export function UserProfile({ dataProfile, myProfileId }: Props) {
  const router = useRouter()
  /**
   * Првоерка на мой аккаунт
   */
  const isMyProfile = myProfileId === Number(router.query.id)
  /**
   * запрос на закрытый эндпоинт за профилем юзера по имени. Если я залогинен,
   * то этот запрос выполняется
   */
  const { data: privateProfile } = useGetUserProfileByUserNameQuery(dataProfile?.userName, {
    skip: !myProfileId,
  })
  /**
   * запрос на публичный эндпоинт за профилем юзера по id. Этот запрос нужен,
   * если я НЕ залогинен, иначе мы не сможем вытянуть информацию о юзере. Потмоу, что смотреть профиль я
   * должен даже при отсутствии залогиненности
   */
  const { data: publicProfile } = useGetPublicProfileForUserByIdQuery(Number(router.query.id), {
    skip: !!myProfileId,
  })
  /**
   * запрос за проверкой подписки (для отображения вкладки статистики)
   */
  const { data: subscriptionData, isFetching: isFetchingGetMySubscriptions } =
    useGetMyCurrentSubscriptionQuery(undefined, { skip: !myProfileId })

  /**
   * открыть настройки
   */
  const openSettings = () => {
    void router.push('/generalInfo/generalInformation')
  }
  /**
   * открыть публикации
   */
  const openPublications = () => {
    if (!myProfileId) {
      return null
    }
    alert('openPublications')
    //открыть модалку публикаций
  }

  /**
   * хук RTKQ. Подписка на юзера
   */
  const [followingToUser] = useFollowToUserMutation()
  /**
   * хук RTKQ. Отписаться от юзера
   */
  const [unfollow] = useUnfollowFromUserMutation()

  /**
   * коллбэк для подписки на юзера
   * @param selectedUserId - id юзера, на которого хотим подпсаться
   */
  const toFollowUser = (selectedUserId: number | undefined) => {
    if (selectedUserId) {
      followingToUser({ selectedUserId }).unwrap()
    }
  }

  /**
   * коллбэк для отподписки на юзера
   * @param selectedUserId - id юзера, на которого хотим подпсаться
   */
  const unfollowUser = (selectedUserId: number) => {
    unfollow(selectedUserId).unwrap()
  }

  return (
    <>
      <div className={s.avaAndDescrBlock}>
        <Image
          alt={'avatar'}
          className={s.image}
          height={(privateProfile?.avatars[0]?.height || publicProfile?.avatars[0]?.height) ?? 204}
          src={(privateProfile?.avatars[0]?.url || publicProfile?.avatars[0]?.url) ?? defaultAva}
          width={(privateProfile?.avatars[0]?.width || publicProfile?.avatars[0]?.width) ?? 204}
        />
        <section className={s.aboutUserBlock}>
          <div className={s.userNameSettingsButtonBlock}>
            <Typography className={s.userName} variant={'h1'}>
              {(privateProfile?.userName || publicProfile?.userName) ?? 'UserName'}
              {subscriptionData?.data.length && !isFetchingGetMySubscriptions ? (
                <PaidAccount />
              ) : null}
            </Typography>
            {myProfileId === dataProfile.id && (
              <Button onClick={openSettings} variant={'secondary'}>
                <Typography variant={'h3'}>Profile Settings</Typography>
              </Button>
            )}
            {myProfileId && myProfileId !== dataProfile.id && (
              <div className={s.followUnfollowSendMessageButtonsBlock}>
                {!privateProfile?.isFollowing && (
                  <Button onClick={() => toFollowUser(privateProfile?.id)} variant={'primary'}>
                    <Typography variant={'h3'}>Follow</Typography>
                  </Button>
                )}
                {privateProfile?.isFollowing && (
                  <Button onClick={() => unfollowUser(privateProfile?.id)} variant={'outline'}>
                    <Typography variant={'h3'}>Unfollow</Typography>
                  </Button>
                )}
                <Button onClick={() => {}} variant={'secondary'}>
                  <Typography variant={'h3'}>Send Message</Typography>
                </Button>
              </div>
            )}
          </div>
          <div className={s.countsFolowwers}>
            <ModalFollowing
              followingCount={
                privateProfile?.followingCount || publicProfile?.userMetadata.following || 0
              }
              isMyProfile={isMyProfile}
              userName={dataProfile.userName}
            />
            <ModalFollowers
              followersCount={
                privateProfile?.followersCount || publicProfile?.userMetadata.followers || 0
              }
              isMyProfile={isMyProfile}
              userName={dataProfile.userName}
            />
            <div className={s.publications} onClick={openPublications}>
              <Typography variant={'regularBold14'}>
                {privateProfile?.publicationsCount || publicProfile?.userMetadata.publications || 0}
              </Typography>
              <Typography variant={'regular14'}>Publications</Typography>
            </div>
          </div>
          <article className={s.aboutMe}>
            <Typography variant={'regular16'}>
              {(privateProfile?.aboutMe || publicProfile?.aboutMe) ??
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
              ea commodo consequat.`}
            </Typography>
          </article>
        </section>
      </div>
      <GetPostsUser isILogined={!!myProfileId} userName={dataProfile?.userName ?? ''} />
    </>
  )
}
