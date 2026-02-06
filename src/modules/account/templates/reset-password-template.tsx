"use client"

import { resetPassword } from "@lib/data/customer"
import { Button } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useFormState } from "react-dom"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function ResetPasswordTemplate() {
  const [message, formAction] = useFormState(resetPassword, null)
  const [isSuccess, setIsSuccess] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  useEffect(() => {
    if (!token || !email) {
      // Redirect to forgot password if no token
      router.push("/account/forgot-password")
    }
  }, [token, email, router])

  // Check if the message is success
  if (message === "success" && !isSuccess) {
    setIsSuccess(true)
  }

  if (!token || !email) {
    return null
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600">Enter your new password below.</p>
      </div>

      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
          <LocalizedClientLink
            href="/account/login"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Go to Login
          </LocalizedClientLink>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          {message && message !== "success" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{message}</p>
            </div>
          )}

          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email} />

          <div>
            <Input
              label="New Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Enter new password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          <div>
            <Input
              label="Confirm Password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm new password"
            />
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>

          <div className="text-center">
            <LocalizedClientLink
              href="/account/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Login
            </LocalizedClientLink>
          </div>
        </form>
      )}
    </div>
  )
}
