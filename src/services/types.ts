type UploadId = {
  uploadId: string
}
export type RequestCreatePost = {
  childrenMetadata: UploadId[]
  description: string | undefined
}
type AvatarsType = {
  createdAt: string
  fileSize: number
  height: number
  uploadId: string
  url: string
  width: number
}
type OwnerPostType = {
  firstName: string
  lastName: string
}
export type ResponseCreatePost = {
  avatarOwner: string
  createdAt: string
  description: string
  id: number
  images: AvatarsType[]
  isLiked: boolean
  likesCount: number
  location: string
  owner: OwnerPostType
  ownerId: number
  updatedAt: string
  userName: string
}
type ImagesPostType = {
  createdAt: string
  fileSize: number
  height: number
  uploadId: string
  url: string
  width: number
}
export type ResponseCreateImagesPost = {
  images: ImagesPostType[]
}
export type CurrentSession = {
  browserName: string
  browserVersion: string
  deviceId: number
  ip: string
  lastActive: string
  osName: string
  osVersion: string
}

export type ResponseAllSessionsType = {
  current: CurrentSession
  others: CurrentSession[]
}

type CurrentSubscriptionType = {
  autoRenewal: boolean
  dateOfPayment: string
  endDateOfSubscription: string
  subscriptionId: string
  userId: number
}

export type ResponseCurrentSubscriptionType = {
  data: CurrentSubscriptionType[]
  hasAutoRenewal: boolean
}

export type AllSubscriptionsType = {
  dateOfPayment: string
  endDateOfSubscription: string
  paymentType: 'PAYPAL' | 'STRIPE'
  price: number
  subscriptionId: string
  subscriptionType: DescriptionPaymentType
  userId: number
}

export type ResponseAllSubscriptionsType = AllSubscriptionsType[]

export type DescriptionPaymentType = 'DAY' | 'MONTHLY' | 'WEEKLY'

export type CostPaymentSubscriptionsType = {
  amount: number
  typeDescription: DescriptionPaymentType
}

export type ResponseCostOfPaymentSubscriptionsType = {
  data: CostPaymentSubscriptionsType[]
}
export type ResponseCreateSubscriptionType = {
  url: string
}
export type RequestCreateSubscriptionType = {
  amount: number
  baseUrl: string
  paymentType: string
  typeSubscription: DescriptionPaymentType
}
export type ResponseAuthMe = {
  email: string
  isBlocked: boolean
  userId: number
  userName: string
}
export type RequestCreateCommentType = {
  body: { content: string }
  postId: number
}
export type ResponseCreateCommentType = {
  answerCount: number
  content: string
  createdAt: string
  from: {
    avatars: {}[]
    id: number
    username: string
  }
  id: number
  isLiked: true
  likeCount: number
  postId: number
}
export type LikeSTatusType = 'DISLIKE' | 'LIKE' | 'NONE'
export type RequestUpdateLikeStatusCommentType = {
  body: { likeStatus: LikeSTatusType }
  commentId: number
  postId: number
}
export type RequestUpdatePostType = {
  body: { description: string }
  postId: number
}
export type RequestUpdateLikeStatusPostType = {
  body: { likeStatus: LikeSTatusType }
  postId: number
}
export type RequestToUsersWhoLikedPost = {
  params: {
    cursor?: number
    pageNumber?: number
    pageSize?: number
    search?: string
  }
  postId: number
}
export type LikesItemType = {
  avatars: Omit<ImagesPostType, 'uploadId'>[]
  createdAt: string
  id: number
  isFollowedBy: true
  isFollowing: true
  userId: number
  userName: string
}
export type ResponseUsersWhoLikedPost = {
  items: LikesItemType[]
  pageSize: number
  totalCount: number
}
export type RequestToPostsByUserName = {
  params: {
    pageNumber?: number
    pageSize?: number
    sortBy?: number
    sortDirection?: string
  }
  userName: string
}
export type ResponsePostsByUserName = {
  items: {
    avatarOwner: string
    avatarWhoLikes: string[]
    createdAt: string
    description: string
    id: number
    images: {
      createdAt: string
      fileSize: number
      height: number
      uploadId: string
      url: string
      width: number
    }[]
    isLiked: boolean
    likesCount: number
    location: string
    owner: {
      firstName: string
      lastName: string
    }
    ownerId: number
    updatedAt: string
    userName: string
  }[]
  page: number
  pageSize: number
  pagesCount: number
  totalCount: number
}

export type RequestAnswersForComment = {
  commentId: number
  params: {
    pageNumber?: number
    pageSize?: number
    sortBy?: number
    sortDirection?: string
  }
  postId: number
}
export type AnswerType = {
  commentId: number
  content: string
  createdAt: string
  from: {
    avatars: AvatarsType[]
    id: number
    username: string
  }
  id: number
  isLiked: boolean
  likeCount: number
}
export type ResponseAnswersForComment = {
  items: AnswerType[]
  notReadCount: number
  pageSize: number
  totalCount: number
}
