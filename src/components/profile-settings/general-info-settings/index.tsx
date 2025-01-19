import { ResponseDataUserProfile } from '@/components/posts/types'
import { AvatarSelector } from '@/components/profile-settings/general-info-settings/avatar-selector'
import { GeneralInfoForm } from '@/components/profile-settings/general-info-settings/general-info-form'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { clsx } from 'clsx'

import s from './generalInfoContetnt.module.scss'

type Props = {
  isFetching: boolean
  mobile: boolean
  onValueChange: (file: File | null) => void
  profileData: ResponseDataUserProfile | undefined
}
export const GeneralInfoContent = ({ isFetching, mobile, onValueChange, profileData }: Props) => {
  return (
    <TabsPrimitive.Content value={'generalInformation'}>
      <div className={clsx(s.flexRow, mobile && s.mobile)}>
        {!isFetching && (
          <>
            <AvatarSelector
              initialValue={profileData?.avatars[0]?.url ?? ''}
              onValueChange={onValueChange}
            />
            <GeneralInfoForm mobile={mobile} profile={profileData} />
          </>
        )}
      </div>
    </TabsPrimitive.Content>
  )
}
