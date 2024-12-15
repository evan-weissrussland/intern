import React, { useState } from 'react'

import ModalkaPost from '@/components/posts/ModalkaPost'
import { ModalEditPost } from '@/components/userProfile/getPostsUser/ModalEditPost'
import { Post } from '@/services/inctagram.public-posts.service'

import s from '@/components/userProfile/userProfile.module.scss'

type Props = {
  index: null | number
  post: Post
}
export const ModalPostItem = ({ index, post }: Props) => {
  const [showEditModalPost, setEditModalPost] = useState(false)

  return (
    <li className={s.card} id={index ? `post-${index}` : ''} onClick={() => {}}>
      <div>
        {!showEditModalPost && <ModalkaPost post={post} setEditModalPost={setEditModalPost} />}
        {showEditModalPost && <ModalEditPost post={post} setEditModalPost={setEditModalPost} />}
      </div>
    </li>
  )
}
