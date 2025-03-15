import React, { useEffect, useState } from 'react'

import { PageWrapper } from '@/components'
import { UsersType } from '@/components/modalFollowers/types'
import { User } from '@/components/search/user'
import { useLazyGetProfileUsersQuery } from '@/services/inctagram.followings.service'
import { TextField, Typography } from '@chrizzo/ui-kit'

import s from '@/components/search/search.module.scss'

export function Search() {
  /**
   * стэйт поиска подписчиков. search - передаём в value инпута. textFromDebounceInput - текст поиска для отправки с
   * запросом на сервер (отображается с выдержкой времени, чтобы не отправлять на сервер каждый вводимый символ)
   */
  const [inputValue, setInputValue] = useState('')
  const [usersList, setUserList] = useState<UsersType[]>([])
  /**
   * запрос за профилфями юзеров
   */
  const [getProfileUsers, { data, isFetching }] = useLazyGetProfileUsersQuery()
  /**
   * обработчик нажатия на Enter отправляет запрос за юзерами, если в инпуте не пусто
   */
  const onKeyDown = () => {
    if (inputValue.trim()) {
      getProfileUsers({ search: inputValue }).unwrap()
    }
  }
  /**
   * обработчик ввода в инпут. Если пустая строка (очистили инпут клавишей удалить или крестиком инпута),
   * то очищаем массив юзеров, иначе остаётся массив предыдущего запроса
   * @param value - строка из инпута
   */
  const onChangeSearchInputHandler = (value: string) => {
    if (!value) {
      setUserList([])
    }
    setInputValue(value)
  }

  /**
   * сетаем массив юзеров для отображения на экране
   */
  useEffect(() => {
    if (data) {
      setUserList(data?.items)
    }
  }, [data])

  return (
    <PageWrapper className={s.wrapper}>
      <div className={s.titleInputBlock}>
        <Typography className={s.title} variant={'h1'}>
          Search
        </Typography>
        <TextField
          onKeyDown={onKeyDown}
          onValueChange={onChangeSearchInputHandler}
          placeholder={'Search'}
          type={'search'}
          value={inputValue}
        />
      </div>
      <ul className={s.usersList}>{!isFetching && <User items={usersList} />}</ul>
    </PageWrapper>
  )
}

export default Search
