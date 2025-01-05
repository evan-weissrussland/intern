import React, { useState } from 'react'

import { ArrowBack } from '@/assets/icons'
import { PaidAccount } from '@/assets/icons/paidAccount'
import { CardFollowersSubscribers } from '@/components/cardFollowersSubscription/CardFollowersSubscribers'
import { CardFollowingsSubscribers } from '@/components/cardFollowingSubscription/CardFollowingsSubscribers'
import { ModalFollowing } from '@/components/modalFollowing'
import { GetPostsUser } from '@/components/userProfile/getPostsUser'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import {
  useFollowToUserMutation,
  useUnfollowFromUserMutation,
} from '@/services/inctagram.followings.service'
import { useGetUserProfileByUserNameQuery } from '@/services/inctagram.profile.service'
import { useGetPublicProfileForUserByIdQuery } from '@/services/inctagram.public-user.service'
import { useGetMyCurrentSubscriptionQuery } from '@/services/inctagram.subscriptions.service'
import { Button, Typography } from '@chrizzo/ui-kit'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import Image from 'next/image'
import { useRouter } from 'next/router'

import s from './userProfile.module.scss'
import tabsStyles from '@/components/profile-settings/tabs-trigger-list/tabs.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'
import { ModalFollowers } from '../modalFollowers'

type Props = {
  dataProfile: any
  myProfileId: null | number
}
type FlagCheckedToMobileForFollowingSub = 'Followers' | 'Following' | 'profile'

export function UserProfile({ dataProfile, myProfileId }: Props) {
  const router = useRouter()

  const [checkedToFollowers, setcheckedToFollowers] =
    useState<FlagCheckedToMobileForFollowingSub>('profile')

  /**
   * кастомный хук контроля ширины окна
   */
  const windowWidth = useWindowWidth()
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
  /**
   * Переключатель табов followers или following или возврат на профиль. Для мобильной версии только
   * @param flag - флаг "Followers" | "Following" | "profile"
   */
  const onclickTriggerFollowingHandler = (flag: FlagCheckedToMobileForFollowingSub) => {
    if (windowWidth <= 360) {
      setcheckedToFollowers(flag)
    }
  }
  const followingsCount =
    privateProfile?.followingCount || publicProfile?.userMetadata.following || 0
  const followersCount =
    privateProfile?.followersCount || publicProfile?.userMetadata.followers || 0

  return (
    <>
      {checkedToFollowers === 'profile' && (
        <div className={s.avaAndDescrBlock}>
          <Image
            alt={'avatar'}
            className={s.image}
            height={
              (privateProfile?.avatars[0]?.height || publicProfile?.avatars[0]?.height) ?? 204
            }
            src={(privateProfile?.avatars[0]?.url || publicProfile?.avatars[0]?.url) ?? defaultAva}
            width={(privateProfile?.avatars[0]?.width || publicProfile?.avatars[0]?.width) ?? 204}
          />
          <section className={s.aboutUserBlock}>
            {windowWidth > 361 && (
              <div className={s.userNameSettingsButtonBlock}>
                <Typography
                  className={s.userName}
                  variant={windowWidth > 360 ? 'h1' : 'regularBold16'}
                >
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
            )}
            <div className={s.countsFolowwers}>
              <ModalFollowing
                callbackTrigger={() => onclickTriggerFollowingHandler('Following')}
                followingCount={followingsCount}
                isMyProfile={isMyProfile}
                userName={dataProfile.userName}
              />
              <ModalFollowers
                callbackTrigger={() => onclickTriggerFollowingHandler('Followers')}
                followersCount={followersCount}
                isMyProfile={isMyProfile}
                userName={dataProfile.userName}
              />
              <div className={s.publications} onClick={openPublications}>
                <Typography variant={windowWidth > 360 ? 'regularBold14' : 'smallSemiBold'}>
                  {privateProfile?.publicationsCount ||
                    publicProfile?.userMetadata.publications ||
                    0}
                </Typography>
                <Typography variant={windowWidth > 360 ? 'regular14' : 'small'}>
                  Publications
                </Typography>
              </div>
            </div>
            {windowWidth > 361 && (
              <article className={s.aboutMe}>
                <Typography variant={windowWidth > 360 ? 'regular16' : 'regular14'}>
                  {(privateProfile?.aboutMe || publicProfile?.aboutMe) ??
                    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
              ea commodo consequat.`}
                </Typography>
              </article>
            )}
          </section>
        </div>
      )}
      {windowWidth <= 360 && checkedToFollowers === 'profile' && (
        <>
          <Typography className={s.userName} variant={windowWidth > 360 ? 'h1' : 'regularBold16'}>
            {(privateProfile?.userName || publicProfile?.userName) ?? 'UserName'}
            {subscriptionData?.data.length && !isFetchingGetMySubscriptions ? (
              <PaidAccount />
            ) : null}
          </Typography>
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
          <article className={s.aboutMe}>
            <Typography variant={windowWidth > 360 ? 'regular16' : 'regular14'}>
              {(privateProfile?.aboutMe || publicProfile?.aboutMe) ??
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
              ea commodo consequat.`}
            </Typography>
          </article>
        </>
      )}
      {checkedToFollowers === 'profile' && (
        <GetPostsUser isILogined={!!myProfileId} userName={dataProfile?.userName ?? ''} />
      )}
      {checkedToFollowers !== 'profile' && (
        <>
          <div className={s.mobileArrowBackBlock}>
            <ArrowBack
              onClick={() => {
                onclickTriggerFollowingHandler('profile')
              }}
            />
            <Typography variant={'h2'}>
              {privateProfile?.userName || publicProfile?.userName}
            </Typography>
          </div>
          <TabsPrimitive.Root
            activationMode={'manual'}
            className={s.tabsPoot}
            defaultValue={checkedToFollowers}
          >
            <TabsPrimitive.TabsList className={tabsStyles.tabsList}>
              <TabsPrimitive.TabsTrigger
                className={tabsStyles.tabsTrigger}
                key={1}
                value={'Following'}
              >
                {followingsCount} Following
              </TabsPrimitive.TabsTrigger>
              <TabsPrimitive.TabsTrigger
                className={tabsStyles.tabsTrigger}
                key={2}
                value={'Followers'}
              >
                {followersCount} Followers
              </TabsPrimitive.TabsTrigger>
            </TabsPrimitive.TabsList>
            <TabsPrimitive.Content value={'Following'}>
              <CardFollowingsSubscribers
                isMyProfile={isMyProfile}
                open
                userName={dataProfile.userName}
              />
            </TabsPrimitive.Content>
            <TabsPrimitive.Content value={'Followers'}>
              <CardFollowersSubscribers
                isMyProfile={isMyProfile}
                open
                userName={dataProfile.userName}
              />
            </TabsPrimitive.Content>
          </TabsPrimitive.Root>
        </>
      )}
    </>
  )
}
