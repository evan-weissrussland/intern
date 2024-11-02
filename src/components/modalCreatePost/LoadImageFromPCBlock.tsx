import React, { ChangeEvent, ForwardedRef, forwardRef } from 'react'

import { ImageIcon } from '@/assets/icons/ImageIcon'
import { useTranslation } from '@/hooks/useTranslation'
import { Button, Typography } from '@chrizzo/ui-kit'

import s from '@/components/modalCreatePost/modalCreatePost.module.scss'

type LoadImageFromPCBlockProps = {
  imageError: null | string
  isPreview: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  triggerFileInput: () => void
}
export const LoadImageFromPCBlock = forwardRef(
  (
    { imageError, isPreview, onChange, triggerFileInput }: LoadImageFromPCBlockProps,
    ref: ForwardedRef<any>
  ) => {
    const { t } = useTranslation()

    return (
      <>
        <input accept={'image/*'} hidden multiple onChange={onChange} ref={ref} type={'file'} />

        {!isPreview && (
          <div className={s.flexColumn}>
            {imageError && (
              <div className={s.errorBox}>
                <Typography variant={'regularBold14'}>Error!</Typography>
                <Typography variant={'regular14'}>{imageError}</Typography>
              </div>
            )}
            <div className={s.imageContainer}>{!isPreview && <ImageIcon size={36} />}</div>
            <div className={s.buttonsBlock}>
              <Button className={s.selectButton} onClick={triggerFileInput} variant={'primary'}>
                {t.common.selectFromComputer}
              </Button>
              <Button className={s.selectButton} onClick={() => {}} variant={'outline'}>
                Open Draft
              </Button>
            </div>
          </div>
        )}
      </>
    )
  }
)
