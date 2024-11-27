import { useRouter } from 'next/router'

/**
 * Эта страница нужна для редиректа на страницу профиля, если я успешно залогинился через гитхаб.
 * После логина юзера автоматом редиректит на страницу /github ( если я делаю запрос с локалхоста, то
 * url будет http://localhost:3000/github?access_token=XXX&email=YYY) (так сделано на бэкэнде).
 * Я не знаю, как мне использовать этот токен и мыло, потому что сразу же у меня идёт запрос authMe, он не успешен,
 * после чего идёт запрос refresh-token, появляется новый access-token и я вхожу в приложение.
 * Смысла я не вижу в токене в url.
 */
function GithubLogin() {
  /**
   * Обработка URL
   */
  const router = useRouter()

  void router.push(`/profile`)

  return
}

export default GithubLogin
