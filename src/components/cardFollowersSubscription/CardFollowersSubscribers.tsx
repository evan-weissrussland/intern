import React, { useState } from 'react'

import { Followers } from '@/components/cardFollowersSubscription/Followers'
import { SearchInputValueType } from '@/components/modalFollowers/types'
import { useDebounceText } from '@/hooks/useDebounceText'
import { useGetFollowersUsersQuery } from '@/services/inctagram.followings.service'
import { Card, TextField } from '@chrizzo/ui-kit'

import s from './cardFollowersSub.module.scss'

type Props = {
  isMyProfile: boolean
  open: boolean
  userName: string | undefined
}
export const CardFollowersSubscribers = ({ isMyProfile, open, userName }: Props) => {
  /**
   * стэйт поиска подписчиков. seach - передаём в value инпута. textFromDebounceInput - текст поиска для отправки с
   * запросом на сервер (отображается с выдеркой времени, чтобы не отправлять на сервер каждый вводимый символ)
   */
  const [inputValue, setInputValue] = useState<SearchInputValueType>({
    search: '',
    textFromDebounceInput: '',
  })

  /**
   * хук RTKQ. запрос за подписчиками. params - это query-параметры, username используется, как uri.
   * skip - пока модальное окно подписчиков не открыто или это не мой аккаунт, не делаем запрос
   */
  const { data, isFetching: isFetchingGetFollowers } = useGetFollowersUsersQuery(
    {
      params: { search: inputValue.textFromDebounceInput },
      username: userName,
    },
    { skip: !open || !isMyProfile }
  )

  /**
   * функция задержки посыла текста из инпута на сервер (debounce)
   * @param inputData - текст из инпута
   */
  const onChangeInputValue = useDebounceText(setInputValue)

  return (
    <Card className={s.card} maxWidth={'644px'} variant={'dark300'}>
      <TextField
        onValueChange={onChangeInputValue}
        placeholder={'Search'}
        type={'search'}
        value={inputValue.search}
      />
      <ul className={s.followersWrapper}>
        {!isFetchingGetFollowers && <Followers items={data?.items} />}
      </ul>
    </Card>
  )
}
