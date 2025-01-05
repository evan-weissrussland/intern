import React from 'react'

import { ArrowBack } from '@/assets/icons'
import { CardFollowersSubscribers } from '@/components/cardFollowersSubscription/CardFollowersSubscribers'
import { CardFollowingsSubscribers } from '@/components/cardFollowingSubscription/CardFollowingsSubscribers'
import { FlagCheckedToMobileForFollowingSub } from '@/components/userProfile/index'
import { Typography } from '@chrizzo/ui-kit'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import tabsStyles from '@/components/profile-settings/tabs-trigger-list/tabs.module.scss'
import s from '@/components/userProfile/userProfile.module.scss'

type Props = {
  checkedToFollowers: FlagCheckedToMobileForFollowingSub
  followersCount: number
  followingsCount: number
  isMyProfile: boolean
  onclickTriggerFollowing: () => void
  userName: string
}
export const TabsFollowSubscribtion = ({
  checkedToFollowers,
  followersCount,
  followingsCount,
  isMyProfile,
  onclickTriggerFollowing,
  userName,
}: Props) => {
  return (
    <>
      <div className={s.mobileArrowBackBlock}>
        <ArrowBack
          onClick={() => {
            onclickTriggerFollowing()
          }}
        />
        <Typography variant={'h2'}>{userName}</Typography>
      </div>
      <TabsPrimitive.Root
        activationMode={'manual'}
        className={s.tabsPoot}
        defaultValue={checkedToFollowers}
      >
        <TabsPrimitive.TabsList className={tabsStyles.tabsList}>
          <TabsPrimitive.TabsTrigger className={tabsStyles.tabsTrigger} key={1} value={'Following'}>
            {followingsCount} Following
          </TabsPrimitive.TabsTrigger>
          <TabsPrimitive.TabsTrigger className={tabsStyles.tabsTrigger} key={2} value={'Followers'}>
            {followersCount} Followers
          </TabsPrimitive.TabsTrigger>
        </TabsPrimitive.TabsList>
        <TabsPrimitive.Content value={'Following'}>
          <CardFollowingsSubscribers isMyProfile={isMyProfile} open userName={userName} />
        </TabsPrimitive.Content>
        <TabsPrimitive.Content value={'Followers'}>
          <CardFollowersSubscribers isMyProfile={isMyProfile} open userName={userName} />
        </TabsPrimitive.Content>
      </TabsPrimitive.Root>
    </>
  )
}
