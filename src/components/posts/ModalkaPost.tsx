import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Close } from '@/assets/icons/close'
import {
  Modalka,
  ModalkaButtonCancel,
  ModalkaContent,
  ModalkaTitle,
  ModalkaTrigger,
} from '@/components/modal'
import { ModalConfirmDeletePost } from '@/components/modalConfirmDeletePost'
import { CarouselImagesPost } from '@/components/posts/CarouselImagesPost'
import { CommentsWrapper } from '@/components/posts/comments/CommentsWrapper'
import { useDeletePostMutation } from '@/services/inctagram.posts.service'
import { Post } from '@/services/inctagram.public-posts.service'
import { Button, Card, Typography } from '@chrizzo/ui-kit'
import { useRouter } from 'next/router'

import s from '@/pages/posts.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  post: Post
  setEditModalPost: Dispatch<SetStateAction<boolean>>
}

const ModalkaPost = ({ post, setEditModalPost }: Props) => {
  const router = useRouter()
  const queryParams = router.query
  /**
   * открыть/закрыть модальное окно Confirm Delete
   */
  const [isShowModalConfirmDeletePost, setIsShowModalConfirmDeletePost] = useState(false)
  /**
   * Удалить пост
   */
  const [deletePost] = useDeletePostMutation()
  /**
   * хук useState для управления open/close Dialog.Root. Нужна только для skip'а запроса за
   * комментариями, если модалка не открыта. В компоненте Modalka можно не использовать
   */
  const [open, setOpen] = useState(Number(queryParams.postId) === post.id)

  /**
   * добавляем query-параметры в url. А именно id открытого поста. Это нужно, чтобы, когды мы открыли модалку
   * поста, в url появился id этого поста. Далее мы можем скопировать url и переслать другу. Он перейдёт
   * по нашей ссылке и у него откроется модалка поста автоматически. Без id в url при переходе по ссылку,
   * как понять, модалку какого поста открыть, ведь подгрузится страница пользователя с несколькими постами?
   * При закрытии модалки, убираем query-параметры.
   */
  useEffect(() => {
    if (open && !queryParams.postId) {
      router.replace({
        pathname: router.asPath,
        query: { postId: post.id },
      })
    }
    if (!open && Number(queryParams.postId) === post.id) {
      router.replace({
        pathname: `${post.ownerId}`,
      })
    }
  }, [open])

  /**
   * показать модалку-подтверждения удаления поста
   */
  const showModalConfirmDeletePostHandler = () => {
    setIsShowModalConfirmDeletePost(true)
  }

  /**
   * запрос на сервер: удалить пост
   */
  const deletePostHandler = () => {
    deletePost(post.id)
  }

  return (
    <>
      <Modalka onOpenChange={setOpen} open={open}>
        <ModalkaTrigger asChild>
          <img
            alt={'avatar'}
            height={post?.images[0]?.height}
            src={post?.images[0]?.url ?? defaultAva.src}
            width={post?.images[0]?.width}
          />
        </ModalkaTrigger>
        <ModalkaContent
          aria-describedby={undefined}
          className={s.contentPost}
          onInteractOutside={event => {
            event.preventDefault()
          }}
        >
          <ModalkaTitle className={s.title}>
            <ModalkaButtonCancel asChild>
              <Button variant={'text'}>
                <Close />
              </Button>
            </ModalkaButtonCancel>
          </ModalkaTitle>
          <Card className={s.card} variant={'dark300'}>
            <CarouselImagesPost images={post?.images} />
            <CommentsWrapper
              callback={showModalConfirmDeletePostHandler}
              open={open}
              post={post}
              setEditModalPost={setEditModalPost}
            />
          </Card>
        </ModalkaContent>
      </Modalka>
      {isShowModalConfirmDeletePost && (
        <ModalConfirmDeletePost
          callback={deletePostHandler}
          closeThisModal={() => setIsShowModalConfirmDeletePost(false)}
          title={'Delete Post'}
        >
          <Typography as={'span'} variant={'regular16'}>
            Are you sure you want to delete this post?
          </Typography>
        </ModalConfirmDeletePost>
      )}
    </>
  )
}

export default ModalkaPost
