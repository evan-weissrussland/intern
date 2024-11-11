import React from 'react'

import s from '@/pages/posts.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  imageId: string
  imageUrl?: string | undefined
  navigateToPublicUserProfile: (postId: number | undefined, id: number) => void
  postId: number
  postOwnerId: number
  showMore: boolean
}
export const EmblaSlideItem = ({
  imageId,
  imageUrl = undefined,
  navigateToPublicUserProfile,
  postId,
  postOwnerId,
  showMore,
}: Props) => {
  return (
    <div className={s.emblaSlide} key={imageId}>
      <div
        className={s.postImage}
        data-showmore={showMore}
        onClick={() => navigateToPublicUserProfile(postId, postOwnerId)}
      >
        <img alt={'image'} src={imageUrl ?? defaultAva.src} />
      </div>
    </div>
  )
}
