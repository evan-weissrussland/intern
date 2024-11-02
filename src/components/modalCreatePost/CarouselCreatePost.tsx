import React, { Dispatch, SetStateAction, useState } from 'react'

import { NextCarousel, PrevCarousel } from '@/assets/icons'
import { PhotoEditorForCreatePost } from '@/components/modalCreatePost/PhotoEditorForCreatePost'
import { useDotButton } from '@/hooks/useDotCarousel'
import { Button } from '@chrizzo/ui-kit'
import { PinturaDefaultImageWriterResult } from '@pqina/pintura'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import s from '@/components/modalCreatePost/modalCreatePost.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type CarouselProps = {
  imagesPost: { id: number; url: string }[]
  setDisabledNextButton: Dispatch<SetStateAction<boolean>>
  setFile: Dispatch<SetStateAction<{ file: File[]; preview: string[] }>>
  toLoadForm: boolean
  toLoadImages: boolean
}
export const CarouselCreatePost = ({
  imagesPost,
  setDisabledNextButton,
  setFile,
  toLoadForm,
  toLoadImages,
}: CarouselProps) => {
  /**
   * массив картинок в виде ссылок для src карусели и редактора фото
   */
  const [preview, setPreview] = useState(imagesPost)
  /**
   * флаг загрузки картинки в редактор фото
   */
  const [isEditPhoto, setIsEditPhoto] = useState(false)
  /**
   * хук из библиотеки карусели для контента модалки (там, где большое изображение нужно прокручивать)
   */
  const [emblaRefBig, emblaApiBig] = useEmblaCarousel()
  /**
   * кастомный хук для точек перехода к слайдам карусели для контента модалки  (там, где большое
   * изображение нужно прокручивать)
   */
  const {
    onDotButtonClick: onDotButtonClickBig,
    scrollSnaps: scrollSnapsBig,
    selectedIndex: selectedIndexBig,
  } = useDotButton(emblaApiBig)
  /**
   * массив images поста для карусели
   */
  const imagesPostArray = preview?.map((image: any) => {
    return (
      <div className={s.emblaSlide} key={image.id}>
        <div className={s.postImage}>
          <Image alt={'image'} fill priority src={image.url ?? defaultAva.src} />
        </div>
      </div>
    )
  })

  /**
   * коллбэк события onProcess (событие сохранения отредактированной картинки поста) из редактора фото.
   * В исходном массиве картинок заменяем исходную ссылку на картинку на ссылку отредактированной картинки. Это
   * для отображения отредактированной картинки в карусели.
   * А также в родительской компоненте в массиве загруженных с ПК файлов заменяем исходный файл
   * картинки на файл отредактированной картинки. Это для отправки на сервер
   * файла отредактированной картинки, иначе на сервер пойдёт файл исходной картинки.
   * @param dest - File отредактированный
   */
  const loadEditedImageHandler = async ({ dest }: PinturaDefaultImageWriterResult) => {
    const newPreview = URL.createObjectURL(dest)

    const editedArray = preview.map((pr, i) =>
      i === selectedIndexBig ? { ...pr, url: newPreview } : pr
    )

    setFile(data => {
      return { ...data, file: data.file.map((f, i) => (i === selectedIndexBig ? dest : f)) }
    })
    setPreview(editedArray)
    setIsEditPhoto(false)
    setDisabledNextButton(false)
  }

  return (
    <div className={clsx(s.postImageContent, toLoadImages && s.fullWidth)}>
      {!isEditPhoto && (
        <>
          <div className={s.embla} ref={emblaRefBig}>
            <div className={s.emblaContainer}> {imagesPostArray}</div>
          </div>

          {!toLoadForm && (
            <span className={s.button} onClick={() => setIsEditPhoto(true)} role={'button'}>
              edit
            </span>
          )}

          <Button
            className={s.prevModalButton}
            onClick={() => {
              emblaApiBig?.scrollPrev()
            }}
            type={'button'}
          >
            <PrevCarousel height={'48'} width={'48'} />
          </Button>
          <Button
            className={s.nextModalButton}
            onClick={() => {
              emblaApiBig?.scrollNext()
            }}
            type={'button'}
          >
            <NextCarousel height={'48'} width={'48'} />
          </Button>
          <div className={s.dotes}>
            {scrollSnapsBig.map((_, index) => (
              <div
                className={clsx(s.dote, index === selectedIndexBig && s.activeDot)}
                key={index}
                onClick={() => onDotButtonClickBig(index)}
              ></div>
            ))}
          </div>
        </>
      )}
      {isEditPhoto && (
        <PhotoEditorForCreatePost
          callback={loadEditedImageHandler}
          setDisabledNextButton={setDisabledNextButton}
          src={preview[selectedIndexBig].url}
        />
      )}
    </div>
  )
}
