import {
  useGetUsersWhoLikedAnswerCommentPostQuery,
  useGetUsersWhoLikedCommentPostQuery,
  useGetUsersWhoLikedPostQuery,
} from '@/services/inctagram.posts.service'

type Props = {
  answerId?: number
  commentId?: number
  inputValue: string
  open: boolean
  postId: number
  xType: 'answer' | 'comment' | 'post'
}

export const useModalSearch = ({ answerId, commentId, inputValue, open, postId, xType }: Props) => {
  let usersList = undefined
  /**
   * хук RTKQ. запрос за юзерами, лайкнувшими пост. params - это query-параметры.
   * skip - пока модальное окно не открыто или должен идти запрос за юзерами, лайкнувшими комментарий
   * или лайкнувиши ответ к комментарию, не делаем запрос
   */
  const { data: usersLikedPost, isFetching: isFetchingGetLikedPostUsers } =
    useGetUsersWhoLikedPostQuery(
      {
        params: { search: inputValue },
        postId,
      },
      { skip: !open || xType !== 'post' }
    )
  /**
   * хук RTKQ. запрос за юзерами, лайкнувшими комментарий поста. params - это query-параметры.
   * skip - пока модальное окно не открыто или должен идти запрос за юзерами, лайкнувшими ответ
   * к комментарию, не делаем запрос
   */
  const { data: usersLikedComment, isFetching: isFetchingGetLikedCommentUsers } =
    useGetUsersWhoLikedCommentPostQuery(
      {
        commentId: commentId,
        params: { search: inputValue },
        postId,
      },
      { skip: !open || xType !== 'comment' }
    )
  /**
   * хук RTKQ. запрос за юзерами, лайкнувшими ответ к комментарию поста. params - это query-параметры.
   * skip - пока модальное окно не открыто или должен идти запрос за юзерами, лайкнувшими ответ
   * к комментарию, не делаем запрос
   */
  const { data: usersLikedAnswerComment, isFetching: isFetchingGetLikedAnswerCommentUsers } =
    useGetUsersWhoLikedAnswerCommentPostQuery(
      {
        answerId,
        commentId,
        params: { search: inputValue },
        postId,
      },
      { skip: !open || xType !== 'answer' }
    )

  if (usersLikedPost) {
    usersList = usersLikedPost
  }
  if (usersLikedComment) {
    usersList = usersLikedComment
  }
  if (usersLikedAnswerComment) {
    usersList = usersLikedAnswerComment
  }

  return {
    isFetching:
      isFetchingGetLikedPostUsers ||
      isFetchingGetLikedCommentUsers ||
      isFetchingGetLikedAnswerCommentUsers,
    list: usersList,
  }
}
