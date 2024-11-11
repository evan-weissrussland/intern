import { ReactNode, memo, useState } from 'react'

import { Close } from '@/assets/icons/close'
import { SearchInputValueType } from '@/components/ModalFollowers/types'
import { useDebounceFollowers } from '@/components/ModalFollowers/useDebounceFollowers'
import {
  Modalka,
  ModalkaButtonCancel,
  ModalkaContent,
  ModalkaTitle,
  ModalkaTrigger,
} from '@/components/modal'
import { LikesList } from '@/components/modalLikesPost/LikesList'
import { useGetUsersWhoLikedPostQuery } from '@/services/inctagram.posts.service'
import { Button, Card, TextField, Typography } from '@chrizzo/ui-kit'

import s from './modalLikesPost.module.scss'

type Props = {
  children: ReactNode
  className?: string
  postId: number
  title?: string | undefined
}

export const ModalLikesPost = memo(({ children, postId, title }: Props) => {
  /**
   * хук useState для управления open/close Dialog.Root. Нужен для того,
   * чтобы модалка закрывалась после передачи на сервер данных из формы,
   * иначе она просто закрывается и данные не передаются
   */
  const [open, setOpen] = useState(false)
  /**
   * стэйт поиска подписчиков. search - передаём в value инпута. textFromDebounceInput - текст поиска для отправки с
   * запросом на сервер (отображается с выдержкой времени, чтобы не отправлять на сервер каждый вводимый символ)
   */
  const [inputValue, setInputValue] = useState<SearchInputValueType>({
    search: '',
    textFromDebounceInput: '',
  })

  /**
   * хук RTKQ. запрос за лайками поста. params - это query-параметры, username используется, как uri.
   * skip - пока модальное окно подписчиков не открыто или это не мой аккаунт, не делаем запрос
   */
  const { data, isFetching: isFetchingGetLikedUsers } = useGetUsersWhoLikedPostQuery(
    {
      params: { search: inputValue.textFromDebounceInput },
      postId: postId,
    },
    { skip: !open }
  )

  /**
   * функция задержки посыла текста из инпута на сервер (debounce)
   * @param inputData - текст из инпута
   */
  const onChangeInputValue = useDebounceFollowers(setInputValue)

  return (
    <Modalka onOpenChange={setOpen} open={open}>
      <ModalkaTrigger asChild>{children}</ModalkaTrigger>
      <ModalkaContent className={s.content}>
        <ModalkaTitle className={s.title}>
          <Typography variant={'h1'}>{title}</Typography>
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
          <ul className={s.likesWrapper}>
            {!isFetchingGetLikedUsers && <LikesList items={data?.items} />}
          </ul>
        </Card>
      </ModalkaContent>
    </Modalka>
  )
})
