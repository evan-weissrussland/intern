import { FC, memo, useEffect, useState } from 'react'

import { PaginationLeft, PaginationRight } from '@/assets/icons'
import { PageSizeType } from '@/components/profile-settings/MyPaymentsTable/types'
import { useTranslation } from '@/hooks/useTranslation'
import { Select, Typography } from '@chrizzo/ui-kit'
import clsx from 'clsx'

import s from './Paginator.module.css'

type Props = {
  currentPage: number | undefined //текущая выбранная страница
  onPageChanged: (pageNumber: number) => void //изменение текущей страницы
  onPageSizeChanged?: (pageSizeNumber: PageSizeType) => void //изменение порции страниц. Делает селект
  pageSize: PageSizeType //размер товаров на одной странице
  totalItemsCount: number | undefined //общее число всех товаров
}

export const Paginator = memo(
  ({
    currentPage = 1,
    onPageChanged,
    onPageSizeChanged,
    pageSize = 10,
    totalItemsCount = 100,
  }: Props) => {
    /**
     * с помощью useState меняем порцию страниц
     */
    const [portionNumber, setPortionNumber] = useState(1)
    /**количество номеров порций страниц, видимых между кнопками "предыдущая порция страниц"
     * и "следующая порция страниц"
     */
    const portionSize = 5
    /**
     * общее количество страниц
     */
    const pagesCount = Math.ceil(totalItemsCount / pageSize)
    /**
     * массив из количества страниц
     */
    const pages: number[] = []

    for (let i = 2; i < pagesCount; i++) {
      pages.push(i)
    }
    /**
     * количество порций страниц
     */
    const portionCount = Math.ceil(pagesCount / portionSize)
    /**
     * номер крайней левой страницы в порции страниц
     */
    const leftPortionPageNumber = (portionNumber - 1) * portionSize
    /**
     * номер крайней правой страницы в порции страниц
     */
    const rightPortionPageNumber = portionNumber * portionSize
    /**
     * условие блокировки кнопки "предыдущая порция страниц"
     */
    const disabledPrevButton = !(portionNumber > 1)
    /**
     * условие блокировки кнопки "следующая порция страниц"
     */
    const disabledNextButton = !(portionCount > portionNumber)
    /**
     * интернационализация
     */
    const { t } = useTranslation()

    return (
      <>
        <div className={s.waipperSpans}>
          <button
            className={`${s.pageNumber} ${s.prev}`}
            disabled={disabledPrevButton}
            onClick={() => {
              setPortionNumber(portionNumber - 1)
            }}
            type={'button'}
          >
            <PaginationLeft className={clsx(disabledPrevButton && s.disabledArrow)} />
          </button>

          <button
            className={`${s.pageNumber} ${1 === currentPage ? s.selectedPage : ''}`}
            onClick={() => {
              if (1 !== currentPage) {
                onPageChanged(1)
                setPortionNumber(1)
              }
            }}
            type={'button'}
          >
            <Typography variant={'regular14'}>1</Typography>
          </button>

          {portionNumber > 1 && (
            <button className={s.pageNumber} type={'button'}>
              ...
            </button>
          )}

          {pages
            .filter(p => p > leftPortionPageNumber && p <= rightPortionPageNumber)
            .map((p, i) => {
              return (
                <button
                  className={`${s.pageNumber} ${p === currentPage ? s.selectedPage : ''}`}
                  key={i}
                  onClick={() => onPageChanged(p)}
                  type={'button'}
                >
                  <Typography variant={'regular14'}>{p}</Typography>
                </button>
              )
            })}

          {portionNumber < portionCount && (
            <button className={s.pageNumber} type={'button'}>
              ...
            </button>
          )}

          {pagesCount > 1 && (
            <button
              className={`${s.pageNumber} ${pagesCount === currentPage ? s.selectedPage : ''}`}
              onClick={() => {
                onPageChanged(pagesCount)
                setPortionNumber(portionCount)
              }}
              type={'button'}
            >
              <Typography variant={'regular14'}>{pagesCount}</Typography>
            </button>
          )}

          <button
            className={`${s.pageNumber} ${s.next}`}
            disabled={disabledNextButton}
            onClick={() => {
              setPortionNumber(portionNumber + 1)
            }}
            type={'button'}
          >
            <PaginationRight className={clsx(disabledNextButton && s.disabledArrow)} />
          </button>

          <Typography variant={'regular14'}>{t.pagination.show}&nbsp;</Typography>
          <Select
            items={[{ item: '10' }, { item: '20' }, { item: '30' }, { item: '40' }, { item: '50' }]}
            onValueChange={(p: string) => {
              if (onPageSizeChanged) {
                onPageSizeChanged(+p as PageSizeType)
              }
            }}
            variant={'small'}
          />
          <Typography variant={'regular14'}>&nbsp;{t.pagination.onPage}</Typography>
        </div>
      </>
    )
  }
)
//TODO не знаю, как сделать, чтобы portionSize = 3, крмое 1-й и последней порции
