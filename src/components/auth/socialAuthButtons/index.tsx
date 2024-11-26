import { GitHubIcon, GoogleIcon } from '@/assets/icons'
import { useLazyLoginWithGithubQuery } from '@/services/inctagram.auth.service'
import { Button } from '@chrizzo/ui-kit'

import s from './socialAuthButtons.module.scss'

type Props = {
  googleLoginAndRegister: () => void
}

export const SocialAuthButtons = ({ googleLoginAndRegister }: Props) => {
  const [loginWithGithub] = useLazyLoginWithGithubQuery()
  const githubLoginAndRegister = () => {
    // loginWithGithub('http://localhost:3000/home')
    window.location.assign('https://inctagram.work/api/v1/auth/github/login')
  }

  return (
    <div className={s.icons}>
      <Button className={s.icon} onClick={googleLoginAndRegister} type={'button'} variant={'text'}>
        <GoogleIcon height={36} width={36} />
      </Button>
      <Button className={s.icon} onClick={githubLoginAndRegister} type={'button'} variant={'text'}>
        <GitHubIcon height={36} width={36} />
      </Button>
    </div>
  )
}
