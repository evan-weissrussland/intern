import { GitHubIcon, GoogleIcon } from '@/assets/icons'
import { useLazyLoginWithGithubQuery } from '@/services/inctagram.auth.service'
import { Button } from '@chrizzo/ui-kit'

import s from './socialAuthButtons.module.scss'

export const SocialAuthButtons = () => {
  /**
   * хук RTKQ для входа через Гитхаб. Не используется, т.к. в URL запроса подменяет
   * домен https://inctagram.work на http://localhost:3000. Почему и как. не знаю.
   * Поэтому делаем запрос через "window.location.assign"
   */
  const [loginWithGithub] = useLazyLoginWithGithubQuery()
  /**
   * обработчик нажатия на кнопку Вход через Гитхаб
   */
  const githubLoginAndRegisterHandler = () => {
    // loginWithGithub('http://localhost:3000/home')
    window.location.assign('https://inctagram.work/api/v1/auth/github/login')
  }
  /**
   * вспомогательная функция-хелпер для подготовки данных для Входа через Гугл
   */
  const getGoogleAuthUrl = () => {
    const scope = 'email profile'
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE_LOGIN
    const redirectUri = 'http://localhost:3000'
    const responseType = 'code'

    return `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent(
      scope
    )}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}`
  }

  /**
   * обработчик нажатия на кнопку Вход через Гугл
   */
  const googleLoginAndRegisterHandler = () => {
    window.location.assign(getGoogleAuthUrl())
  }

  return (
    <div className={s.icons}>
      <Button
        className={s.icon}
        onClick={googleLoginAndRegisterHandler}
        type={'button'}
        variant={'text'}
      >
        <GoogleIcon height={36} width={36} />
      </Button>
      <Button
        className={s.icon}
        onClick={githubLoginAndRegisterHandler}
        type={'button'}
        variant={'text'}
      >
        <GitHubIcon height={36} width={36} />
      </Button>
    </div>
  )
}
