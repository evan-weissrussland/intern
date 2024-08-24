import React, { useState } from 'react'

import { NextCarousel, PrevCarousel } from '@/assets/icons'
import { Close } from '@/assets/icons/close'
import {
  Modalka,
  ModalkaButtonCancel,
  ModalkaContent,
  ModalkaTitle,
  ModalkaTrigger,
} from '@/components/modal'
import { useDotButton } from '@/hooks/useDotCarouselButton'
import { Post, useGetCommentsForPostQuery } from '@/services/inctagram.public-posts.service'
import { Button, Card, Typography } from '@chrizzo/ui-kit'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import s from '@/pages/posts.module.scss'

import defaultAva from '../../../public/defaultAva.jpg'

type Props = {
  post: Post
  showMore: boolean
}

const ModalkaPost = ({ post, showMore }: Props) => {
  /**
   * хук useState для управления open/close AlertDialog.Root. Нужна только для skip'а запроса за
   * комментариями, если модалка не открыта. В компоненте Modalka можно не использовать
   */
  const [open, setOpen] = useState(false)

  /**
   * запрос за комментариями к посту
   */
  const { data, isFetching } = useGetCommentsForPostQuery(
    {
      params: undefined,
      postId: post.id,
    },
    { skip: !open }
  )

  /**
   * хук из библиотеки карусели
   */
  const [emblaRef, emblaApi] = useEmblaCarousel()

  /**
   * кастомный хук для точек перехода к слайдам карусели
   */
  const { onDotButtonClick, scrollSnaps, selectedIndex } = useDotButton(emblaApi)

  /**
   * массив images поста для карусели
   */
  const imagesPostArray = post?.images.map(image => {
    return (
      <div className={s.emblaSlide} key={image.uploadId}>
        <div className={s.postImage} data-showmore={showMore}>
          <Image
            alt={'image'}
            height={image?.height}
            priority
            src={image?.url || defaultAva}
            width={image?.width}
          />
        </div>
      </div>
    )
  })

  return (
    <Modalka onOpenChange={setOpen} open={open}>
      <ModalkaTrigger asChild>
        <div className={s.embla} ref={emblaRef}>
          <div className={s.emblaContainer}>{imagesPostArray}</div>
        </div>
      </ModalkaTrigger>

      {!showMore && (
        <>
          <Button
            className={s.prevButton}
            onClick={() => {
              emblaApi?.scrollPrev()
            }}
            type={'button'}
          >
            <PrevCarousel />
          </Button>
          <Button
            className={s.nextButton}
            onClick={() => {
              emblaApi?.scrollNext()
            }}
            type={'button'}
          >
            <NextCarousel />
          </Button>
          <div className={s.dots}>
            {scrollSnaps.map((_, index) => (
              <div
                className={clsx(s.dot, index === selectedIndex && s.activeDot)}
                key={index}
                onClick={() => onDotButtonClick(index)}
              ></div>
            ))}
          </div>
        </>
      )}
      <ModalkaContent aria-describedby={'open modal comments to post'} className={s.contentPost}>
        <ModalkaTitle className={s.title}>
          <ModalkaButtonCancel asChild>
            <Button variant={'text'}>
              <Close />
            </Button>
          </ModalkaButtonCancel>
        </ModalkaTitle>
        <Card className={s.card} variant={'dark300'}>
          <div className={s.postImageContent}>
            <div className={s.embla} ref={emblaRef}>
              <div className={s.emblaContainer}> {imagesPostArray}</div>
            </div>
            <Button
              className={s.prevModalButton}
              onClick={() => {
                emblaApi?.scrollPrev()
              }}
              type={'button'}
            >
              <PrevCarousel height={'48'} width={'48'} />
            </Button>
            <Button
              className={s.nextModalButton}
              onClick={() => {
                emblaApi?.scrollNext()
              }}
              type={'button'}
            >
              <NextCarousel height={'48'} width={'48'} />
            </Button>
            <div className={s.dotes}>
              {scrollSnaps.map((_, index) => (
                <div
                  className={clsx(s.dote, index === selectedIndex && s.activeDot)}
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className={s.commentsWr}>
            <div className={s.avaUserNameBlock}>
              <Image alt={'ava'} height={36} src={post.avatarOwner || defaultAva} width={36} />
              <Typography variant={'h3'}>{post.userName}</Typography>
            </div>
            <hr className={s.hr} />
            <ul className={s.commentsUl}>
              {isFetching ? (
                <>...Loading.....</>
              ) : (
                data?.items.map(c => {
                  return (
                    <li className={s.commentWr} key={c.id}>
                      <Image
                        alt={'ava'}
                        height={36}
                        src={c.from?.avatars[1]?.url || defaultAva}
                        width={36}
                      />
                      <div className={s.commentBlock}>
                        <Typography as={'span'} variant={'regular14'}>
                          <Typography as={'span'} variant={'regularBold14'}>
                            {c.from.username}{' '}
                          </Typography>
                          {c.content}
                        </Typography>
                        <Typography className={s.date} variant={'small'}>
                          {c.createdAt}
                        </Typography>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
            <hr className={s.hr} />
            <div className={s.likesBlock}>
              <div className={s.avatarsLiked}></div>
              <Typography as={'span'} variant={'regular14'}>
                {post.likesCount}{' '}
                <Typography as={'span'} variant={'regularBold14'}>
                  &quot;Like&quot;
                </Typography>
              </Typography>
              <Typography className={s.date} variant={'small'}>
                {post.createdAt}
              </Typography>
            </div>
          </div>
        </Card>
      </ModalkaContent>
    </Modalka>
  )
}

export default ModalkaPost
