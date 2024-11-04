import React from 'react'
import { UseFormReturn } from 'react-hook-form'

import { FormTextArea } from '@/components/controll/FormTextArea'
import { CreatePostData } from '@/components/modalCreatePost/schema'
import { useGetMyProfileQuery } from '@/services/inctagram.profile.service'
import { Typography } from '@chrizzo/ui-kit'

import s from '@/components/modalCreatePost/modalCreatePost.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  formState: UseFormReturn<CreatePostData>
  submitForm: (data: CreatePostData) => void
}
export const FormCreatePost = ({ formState, submitForm }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = formState
  /**
   * Запрос на своим профилем юзера для отображения вытягивания аватарки и userName
   */
  const { data: profile } = useGetMyProfileQuery()
  /**
   * контроль за данными из поля даты рождения
   */
  const textAreaValue = watch('descriptionPost')

  return (
    <form className={s.form} id={'submitPostForm'} onSubmit={handleSubmit(submitForm)}>
      <div className={s.avaUserNameBlock}>
        <img alt={'ava'} height={36} src={profile?.avatars[1]?.url ?? defaultAva.src} width={36} />
        <Typography variant={'h3'}>{profile?.userName}</Typography>
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
    </form>
  )
}
