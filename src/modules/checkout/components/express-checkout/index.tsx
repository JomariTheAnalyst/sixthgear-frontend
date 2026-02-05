"use client"

import { useState } from "react"

/**
 * Express Checkout Component
 *
 * Displays express payment options (Apple Pay, Google Pay, PayPal)
 * with "Or continue with email" divider
 */
const ExpressCheckout = () => {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false)
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false)

  // Check for Apple Pay availability
  // useEffect(() => {
  //   if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
  //     setIsApplePayAvailable(true)
  //   }
  // }, [])

  // For now, we'll show placeholders
  // In production, integrate with Stripe Payment Request Button API

  const hasExpressOptions = isApplePayAvailable || isGooglePayAvailable || true // PayPal always available

  if (!hasExpressOptions) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Apple Pay Button */}
        {isApplePayAvailable && (
          <button
            type="button"
            className="w-full h-12 bg-black text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
            onClick={() => {
              // TODO: Implement Apple Pay
              console.log("Apple Pay clicked")
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Pay
          </button>
        )}

        {/* Google Pay Button */}
        {isGooglePayAvailable && (
          <button
            type="button"
            className="w-full h-12 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={() => {
              // TODO: Implement Google Pay
              console.log("Google Pay clicked")
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            Pay
          </button>
        )}

        {/* PayPal Button Placeholder */}
        <button
          type="button"
          className="w-full h-12 bg-[#0070BA] text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#005ea6] transition-colors"
          onClick={() => {
            // TODO: Implement PayPal
            console.log("PayPal clicked")
          }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.68H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z" />
            <path d="M2.379 0h9.906a3.743 3.743 0 013.743 3.743v.808l.019-.002c.015 0 .03-.002.045-.002h.051c.96 0 1.892.165 2.748.49.971.368 1.748.918 2.31 1.634.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.68H7.72a.483.483 0 01-.477-.558l1.03-6.527.947-6.008.537-3.407A.805.805 0 0110.55 3h1.372c.22 0 .43.087.586.242.155.156.242.366.242.586v.808l.019-.002c.015 0 .03-.002.045-.002h.051c.96 0 1.892.165 2.748.49.971.368 1.748.918 2.31 1.634z" />
          </svg>
          PayPal
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            Or continue with email
          </span>
        </div>
      </div>
    </div>
  )
}

export default ExpressCheckout
