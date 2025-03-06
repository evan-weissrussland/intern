import { useLogoutMutation } from '@/services/inctagram.auth.service'
import { useRouter } from 'next/router'

export const useLogout = () => {
  const router = useRouter()
  /**
   * вылогинивание
   */
  const [logout, { isLoading }] = useLogoutMutation()

  const getLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dataOfBirth')
          localStorage.removeItem('settingsMyProfile')
          localStorage.removeItem('settingProfile')
        }
        void router.push('/login')
      })
  }

  return { getLogout, isLoading }
}
