import React, { Dispatch, SetStateAction } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { PreviewStateType, SetPreviewStateType } from '@/components/modalCreatePost'
import { CreatePostData } from '@/components/modalCreatePost/schema'
import { Toast } from '@/components/toast/Toast'
import { DraftCreatePost, db } from '@/services/db'
import { toast } from 'sonner'

import s from '@/components/toast/toast.module.scss'

type Props = {
  clearStatesCreatePost: () => void
  formState: UseFormReturn<CreatePostData>
  preview: PreviewStateType
  setIsShowModalConfirmCloseModalCreatePost: Dispatch<SetStateAction<boolean>>
  setPreview: SetPreviewStateType
  setToLoadForm: Dispatch<SetStateAction<boolean>>
}
export const useIndexedDB = ({
  clearStatesCreatePost,
  formState,
  preview,
  setIsShowModalConfirmCloseModalCreatePost,
  setPreview,
  setToLoadForm,
}: Props) => {
  /**
   * сохранить черновик поста
   */
  async function saveDraftPost() {
    try {
      await db.draftPost.put({
        description: formState.getValues().descriptionPost ?? '',
        id: 1,
        photo: preview.files,
      })
      toast.custom(
        jsx => (
          <Toast onDismiss={() => toast.dismiss(jsx)} title={'Post has been saved successfully'} />
        ),
        {
          className: s.succesToast,
          duration: 5000,
        }
      )
      clearStatesCreatePost()
      setIsShowModalConfirmCloseModalCreatePost(false)
      formState.reset()
    } catch (error) {
      toast.custom(
        jsx => (
          <Toast onDismiss={() => toast.dismiss(jsx)} title={"Error. Post can't been saved"} />
        ),
        {
          className: s.errorToast,
          duration: 5000,
        }
      )
    }
  }

  /**
   * вытянуть из IndexedDB черновик поста
   */
  const getDraftPost = async () => {
    try {
      const draft: DraftCreatePost | undefined = await db.draftPost.get(1) // Здесь 1 — это предполагаемый ID

      if (draft) {
        const previewArray = [] as string[]

        draft.photo.forEach(file => {
          const newPreview = URL.createObjectURL(file)

          previewArray.push(newPreview)
        })

        setPreview(data => ({ ...data, files: draft.photo, previews: previewArray }))
        formState.setValue('descriptionPost', draft.description)
        setToLoadForm(true)
      } else {
        toast.custom(
          jsx => <Toast onDismiss={() => toast.dismiss(jsx)} title={'Draft is empty'} />,
          {
            className: s.errorToast,
            duration: Infinity,
          }
        )
      }
    } catch (error) {
      console.error('Ошибка при получении черновика:', error)
    }
  }

  return { getDraftPost, saveDraftPost }
}
