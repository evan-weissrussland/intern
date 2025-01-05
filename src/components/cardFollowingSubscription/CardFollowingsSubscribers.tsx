import { useState } from 'react'

import { SearchInputValueType } from '@/components/ModalFollowers/types'
import { Followings } from '@/components/cardFollowingSubscription/Followings'
import { useDebounceText } from '@/hooks/useDebounceText'
import { useGetFollowingUsersQuery } from '@/services/inctagram.followings.service'
import { Card, TextField } from '@chrizzo/ui-kit'

import s from './cardFollowingSub.module.scss'

type Props = {
  isMyProfile: boolean
  open: boolean
  userName: string | undefined
}
export const CardFollowingsSubscribers = ({ isMyProfile, open, userName }: Props) => {
  /**
   * стэйт поиска юзеров, на которых подписан. seach - передаём в value инпута. textFromDebounceInput - текст поиска
   * для отправки с запросом на сервер (отображается с выдеркой времени, чтобы не отправлять на сервер каждый
   * вводимый символ)
   */
  const [inputValue, setInputValue] = useState<SearchInputValueType>({
    search: '',
    textFromDebounceInput: '',
  })

  /**
   * хук RTKQ. запрос за юзерами, на которых подписан. params - это query-параметры, username используется, как uri.
   * skip - пока модальное окно юзеров, на которых подписан, не открыто или это не мой аккаунт, не делаем запрос
   */
  const { data, isFetching: isFetchingGetFollowing } = useGetFollowingUsersQuery(
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
      <ul className={s.followingWrapper}>
        {!isFetchingGetFollowing && <Followings items={data?.items} />}
      </ul>
    </Card>
  )
}
