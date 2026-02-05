"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { useEffect, useState } from "react"
import StripePaymentForm from "./stripe-payment-form"

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

interface StripePaymentProps {
  cart: any
  onSuccess: () => void
  onError: (error: string) => void
  submitting: boolean
  setSubmitting: (submitting: boolean) => void
}

/**
 * Stripe Payment Component
 *
 * Handles Stripe payment integration using Payment Element
 * Requires a payment session to be created in Medusa first
 */
const StripePayment = ({
  cart,
  onSuccess,
  onError,
  submitting,
  setSubmitting,
}: StripePaymentProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Get client secret from payment session
  useEffect(() => {
    console.log("[Stripe] Checking for payment session...")
    console.log("[Stripe] Cart payment collection:", cart.payment_collection)
    console.log(
      "[Stripe] Payment sessions:",
      cart.payment_collection?.payment_sessions
    )

    const stripeSession = cart.payment_collection?.payment_sessions?.find(
      (session: any) =>
        (session.provider_id === "stripe" ||
          session.provider_id?.startsWith("pp_stripe") ||
          session.provider_id?.includes("stripe")) &&
        session.status === "pending"
    )

    console.log("[Stripe] Found Stripe session:", stripeSession)

    if (stripeSession?.data?.client_secret) {
      console.log("[Stripe] ✅ Client secret found!")
      setClientSecret(stripeSession.data.client_secret)
      setLoading(false)
    } else {
      console.error("[Stripe] ❌ No client secret found in payment session")
      console.log(
        "[Stripe] Available sessions:",
        cart.payment_collection?.payment_sessions
      )

      if (!cart.payment_collection) {
        console.error("[Stripe] Cart has no payment collection!")
      } else if (
        !cart.payment_collection.payment_sessions ||
        cart.payment_collection.payment_sessions.length === 0
      ) {
        console.error("[Stripe] Payment collection has no sessions!")
      }

      setLoading(false)
    }
  }, [cart])

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F16D34] mx-auto"></div>
        <p className="mt-3 text-sm text-gray-600">Loading payment form...</p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 mb-2">
              Unable to initialize Stripe payment
            </p>
            <p className="text-xs text-red-700 mb-3">
              The payment session could not be created. This might be because:
            </p>
            <ul className="text-xs text-red-700 list-disc list-inside space-y-1 mb-3">
              <li>Stripe is not enabled for your region</li>
              <li>The cart is in an invalid state</li>
              <li>There was a network error</li>
            </ul>
            <p className="text-xs text-red-700">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#F16D34",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm
        cart={cart}
        onSuccess={onSuccess}
        onError={onError}
        submitting={submitting}
        setSubmitting={setSubmitting}
      />
    </Elements>
  )
}

export default StripePayment
