import { GetNavLayout, PageWrapper } from '@/components'
import { UserProfile } from '@/components/userProfile'
import { useGetUserProfileQuery } from '@/services/inctagram.profile.service'
import { useRouter } from 'next/router'

import s from './userProfilePage.module.scss'

function UserProfileDinamicPage() {
  const router = useRouter()

  const { data } = useGetUserProfileQuery()

  return (
    <PageWrapper>
      <div className={s.overflowedContainer}>
        <div className={s.mainCntainer}>
          <UserProfile userName={data?.userName} />
        </div>
      </div>
    </PageWrapper>
  )
}

UserProfileDinamicPage.getLayout = GetNavLayout
export default UserProfileDinamicPage