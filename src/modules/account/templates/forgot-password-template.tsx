"use client"

import { requestPasswordReset } from "@lib/data/customer"
import { Button } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useFormState } from "react-dom"
import { useState } from "react"

export default function ForgotPasswordTemplate() {
  const [message, formAction] = useFormState(requestPasswordReset, null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Check if the message is success
  if (message === "success" && !isSuccess) {
    setIsSuccess(true)
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </h1>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to your email address. Please check
            your inbox and follow the instructions.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <LocalizedClientLink
            href="/account/login"
            className="text-sm text-gray-900 hover:text-gray-700 font-medium underline"
          >
            Back to Login
          </LocalizedClientLink>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          {message && message !== "success" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{message}</p>
            </div>
          )}

          <div>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" className="w-full">
            Send Reset Link
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
