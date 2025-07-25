import React, { PropsWithChildren, ReactNode, useState } from 'react'

import { MyPaymentsContent } from '@/components/profile-settings/MyPaymentsTable/MyPaymentsContent'
import { AccountManagmentContent } from '@/components/profile-settings/account-managment'
import { DevicesSessionsContent } from '@/components/profile-settings/devices'
import { GeneralInfoContent } from '@/components/profile-settings/general-info-settings'
import { TabsTriggerslist } from '@/components/profile-settings/tabs-trigger-list'
import { Scroll } from '@/components/scroll'
import LinearProgress from '@/components/uikit-temp-replacements/linear-progress/LinearProgress'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import {
  useGetMyProfileQuery,
  useUpdateAvatarProfileMutation,
} from '@/services/inctagram.profile.service'
import { TabType } from '@chrizzo/ui-kit/dist/components/tabs/tabs'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import clsx from 'clsx'
import { useRouter } from 'next/router'

import s from '@/components/profile-settings/profileSettings.module.scss'

//todo translation: move inside component and wrap with useMemo?
const tabsList: TabType[] = [
  { title: 'General information', value: 'generalInformation' },
  { title: 'Devices', value: 'devices' },
  { title: 'Account management', value: 'accountManagement' },
  { title: 'My payments', value: 'myPayments' },
]

export const ProfileSettings = () => {
  const router = useRouter()
  /**
   * кастомный хук контроля ширины окна
   */
  const windowWidth = useWindowWidth()
  /**
   * запрос за данными моего профайла для отображения их в форме generalInfo
   */
  const { data, isFetching } = useGetMyProfileQuery()
  /**
   * запрос за изменением аватарки профиля
   */
  const [updateAvatarProfile] = useUpdateAvatarProfileMutation()
  /**
   * стейт картинки аватарки. Зачем он нужен, не знаю. Делал Саша.
   */
  const [_, setImage] = useState<File | null>(null)
  /**
   * обработчик загрузки аватарки с Пк и отправки её на сервер
   * @param file - загруженный файл
   */
  const handleImageSelection = (file: File | null) => {
    if (file) {
      const formData = new FormData()

      setImage(file)
      formData.append('file', file)
      updateAvatarProfile({ file: formData })
    }
  }
  /**
   * функция изменения динамического сегмента URL. После изменения URL компонент ререндерится
   * и новый сегмент из router.query идёт в value TabsPrimitive.Root.
   * Такая логика мне нужна для работы с оплатой через сторонний сервис: мне придёт от сервиса
   * URL "generalInfo/accountManagement", я вытяну "accountManagement" и сработает Таба для "accountManagement".
   * Для переключения табов можно было бы использовать useState, а при получении URLот платёжного сервиса
   * использовать useEffect, но тогда были бы мерцания.
   * @param value - значение Tab, на которое переключились
   */
  const changeUrl = (value: string) => {
    void router.push(`${value}`)
  }
  /**
   * Првоерка ширины окна
   */
  const isMobile = windowWidth <= 360
  /**
   * Стиль для скролла при мобильной версии
   */
  const scrollMobileStyle = 'calc(100vh - 159px)'

  return (
    <div className={clsx(isMobile ? s.root : s.wrapper)}>
      <LinearProgress active={isFetching} thickness={3} />
      <TabsPrimitive.Root
        activationMode={'manual'}
        onValueChange={changeUrl}
        value={router.query.index as string}
      >
        <ScrollWrapper className={s.scroll} mobile={isMobile}>
          <TabsTriggerslist tabsList={tabsList} />
        </ScrollWrapper>
        <ScrollWrapper className={s.scroll} height={scrollMobileStyle} mobile={isMobile}>
          <GeneralInfoContent
            isFetching={isFetching}
            mobile={isMobile}
            onValueChange={handleImageSelection}
            profileData={data}
          />
          <DevicesSessionsContent />
          <AccountManagmentContent mobile={isMobile} />
          <MyPaymentsContent mobile={isMobile} />
        </ScrollWrapper>
      </TabsPrimitive.Root>
    </div>
  )
}
type Propss = {
  className: string
  height?: string
  mobile: boolean
  scroll?: boolean
} & PropsWithChildren
export const ScrollWrapper = ({ children, className, height, mobile, scroll }: Propss) => {
  if (scroll || mobile) {
    return (
      <Scroll className={className} height={height} noScrollTumbs={mobile}>
        {children}
      </Scroll>
    )
  }

  return <>{children}</>
}
