import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Return } from '@/assets/icons'
import { Toast } from '@/components/layouts/Toast'
import { ModalTrigger } from '@/components/modal'
import { ModalCloseCreatePost } from '@/components/modal-close-create-post'
import { CarouselCreatePost } from '@/components/modalCreatePost/CarouselCreatePost'
import { FormCreatePost } from '@/components/modalCreatePost/FormCreatePost'
import { LoadImageFromPCBlock } from '@/components/modalCreatePost/LoadImageFromPCBlock'
import { CreatePostData, createPostSchema } from '@/components/modalCreatePost/schema'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/uikit-temp-replacement/regular-dialog/RegularDialog'
import { useTranslation } from '@/hooks/useTranslation'
import { db } from '@/services/db'
import { useCreatePostMutation } from '@/services/incta-team-api/posts/posts-service'
import { useGetProfileQuery } from '@/services/incta-team-api/profile/profile-service'
import { Button, Card, Typography } from '@chrizzo/ui-kit'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogProps } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import clsx from 'clsx'
import { liveQuery } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'
import { toast } from 'sonner'

import s from './modalCreatePost.module.scss'

const BYTES_IN_MB = 1024 * 1024
const IMAGE_SIZE_MAX_MB = 10

const maxImageSizeBytes = BYTES_IN_MB * IMAGE_SIZE_MAX_MB

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
   * Запрос на своим профилем юзера для отображения вытягивания userName
   */
  const { data: profile } = useGetProfileQuery({ id: 'q1' }, { skip: !openModal })
  /**
   * ref для инпута с type=file
   */
  const inputRef = useRef<HTMLInputElement>(null)
  /**
   * ссылка на загруженную картинку с ПК. Нужно для логики отображения/сокрытия редактора фото и других элементов,
   * а также для src самого редактора фото
   */
  const [preview, setPreview] = useState<{ file: File[]; preview: string[] }>({
    file: [],
    preview: [],
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

          return
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
      setPreview({ ...preview, file: arrayFiles, preview: previewArray })
      setToLoadImages(true)
    }
  }
  /**
   * оБработчик клика на инпут с type=file
   */
  const triggerFileInputHandler = () => {
    imageError && setImageError(null)

    if (!inputRef.current) {
      return
    }
    inputRef.current.click()
  }
  /**
   * Хелпер очистки стейтов при закрыти модалки создания поста
   */
  const clearStatesCreatePost = () => {
    if (preview.preview.length) {
      preview.preview.forEach(pr => {
        URL.revokeObjectURL(pr)
      })
    }
    imageError && setImageError(null)
    setPreview({ file: [], preview: [] })
    setToLoadForm(false)
    setToLoadImages(false)
    setOpenModal(false)
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
   * обработчик формы создания поста. Если есть данные из формы и есть загруженная ранее картинка поста,
   * то отправляем описание поста и id картинки на сервер. Если запрос успешен, то сбрасываем превью, закрываем
   * вывод формы описания поста и закрываем модалку создания поста
   * @param data - данные из формы (пока что только описание поста)
   */
  const submitFormHandler = async (data: CreatePostData) => {
    if (preview.file.length) {
      const formData = new FormData()

      preview.file.forEach(f => {
        formData.append('image', f)
      })
      formData.append('description', data.descriptionPost as string)

      await createPost(formData)
      await db.draftPost.clear()
      clearStatesCreatePost()
    }
  }
  /**
   * массив для карусели на основе загруженных с ПК картинок, добавляем id
   */
  const carouselArray = preview.preview.map((pr, i) => {
    return { id: Math.random() + i, url: pr }
  })
  /**
   * обработчик нажатия на клавишу НАЗАД в хедере модалки создания поста
   */
  const onclickReturnAddPhoto = () => {
    if (toLoadImages) {
      if (preview.preview.length) {
        preview.preview.forEach(pr => {
          URL.revokeObjectURL(pr)
        })
      }
      imageError && setImageError(null)
      setPreview({ file: [], preview: [] })
      setToLoadForm(false)
      setToLoadImages(false)
    }
    if (toLoadForm) {
      setToLoadForm(false)
      setToLoadImages(true)
    }
  }

  /**
   * react hook form
   */
  const formState = useForm<CreatePostData>({
    mode: 'onChange',
    resolver: zodResolver(createPostSchema),
  })

  /**
   * сохранить черновик поста
   */
  async function saveDraftPost() {
    try {
      await db.draftPost.put({
        description: formState.getValues().descriptionPost ?? '',
        id: 1,
        photo: preview.file,
      })
      toast.custom(
        toast => <Toast text={'Post has been saved successfully'} variant={'success'} />,
        {
          duration: 5000,
        }
      )
      clearStatesCreatePost()
      setIsShowModalConfirmCloseModalCreatePost(false)
      formState.reset()
    } catch (error) {
      toast.custom(toast => <Toast text={"Error. Post can't been saved"} variant={'error'} />, {
        duration: 5000,
      })
    }
  }

  const getDraftPost = async () => {
    try {
      const draft = await db.draftPost.get(1) // Здесь 1 — это предполагаемый ID

      if (draft) {
        const previewArray = [] as string[]

        draft.photo.forEach(file => {
          const newPreview = URL.createObjectURL(file)

          previewArray.push(newPreview)
        })

        setPreview({ file: draft.photo, preview: previewArray })
        formState.setValue('descriptionPost', draft.description)
        setToLoadForm(true)
      } else {
        toast.custom(toast => <Toast text={'Draft is empty'} variant={'info'} />, {
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Ошибка при получении черновика:', error)
    }
  }

  return (
    <>
      <Dialog {...props} onOpenChange={openModalHandler} open={openModal}>
        <ModalTrigger asChild className={clsx(openModal && s.open)}>
          {props.trigger}
        </ModalTrigger>
        <DialogContent
          className={clsx(s.content, toLoadForm && s.widthBig)}
          onInteractOutside={event => {
            event.preventDefault()
            if (preview && toLoadForm) {
              setIsShowModalConfirmCloseModalCreatePost(true)
            }
          }}
        >
          <DialogHeader>
            {(toLoadForm || toLoadImages) && (
              <Button className={s.closeButton} onClick={onclickReturnAddPhoto} variant={'text'}>
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
            {preview && toLoadForm && (
              <Button className={s.publisheButton} form={'submitPostForm'} variant={'text'}>
                <Typography variant={'h3'}>Publish</Typography>
              </Button>
            )}
            {toLoadImages && (
              <Button
                className={s.publisheButton}
                disabled={isDIsabledNextButton || !!imageError}
                onClick={() => {
                  setToLoadImages(false)
                  setToLoadForm(true)
                }}
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
              isPreview={!!preview.preview.length}
              onChange={imageSelectHandler}
              ref={inputRef}
              triggerFileInput={triggerFileInputHandler}
            />
            {!!preview.preview.length && (
              <Card className={s.cardPost} variant={'dark300'}>
                {(toLoadImages || toLoadForm) && (
                  <CarouselCreatePost
                    imagesPost={carouselArray}
                    setDisabledNextButton={setIsDIsabledNextButton}
                    setFile={setPreview}
                    toLoadForm={toLoadForm}
                    toLoadImages={toLoadImages}
                  />
                )}
                {toLoadForm && (
                  <FormCreatePost
                    formState={formState}
                    submitForm={submitFormHandler}
                    userName={profile?.userName}
                  />
                )}
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
