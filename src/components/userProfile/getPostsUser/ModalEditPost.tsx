import React, { Dispatch, SetStateAction, useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Close } from '@/assets/icons/close'
import { FormTextArea } from '@/components/controll/FormTextArea'
import { Modalka, ModalkaButtonCancel, ModalkaContent, ModalkaTitle } from '@/components/modal'
import { CreatePostData, createPostSchema } from '@/components/modalCreatePost/schema'
import { useUpdatePostMutation } from '@/services/inctagram.posts.service'
import { Post } from '@/services/inctagram.public-posts.service'
import { Button, Card, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'

import s from '@/components/userProfile/getPostsUser/modalEditPost.module.scss'

import defaultAva from '../../../../public/defaultAva.jpg'
import { ModalConfirmCloseEditPost } from '../../modalConfirmCloseEditPost'

type Props = {
  post: Post
  setEditModalPost: Dispatch<SetStateAction<boolean>>
}
export const ModalEditPost = ({ post, setEditModalPost }: Props) => {
  /**
   * react hook form
   */
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<CreatePostData>({
    mode: 'onChange',
    resolver: zodResolver(createPostSchema),
  })

  const textAreaValue = watch('descriptionPost')
  /**
   * открыть/закрыть модальное окно Confirm Edit post
   */
  const [isShowModalConfirmEditPost, setIsShowModalConfirmEditPost] = useState(false)

  const [updatePost] = useUpdatePostMutation()

  const submitFormHandler = async (data: CreatePostData) => {
    const editedPost = {
      body: { description: data.descriptionPost ?? '' },
      postId: post.id,
    }

    await updatePost(editedPost)
    setEditModalPost(false)
  }

  useLayoutEffect(() => {
    setValue('descriptionPost', post.description)
  }, [])
  /**
   * запрос на сервер: обновить пост
   */
  const closeModalEditPostHandler = () => {
    setEditModalPost(false)
  }

  return (
    <Modalka onOpenChange={() => {}} open>
      <ModalkaContent
        aria-describedby={undefined}
        className={s.content}
        onInteractOutside={event => {
          event.preventDefault()
          setIsShowModalConfirmEditPost(true)
        }}
      >
        <ModalkaTitle className={s.title}>
          <Typography variant={'h1'}>Edit Post</Typography>
          <ModalkaButtonCancel asChild>
            <Button
              className={s.close}
              onClick={() => setIsShowModalConfirmEditPost(true)}
              variant={'text'}
            >
              <Close />
            </Button>
          </ModalkaButtonCancel>
        </ModalkaTitle>
        <Card className={s.cardWr} variant={'dark300'}>
          <div className={s.imgWr}>
            <Image alt={''} className={s.img} fill src={post.images[0]?.url ?? defaultAva} />
          </div>
          <form className={s.form} id={'submitPostForm'} onSubmit={handleSubmit(submitFormHandler)}>
            <div className={s.avaUserNameBlock}>
              <img alt={'ava'} height={36} src={post?.avatarOwner ?? defaultAva.src} width={36} />
              <Typography variant={'h3'}>{post?.userName ?? 'No UserName'}</Typography>
            </div>
            <div className={s.textAreaWrapper}>
              <FormTextArea
                className={s.textArea}
                control={control}
                errorMessage={errors.descriptionPost?.message}
                label={'Add publication descriptions'}
                maxLength={500}
                name={'descriptionPost'}
                placeholder={'Description post'}
              />
              <p className={s.countDescriptionPost}>{textAreaValue?.length ?? 0}/500</p>
            </div>
            <Button className={s.saveButton} type={'submit'}>
              <Typography variant={'h3'}>Save Changes</Typography>
            </Button>
          </form>
          {isShowModalConfirmEditPost && (
            <ModalConfirmCloseEditPost
              callback={closeModalEditPostHandler}
              closeThisModal={setIsShowModalConfirmEditPost}
              title={'Close Post'}
            >
              <Typography as={'span'} variant={'regular16'}>
                Do you really want to close the edition of the publication? If you close changes
                won’t be saved?
              </Typography>
            </ModalConfirmCloseEditPost>
          )}
        </Card>
      </ModalkaContent>
    </Modalka>
  )
}
