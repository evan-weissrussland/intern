import React from 'react'

import { AccountType } from '@/components/profile-settings/account-managment/AccountType'
import { CurrentSubscription } from '@/components/profile-settings/account-managment/CurrentSubscription'
import { SubscriptionCost } from '@/components/profile-settings/account-managment/SubscriptionCost'
import { ReactPayPalScriptOptions } from '@paypal/react-paypal-js'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import s from '@/components/profile-settings/account-managment/accountManagment.module.scss'

type Props = {}

export const AccountManagmentContent = ({}: Props) => {
  /**
   * для кнопки paypal. Объект настроек
   */
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID_PAYPAL as string,
    components: ['buttons', 'funding-eligibility'],
    currency: 'USD',
  }

  return (
    <TabsPrimitive.Content className={s.wrapper} value={'accountManagement'}>
      <CurrentSubscription />
      <AccountType />
      <SubscriptionCost />
      {/*<PayPalScriptProvider options={initialOptions}>*/}
      {/*  <div>*/}
      {/*    <PayPalButton amount={'10.00'} />*/}
      {/*  </div>*/}
      {/*</PayPalScriptProvider>*/}
    </TabsPrimitive.Content>
  )
}
