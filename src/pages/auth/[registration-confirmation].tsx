import { useEffect, useState } from 'react'

import { MailVerificationError, MailVerificationSuccess, PageWrapper } from '@/components'
import { Toast } from '@/components/toast/Toast'
import { useTranslation } from '@/hooks/useTranslation'
import {
  useRegistrationConfirmationMutation,
  useRegistrationEmailResendingMutation,
} from '@/services/inctagram.auth.service'
import { useRouter } from 'next/router'
import { toast } from 'sonner'

enum ConfirmationType {
  failure = 'failure',
  pending = 'pending',
  success = 'success',
}

export function RegistrationConfirmation() {
  const router = useRouter()
  const { code, email } = router.query
  const [registrationConfirmation] = useRegistrationConfirmationMutation()
  const [registrationEmailResending] = useRegistrationEmailResendingMutation()
  const [isSuccessConfirmation, setIsSuccessConfirmation] = useState<ConfirmationType>(
    ConfirmationType.pending
  )
  const resendPasswordClick = () => {
    const body = {
      baseUrl: '',
      email: email as string,
    }

    registrationEmailResending(body)
      .unwrap()
      .then(() => {})
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        setIsSuccessConfirmation(ConfirmationType.pending)
      })
  }

  useEffect(() => {
    const requestForCheckCode = (cod: string) => {
      registrationConfirmation({ confirmationCode: cod })
        .unwrap()
        .then(() => {
          setIsSuccessConfirmation(ConfirmationType.success)
        })
        .catch((e: any) => {
          setIsSuccessConfirmation(ConfirmationType.failure)
          /**
           * всплывашка
           */
          toast.custom(
            jsx => (
              <Toast onDismiss={() => toast.dismiss(jsx)} title={e.data.messages[0].message} />
            ),
            {
              className: 'errorToast',
            }
          )
        })
    }

    if (code && typeof code === 'string') {
      void requestForCheckCode(code)
    }
  }, [])

  const { t } = useTranslation()

  return (
    <PageWrapper>
      {isSuccessConfirmation === ConfirmationType.success && <MailVerificationSuccess />}
      {isSuccessConfirmation === ConfirmationType.failure && (
        <MailVerificationError email={email as string} resentCallback={resendPasswordClick} />
      )}
      {isSuccessConfirmation === ConfirmationType.pending && <></>}
    </PageWrapper>
  )
}

export default RegistrationConfirmation
