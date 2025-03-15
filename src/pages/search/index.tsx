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
  /**
   * сохраняем и отображаем юзеров с сервера
   */
  const [usersList, setUserList] = useState<UsersType[]>([])
  /**
   * сохраняем и отображаем юзеров с локалсторэйджа (ранее посещённых именно со страницы search)
   */
  const [usersListFromStorage, setUserListFromStorage] = useState<UsersType[]>([])
  /**
   * флаг оторажения надписи Recent
   */
  const [showRecent, setShowRecent] = useState(true)
  /**
   * запрос за профилями юзеров
   */
  const [getProfileUsers, { data, isFetching }] = useLazyGetProfileUsersQuery()
  /**
   * обработчик нажатия на Enter отправляет запрос за юзерами, если в инпуте не пусто. Скрывает надписб "Recent"
   */
  const onKeyDown = () => {
    if (inputValue.trim()) {
      getProfileUsers({ search: inputValue })
        .unwrap()
        .then(() => {
          setShowRecent(false)
        })
    }
  }
  /**
   * обработчик ввода в инпут. Если пустая строка (очистили инпут клавишей удалить или крестиком инпута),
   * то очищаем массив юзеров, иначе остаётся массив предыдущего запроса. Также показываем надпись "Recent"
   * @param value - строка из инпута
   */
  const onChangeSearchInputHandler = (value: string) => {
    if (!value) {
      setUserList([])
      setShowRecent(true)
    }
    setInputValue(value)
  }

  /**
   * сетаем массив юзеров с сервера для отображения на экране
   */
  useEffect(() => {
    if (data) {
      setUserList(data?.items)
    }
  }, [data, isFetching])

  /**
   * сетаем массив юзеров с локалсторэйджа при первом заходе на страницу. Это юзеры, которых мы раньше искали
   * и переходили на их страницу профиля именно со страницы search
   */
  useEffect(() => {
    const usersListFromLocalStorage = localStorage.getItem('searchedProfileUsersList')

    if (usersListFromLocalStorage) {
      const parsedUsersList: UsersType[] = JSON.parse(usersListFromLocalStorage)

      setUserListFromStorage(parsedUsersList)
    }
  }, [])

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
        {showRecent && (
          <Typography className={s.recent} variant={'regularBold16'}>
            Recent requests
          </Typography>
        )}
      </div>
      <ul className={s.usersList}>{!isFetching && <User items={usersList} />}</ul>
      {!usersList.length && !!usersListFromStorage.length && showRecent && (
        <>
          <ul className={s.usersList}>
            <User items={usersListFromStorage} />
          </ul>

          {!usersListFromStorage.length && (
            <div className={s.emptyPlaceTitle}>
              <Typography variant={'regularBold14'}>Oops! This place looks empty!</Typography>
              <Typography variant={'small'}>No recent requests</Typography>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  )
}

export default Search
