import React, { ReactNode, memo, useState } from 'react'

import { Close } from '@/assets/icons/close'
import { Followers } from '@/components/ModalFollowers/Followers'
import { SearchInputValueType } from '@/components/ModalFollowers/types'
import {
  Modalka,
  ModalkaButtonCancel,
  ModalkaContent,
  ModalkaTitle,
  ModalkaTrigger,
} from '@/components/modal'
import { useDebounceText } from '@/hooks/useDebounceText'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { useGetFollowersUsersQuery } from '@/services/inctagram.followings.service'
import { Button, Card, TextField, Typography } from '@chrizzo/ui-kit'

import s from './modalFollowers.module.scss'
import style from '@/components/ModalFollowers/modalFollowers.module.scss'

type Props = {
  callbackTrigger?: () => void
  className?: string
  followersCount?: number | string
  isMyProfile: boolean
  trigger?: ReactNode
  userName: string | undefined
}

export const ModalFollowers = memo(
  ({ callbackTrigger, followersCount, isMyProfile, trigger, userName }: Props) => {
    /**
     * кастомный хук контроля ширины окна
     */
    const windowWidth = useWindowWidth()
    /**
     * хук useState для управления open/close AlertDialog.Root. Нужен для того,
     * чтобы модалка закрывалась после передачи на сервер данных из формы,
     * иначе она просто закрывается и данные не передаются
     */
    const [open, setOpen] = useState(false)
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
      <Modalka onOpenChange={setOpen} open={isMyProfile ? open : false}>
        <ModalkaTrigger asChild>
          <div
            className={style.followers}
            onClick={() => (callbackTrigger ? callbackTrigger() : {})}
          >
            <Typography variant={windowWidth > 360 ? 'regularBold14' : 'smallSemiBold'}>
              {followersCount}
            </Typography>
            <Typography variant={windowWidth > 360 ? 'regular14' : 'small'}>Followers</Typography>
          </div>
        </ModalkaTrigger>
        <ModalkaContent className={s.content}>
          <ModalkaTitle className={s.title}>
            <Typography variant={'h1'}>{followersCount} Followers</Typography>
            <ModalkaButtonCancel asChild>
              <Button className={s.close} variant={'text'}>
                <Close />
              </Button>
            </ModalkaButtonCancel>
          </ModalkaTitle>
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
        </ModalkaContent>
      </Modalka>
    )
  }
)
