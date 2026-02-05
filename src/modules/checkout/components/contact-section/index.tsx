"use client"

import { useState, useEffect } from "react"
import { CheckCircleSolid, Envelope, Phone } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

interface ContactSectionProps {
  cart: HttpTypes.StoreCart
  onComplete: (data: { email: string; phone?: string }) => void
  isComplete: boolean
  onEdit: () => void
}

/**
 * Contact Section Component
 *
 * Collects customer email and optional phone number
 * Collapses when complete with edit button
 */
const ContactSection = ({
  cart,
  onComplete,
  isComplete,
  onEdit,
}: ContactSectionProps) => {
  const [email, setEmail] = useState(cart.email || "")
  const [phone, setPhone] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  // Validate email format
  const validateEmail = (value: string) => {
    if (!value) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  // Handle email change with validation
  const handleEmailChange = (value: string) => {
    setEmail(value)
    setEmailError("")
  }

  // Handle email blur (validate)
  const handleEmailBlur = () => {
    const error = validateEmail(email)
    setEmailError(error)
  }

  // Handle continue
  const handleContinue = () => {
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }

    onComplete({ email, phone })
  }

  // Auto-fill from cart if available
  useEffect(() => {
    if (cart.email && !email) {
      setEmail(cart.email)
    }
  }, [cart.email])

  // Collapsed view when complete
  if (isComplete) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                <CheckCircleSolid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Contact</h3>
                <p className="text-sm text-gray-600">{email}</p>
                {phone && <p className="text-sm text-gray-600">{phone}</p>}
              </div>
            </div>
            <button
              onClick={onEdit}
              className="text-sm font-medium text-[#F16D34] hover:text-[#d55a24] transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Expanded form view
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#F16D34] text-white flex items-center justify-center text-base font-bold">
            1
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Contact Information
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              We'll use this to send order updates
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Envelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="you@example.com"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  emailError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-[#F16D34] focus:ring-orange-200"
                }`}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
            </div>
            {emailError && (
              <p id="email-error" className="mt-1.5 text-sm text-red-600">
                {emailError}
              </p>
            )}
          </div>

          {/* Phone Input (Optional) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Phone Number{" "}
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-[#F16D34] focus:ring-orange-200 transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              For delivery updates and support
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!email || !!emailError || isValidating}
            className="w-full h-12 bg-gray-900 hover:bg-[#F16D34] text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Validating...
              </>
            ) : (
              "Continue to Shipping"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
