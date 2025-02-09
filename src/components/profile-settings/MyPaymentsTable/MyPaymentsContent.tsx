import React, { useState } from 'react'

import { RowTablePaymentItem } from '@/components/profile-settings/MyPaymentsTable/RowTablePaymentItem'
import { Paginator } from '@/components/profile-settings/MyPaymentsTable/paginator/paginator'
import {
  PagSizePaginationType,
  PageSizeType,
} from '@/components/profile-settings/MyPaymentsTable/types'
import {
  changeTypeOfDate,
  usePaymentPeriod,
  usePaymentService,
} from '@/components/profile-settings/account-managment/utils/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { useGetMyAllSubscriptionsQuery } from '@/services/inctagram.subscriptions.service'
import { Typography } from '@chrizzo/ui-kit'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import clsx from 'clsx'

import s from '@/components/profile-settings/account-managment/accountManagment.module.scss'

const titlesTableHeadCells = [
  { id: 1, title: 'dateOfPay' },
  { id: 2, title: 'endPay' },
  { id: 3, title: 'price' },
  {
    id: 4,
    title: 'subType',
  },
  { id: 5, title: 'payType' },
]

type Props = { mobile: boolean }
export const MyPaymentsContent = ({ mobile }: Props) => {
  /**
   * текущая страница пагинации
   */
  const [currentPage, setCurrentPage] = useState(1)
  /**
   * количество выводимых подписок на странице
   */
  const [pageSizeNumber, setPageSizeNumber] = useState<PagSizePaginationType>('10')

  /**
   * Запрос за всеми моими подписками
   */
  const { data } = useGetMyAllSubscriptionsQuery()
  /**
   * интернационализация
   */
  const { t } = useTranslation()
  /**
   * Отфильтрованный массив подписок. Отображаются только те полписки,
   * которые соответствуют выбранной странице пагинации
   */
  const filtredSubscribtions = data?.filter((_, i) => {
    return (currentPage - 1) * +pageSizeNumber <= i && i < currentPage * +pageSizeNumber
  })
  /**
   * Массив подписок для таблицы
   */
  const payments = filtredSubscribtions?.map(p => {
    return <RowTablePaymentItem key={p.subscriptionId + Math.random()} payment={p} />
  })
  /**
   * утилита для интернационализации имени столбцов
   * @param value
   */
  const getCellsName = (value: string) => {
    const key = value as keyof typeof t.payments.allPayments

    return t.payments.allPayments[key]
  }
  /**
   * массив названий столбцов
   */
  const titlesHeadCells = titlesTableHeadCells.map(t => {
    const Component = (
      <Typography className={s.dateAllPayment} variant={'regularBold14'}>
        {t.id ? getCellsName(t.title) : t.title}
      </Typography>
    )

    if (mobile) {
      return <div key={t.id}>{Component}</div>
    }
    if (!mobile) {
      return (
        <th className={s.th} key={t.id}>
          {Component}
        </th>
      )
    }
  })
  /**
   * таблица для мобильной версии
   */
  const paym = filtredSubscribtions?.map(p => {
    return (
      <div className={s.mobileTableWr} key={p.subscriptionId + Math.random()}>
        <div className={s.mobileTableTitlesHead}>{titlesHeadCells}</div>
        <div className={s.mobileTableCell}>
          <Typography className={s.dateAllPayment} variant={'regularBold14'}>
            {changeTypeOfDate(p.dateOfPayment)}
          </Typography>
          <Typography className={s.dateAllPayment} variant={'regularBold14'}>
            {changeTypeOfDate(p.endDateOfSubscription)}
          </Typography>
          <Typography className={s.dateAllPayment} variant={'regularBold14'}>
            {p.subscriptionType}
          </Typography>
          <Typography className={s.dateAllPayment} variant={'regularBold14'}>
            {p.price}
          </Typography>
          <Typography className={s.dateAllPayment} variant={'regularBold14'}>
            {p.paymentType}
          </Typography>
        </div>
      </div>
    )
  })

  return (
    <TabsPrimitive.Content
      className={clsx(s.wrapperMyAllPay, mobile && s.mobileWr)}
      value={'myPayments'}
    >
      {!mobile && (
        <table className={s.tablePayments}>
          <thead className={s.thead}>
            <tr className={s.tr}>{titlesHeadCells}</tr>
          </thead>
          <tbody className={s.tbody}>{payments}</tbody>
        </table>
      )}
      {mobile && paym}
      {!mobile && (
        <Paginator
          currentPage={currentPage}
          onPageChanged={setCurrentPage}
          onPageSizeChanged={(pageSizeNumber: PageSizeType) =>
            setPageSizeNumber(pageSizeNumber.toString() as PagSizePaginationType)
          }
          pageSize={+pageSizeNumber as PageSizeType}
          totalItemsCount={data?.length}
        />
      )}
    </TabsPrimitive.Content>
  )
}
