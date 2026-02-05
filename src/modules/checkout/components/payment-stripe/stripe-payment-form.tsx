"use client"

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

interface StripePaymentFormProps {
  cart: any
  onSuccess: () => void
  onError: (error: string) => void
  submitting: boolean
  setSubmitting: (submitting: boolean) => void
}

/**
 * Stripe Payment Form Component
 *
 * Renders the Stripe Payment Element and handles payment confirmation
 * Follows official Medusa payment flow: confirm payment → complete cart → create order
 */
const StripePaymentForm = ({
  cart,
  onSuccess,
  onError,
  submitting,
  setSubmitting,
}: StripePaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [waitingForOrder, setWaitingForOrder] = useState(false)
  const params = useParams()
  const router = useRouter()
  const countryCode = params.countryCode as string

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setSubmitting(true)
    setPaymentError(null)

    try {
      console.log("[Stripe] Confirming payment...")

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/${countryCode}/order/confirmed`,
          },
          redirect: "if_required", // Only redirect if required (3D Secure, etc.)
        }
      )

      if (stripeError) {
        console.error("[Stripe] Payment confirmation failed:", stripeError)
        setPaymentError(
          stripeError.message || "Payment failed. Please try again."
        )
        onError(stripeError.message || "Payment failed")
        setSubmitting(false)
        return
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("[Stripe] ✅ Payment succeeded:", paymentIntent.id)

        // Show waiting message
        setWaitingForOrder(true)
        setPaymentError("Payment successful! Creating your order...")

        // CORRECT MEDUSA FLOW: Complete cart after payment succeeds
        console.log("[Stripe] Completing cart to create order...")

        try {
          // Use the placeOrder server action which handles auth headers and cart completion
          const { placeOrder } = await import("@lib/data/cart")

          // placeOrder will automatically redirect to order confirmation page on success
          await placeOrder(cart.id)

          // If we reach here without redirect, something went wrong
          console.error("[Stripe] ❌ placeOrder did not redirect as expected")
          setPaymentError(
            "Payment successful but order creation failed. Please contact support with payment ID: " +
              paymentIntent.id
          )
          setWaitingForOrder(false)
          setSubmitting(false)
        } catch (orderError: any) {
          console.error("[Stripe] ❌ Order creation error:", orderError)

          setPaymentError(
            `Payment successful! Payment ID: ${paymentIntent.id}. ` +
              `However, there was an error creating your order. ` +
              `Please contact support with this payment ID.`
          )
          setWaitingForOrder(false)
          setSubmitting(false)
        }
      } else {
        console.error(
          "[Stripe] Unexpected payment status:",
          paymentIntent?.status
        )
        setPaymentError("Payment status unclear. Please contact support.")
        onError("Payment status unclear")
        setSubmitting(false)
      }
    } catch (err: any) {
      console.error("[Stripe] Payment error:", err)
      setPaymentError(err.message || "An unexpected error occurred")
      onError(err.message || "An unexpected error occurred")
      setSubmitting(false)
      setWaitingForOrder(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stripe Payment Element */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error/Status Message */}
      {paymentError && (
        <div
          className={`p-4 border rounded-lg ${
            waitingForOrder
              ? "bg-blue-50 border-blue-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {waitingForOrder ? (
              <svg
                className="animate-spin h-5 w-5 text-blue-500 flex-shrink-0"
                viewBox="0 0 24 24"
              >
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
            ) : (
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0"
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
            )}
            <span
              className={`text-sm font-medium ${
                waitingForOrder ? "text-blue-800" : "text-red-800"
              }`}
            >
              {paymentError}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full h-14 bg-[#F16D34] hover:bg-[#d55a24] text-white font-bold text-base uppercase tracking-wider rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
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
            {waitingForOrder ? "Creating Order..." : "Processing Payment..."}
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Pay Now
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Secured by Stripe</span>
      </div>
    </form>
  )
}

export default StripePaymentForm
