import { useClerk } from '@clerk/nextjs'
import React from 'react'

const VerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = React.useState('loading')

  const { handleEmailLinkVerification } = useClerk()

  React.useEffect(() => {
    async function verify() {
      await handleEmailLinkVerification({
        redirectUrl: 'https://redirect-to-pending-sign-up',
        redirectUrlComplete: 'https://redirect-when-sign-up-complete',
      })
      // If we're not redirected at this point, it means
      // that the flow has completed on another device.
      setVerificationStatus('verified')
    }
    verify()
  }, [handleEmailLinkVerification])

  if (verificationStatus === 'loading') {
    return <div>Loading...</div>
  }

  if (verificationStatus === 'failed') {
    return <div>Magic link verification failed</div>
  }

  if (verificationStatus === 'expired') {
    return <div>Magic link expired</div>
  }

  return (
    <div>Successfully signed up. Return to the original tab to continue.</div>
  )
}

export default VerificationPage
