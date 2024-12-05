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
import { LikesList } from '@/components/modalLikes/LikesList'
import { useModalSearch } from '@/hooks/useModalSearch'
import { Button, Card, TextField, Typography } from '@chrizzo/ui-kit'

import s from './modalLikes.module.scss'

type Props = {
  answerId?: number
  children: ReactNode
  className?: string
  commentId?: number
  postId: number
  title?: string | undefined
  xType: 'answer' | 'comment' | 'post'
}

export const ModalLikes = memo(({ children, postId, title, xType }: Props) => {
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
   * кастомный хук запросов за списком юзеров, лайкнувших пост или комментарий, или ответ к коментарию
   */
  const { isFetching, list } = useModalSearch({
    inputValue: inputValue.textFromDebounceInput,
    open,
    postId,
    xType,
  })
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
            {/*{!isFetchingGetLikedUsers && <LikesList items={data?.items} />}*/}
            {!isFetching && <LikesList items={list?.items} />}
          </ul>
        </Card>
      </ModalkaContent>
    </Modalka>
  )
})
