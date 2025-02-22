import { SingUp } from '@/components'
import { ScrollWrapper } from '@/components/profile-settings'
import { useWindowWidth } from '@/hooks/useWindowWidth'

export function SignUp() {
  const windowWidth = useWindowWidth()

  return (
    <ScrollWrapper className={''} height={'calc(100vh - 61px)'} mobile={windowWidth <= 360}>
      <SingUp onSubmit={() => {}} />
    </ScrollWrapper>
  )
}

export default SignUp
