import React, { ChangeEvent, Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Return } from '@/assets/icons'
import { ModalkaTrigger } from '@/components/modal'
import { ModalCloseCreatePost } from '@/components/modalCloseCreatePost'
import { CarouselCreatePost } from '@/components/modalCreatePost/CarouselCreatePost'
import { FormCreatePost } from '@/components/modalCreatePost/FormCreatePost'
import { LoadImageFromPCBlock } from '@/components/modalCreatePost/LoadImageFromPCBlock'
import { maxImageSizeBytes } from '@/components/modalCreatePost/consts'
import { useAddIdToArray } from '@/components/modalCreatePost/hook/useAddIdToArray'
import { CreatePostData, createPostSchema } from '@/components/modalCreatePost/schema'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/uikit-temp-replacements/regular-dialog/RegularDialog'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import { useTranslation } from '@/hooks/useTranslation'
import { db } from '@/services/db'
import {
  useCreateImagesPostMutation,
  useCreatePostMutation,
} from '@/services/inctagram.posts.service'
import { Button, Card, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogProps } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import clsx from 'clsx'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'

import s from './modalCreatePost.module.scss'

export type AvatarSelectionDialogProps = {
  trigger: ReactNode
} & DialogProps

export function ModalCreatePost({ onOpenChange, ...props }: AvatarSelectionDialogProps) {
  /**
   * стейт контроля открытия/закрытия модалки создания поста
   */
  const [openModal, setOpenModal] = useState(false)
  /**
   * блокировка кнопки Next, когда открыли редактор фото
   */
  const [isDIsabledNextButton, setIsDIsabledNextButton] = useState(false)
  /**
   * ref для инпута с type=file
   */
  const inputRef = useRef<HTMLInputElement>(null)
  /**
   * ссылка на загруженную картинку с ПК. Нужно для логики отображения/сокрытия редактора фото и других элементов,
   * а также для src самого редактора фото
   */
  const [preview, setPreview] = useState<PreviewStateType>({
    files: [],
    originFiles: [],
    previews: [],
  })
  /**
   * стейт ошибки загрузки с инпута type=file файла большого размера или недопустимого типа
   */
  const [imageError, setImageError] = useState<null | string>(null)
  /**
   * показать модалку подтверждения закрытия основной модалки создания поста. Если на
   * этапе показа формы с описанием поста мы тыкаем вне границ модалки, то срабатывает этот стейт (true) и
   * открывает модалку с подтвержением закрытия
   */
  const [isShowModalConfirmCloseModalCreatePost, setIsShowModalConfirmCloseModalCreatePost] =
    useState(false)
  /**
   * стейт перехода к форме поста после загрузки картинок поста
   */
  const [toLoadForm, setToLoadForm] = useState(false)
  /**
   * стейт перехода к карусели после загрузки картинок с ПК
   */
  const [toLoadImages, setToLoadImages] = useState(false)
  /**
   * интернационализация
   */
  const { t } = useTranslation()

  /**
   * хук RTKQ отправки на сервер описания поста
   */
  const [createPost] = useCreatePostMutation()

  /**
   * хук RTKQ отправки на сервер картинок поста
   */
  const [createImagesPost] = useCreateImagesPostMutation()
  /**
   * Обработчик загрузки файла с инпута type=file. Валидируем на загрузку нужного типа и размера файла - картинка.
   * Сетаем ошибки. Сохраняем сам файл и строковую ссылку на файл.
   * @param e - event onChange input type=file
   */
  const imageSelectHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files

    if (fileList && fileList.length > 0) {
      const fileArray = Array.from(fileList)
      const previewArray: string[] = []
      const arrayFiles: File[] = []

      fileArray.forEach(file => {
        if (!file) {
          console.warn('error getting file from the input')
        }
        if (
          !file.type.includes('png') &&
          !file.type.includes('jpg') &&
          !file.type.includes('jpeg')
        ) {
          //todo fix layout - png and jbg have to be on a new line ('\n doesn't work for some reason')
          //implement dynamic content for locales https://safronman.gitbook.io/next-i18n-rree78-ewe#id-8-dinamicheskii-perevod
          setImageError(t.profile.settings.wrongFileFormat)

          return
        }

        if (file.size >= maxImageSizeBytes) {
          setImageError(t.profile.settings.imageSizeExceeded)

          return
        }

        const newPreview = URL.createObjectURL(file)

        previewArray.push(newPreview)
        arrayFiles.push(file)
      })
      setPreview({ files: arrayFiles, originFiles: arrayFiles, previews: previewArray })
      setToLoadImages(true)
    }
  }
  /**
   * оБработчик клика на инпут с type=file
   */
  const triggerFileInputHandler = () => {
    imageError && setImageError(null)

    if (inputRef.current) {
      inputRef.current.click()
    }
  }
  /**
   * Хелпер очистки стейтов при закрыти модалки создания поста
   */
  const clearStatesCreatePost = () => {
    if (preview.previews.length) {
      preview.previews.forEach(pr => {
        URL.revokeObjectURL(pr)
      })
    }
    imageError && setImageError(null)
    setPreview({ files: [], originFiles: [], previews: [] })
    setToLoadForm(false)
    setToLoadImages(false)
    setOpenModal(false)
    formState.reset()
  }
  /**
   * Обработчик открытия/закрытия модалки создания поста. Если закрываем модалку, то очищаем все стейты,
   * чтобы при повторном открытии не подтягивалось ранее загруженная картинка
   * @param open - контролируемое состояние модалки. На закрытие приходит false, на открытие приходит true
   */
  const openModalHandler = (open: boolean) => {
    if (!open) {
      clearStatesCreatePost()

      return
    }
    setOpenModal(open)
  }
  /**
   * react hook form
   */
  const formState = useForm<CreatePostData>({
    mode: 'onChange',
    resolver: zodResolver(createPostSchema),
  })
  /**
   * обработчик формы создания поста. Если есть данные из формы и есть загруженная ранее картинка поста,
   * то отправляем описание поста и id картинки на сервер. Если запрос успешен, то сбрасываем превью, закрываем
   * вывод формы описания поста и закрываем модалку создания поста
   * @param data - данные из формы (пока что только описание поста)
   */
  const submitFormHandler = async (data: CreatePostData) => {
    if (preview.files.length) {
      const formData = new FormData()

      preview.files.forEach(f => {
        formData.append('file', f)
      })
      const res = await createImagesPost(formData)

      if (res.data) {
        const post = {
          childrenMetadata: res.data.images.map(img => ({ uploadId: img.uploadId })),
          description: data.descriptionPost ?? '',
        }

        await createPost(post)
      }
      await db.draftPost.clear()
      clearStatesCreatePost()
    }
  }
  /**
   * массив для карусели на основе загруженных с ПК картинок, добавляем id
   */
  const carouselArray = useAddIdToArray(preview.previews)
  /**
   * обработчик нажатия на клавишу НАЗАД в хедере модалки создания поста
   */
  const onClickReturnAddPhoto = () => {
    if (toLoadImages) {
      if (preview.previews.length) {
        preview.previews.forEach(pr => {
          URL.revokeObjectURL(pr)
        })
      }
      imageError && setImageError(null)
      setPreview(data => ({ ...data, files: [], previews: [] }))
      setToLoadForm(false)
      setToLoadImages(false)
      formState.reset()
    }
    if (toLoadForm) {
      setToLoadForm(false)
      setToLoadImages(true)
    }
  }
  /**
   * кастомный хук работы с базой indexedDB. Возвращает функции сохранения в базу данных и чтения из базы
   */
  const { getDraftPost, saveDraftPost } = useIndexedDB({
    clearStatesCreatePost,
    formState,
    preview,
    setIsShowModalConfirmCloseModalCreatePost,
    setPreview,
    setToLoadForm,
  })

  /**
   * обраьотчик кнопки NEXT: переход к форме описания поста
   */
  const onClickNextButtonHandler = () => {
    setToLoadImages(false)
    setToLoadForm(true)
  }
  /**
   * Флаг показа/скрытия карусели и блока загрузки фото
   */
  const isPreview = !!preview.previews.length

  return (
    <>
      <Dialog {...props} onOpenChange={openModalHandler} open={openModal}>
        <ModalkaTrigger asChild className={clsx(openModal && s.open)}>
          {props.trigger}
        </ModalkaTrigger>
        <DialogContent
          className={clsx(s.content, preview && toLoadForm && s.widthBig)}
          onInteractOutside={event => {
            event.preventDefault()
            if (preview && toLoadForm) {
              setIsShowModalConfirmCloseModalCreatePost(true)
            }
          }}
        >
          <DialogHeader>
            {(toLoadForm || toLoadImages) && (
              <Button
                className={s.closeButton}
                disabled={isDIsabledNextButton}
                onClick={onClickReturnAddPhoto}
                variant={'text'}
              >
                <Return />
              </Button>
            )}
            <DialogTitle asChild>
              <Typography as={'h1'} variant={'h1'}>
                {!toLoadImages && !toLoadForm && 'Add Photo'}
                {toLoadImages && !toLoadForm && 'Edit Photo'}
                {toLoadForm && 'Publications'}
              </Typography>
            </DialogTitle>
            <VisuallyHidden>
              <DialogDescription>Select image from your computer</DialogDescription>
            </VisuallyHidden>
            {!toLoadForm && !toLoadImages && (
              <DialogClose asChild>
                {/* eslint-disable-next-line max-lines */}
                <Button className={s.closeButton} variant={'text'}>
                  <CloseIcon />
                </Button>
              </DialogClose>
            )}
            {isShowModalConfirmCloseModalCreatePost && (
              <ModalCloseCreatePost
                clearParentStates={clearStatesCreatePost}
                saveDraftPost={saveDraftPost}
                showModal={setIsShowModalConfirmCloseModalCreatePost}
                title={'Close'}
              >
                <Typography as={'span'} className={s.questionConfirm} variant={'regular16'}>
                  Do you really want to close the creation of a publication? <br /> If you close
                  everything will be deleted
                </Typography>
              </ModalCloseCreatePost>
            )}
            {isPreview && toLoadForm && (
              <Button className={s.publisheButton} form={'submitPostForm'} variant={'text'}>
                <Typography variant={'h3'}>Publish</Typography>
              </Button>
            )}
            {toLoadImages && (
              <Button
                className={s.publisheButton}
                disabled={isDIsabledNextButton || !!imageError}
                onClick={onClickNextButtonHandler}
                variant={'text'}
              >
                <Typography variant={'h3'}>Next</Typography>
              </Button>
            )}
          </DialogHeader>

          <div style={{ height: 'calc(100% - 61px)', position: 'relative' }}>
            <LoadImageFromPCBlock
              getDraftPost={getDraftPost}
              imageError={imageError}
              isPreview={isPreview}
              multiple
              onChange={imageSelectHandler}
              ref={inputRef}
              triggerFileInput={triggerFileInputHandler}
            />
            {isPreview && (
              <Card className={s.cardPost} variant={'dark300'}>
                {(toLoadImages || toLoadForm) && (
                  <CarouselCreatePost
                    imagesPost={carouselArray}
                    loadedFiles={preview.originFiles}
                    setDisabledNextButton={setIsDIsabledNextButton}
                    setFile={setPreview}
                    toLoadForm={toLoadForm}
                    toLoadImages={toLoadImages}
                  />
                )}
                {toLoadForm && (
                  <FormCreatePost formState={formState} submitForm={submitFormHandler} />
                )}
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export type PreviewStateType = { files: File[]; originFiles: File[]; previews: string[] }
export type SetPreviewStateType = Dispatch<SetStateAction<PreviewStateType>>
