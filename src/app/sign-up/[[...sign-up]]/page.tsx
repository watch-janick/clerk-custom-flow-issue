'use client'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function SignUp() {
  const [emailAddress, setEmailAddress] = React.useState('')
  const [expired, setExpired] = React.useState(false)
  const [verified, setVerified] = React.useState(false)
  const router = useRouter()
  const { signUp, isLoaded, setActive } = useSignUp()

  if (!isLoaded) {
    return null
  }

  const { startEmailLinkFlow } = signUp.createEmailLinkFlow()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setExpired(false)
    setVerified(false)
    if (signUp) {
      // Start the sign up flow, by collecting
      // the user's email address.
      await signUp.create({ emailAddress })

      // Start the magic link flow.
      // Pass your app URL that users will be navigated
      // when they click the magic link from their
      // email inbox.
      // su will hold the updated sign up object.
      const su = await startEmailLinkFlow({
        redirectUrl: 'http://localhost:3000/verification',
      })

      // Check the verification result.
      const verification = su.verifications.emailAddress
      if (verification.verifiedFromTheSameClient()) {
        setVerified(true)
        return
      } else if (verification.status === 'expired') {
        setExpired(true)
      }

      if (su.status === 'complete') {
        // Sign up is complete, we have a session.
        // Navigate to the after sign up URL.
        setActive({ session: su.createdSessionId || '' })
        router.push('/after-sign-up')
        return
      }
    }
  }

  if (expired) {
    return <div>Magic link has expired</div>
  }

  if (verified) {
    return <div>Signed in on other tab</div>
  }

  return (
    <form onSubmit={submit}>
      <input
        type="email"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        className="ring"
      />
      <button type="submit">Sign up with magic link</button>
    </form>
  )
}
