"use client"

import { useState } from "react"
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe, StripeCardElementChangeEvent } from "@stripe/stripe-js"
import { HttpTypes } from "@medusajs/types"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

interface StripePaymentElementProps {
  cart: HttpTypes.StoreCart
  onPaymentComplete: (orderId: string) => void
  onError: (error: string) => void
}

/**
 * Stripe Payment Element Component
 *
 * Uses Stripe Elements (embedded card form) following Medusa's official documentation
 * @see https://docs.medusajs.com/resources/storefront-development/checkout/payment/stripe
 */
export default function StripePaymentElement({
  cart,
  onPaymentComplete,
  onError,
}: StripePaymentElementProps) {
  // Get client secret from payment session
  const clientSecret = cart?.payment_collection?.payment_sessions?.[0]?.data
    ?.client_secret as string

  if (!clientSecret) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          Payment session not initialized. Please refresh and try again.
        </p>
      </div>
    )
  }

  return (
    <div>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#000000",
              colorBackground: "#ffffff",
              colorText: "#1f2937",
              colorDanger: "#ef4444",
              fontFamily: "system-ui, sans-serif",
              spacingUnit: "4px",
              borderRadius: "8px",
            },
          },
        }}
      >
        <StripeForm
          cart={cart}
          clientSecret={clientSecret}
          onPaymentComplete={onPaymentComplete}
          onError={onError}
        />
      </Elements>
    </div>
  )
}

interface StripeFormProps {
  cart: HttpTypes.StoreCart
  clientSecret: string
  onPaymentComplete: (orderId: string) => void
  onError: (error: string) => void
}

function StripeForm({
  cart,
  clientSecret,
  onPaymentComplete,
  onError,
}: StripeFormProps) {
  const [loading, setLoading] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete)
    setCardError(event.error?.message || null)
  }

  const handlePayment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    if (!stripe || !elements || !cart || !clientSecret) {
      onError("Payment system not ready. Please refresh and try again.")
      return
    }

    const card = elements.getElement(CardElement)

    if (!card) {
      onError("Card element not found. Please refresh and try again.")
      return
    }

    setLoading(true)
    setCardError(null)

    try {
      console.log("[Stripe Payment] Confirming card payment...")

      // Step 1: Authorize payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: `${
                cart.billing_address?.first_name ||
                cart.shipping_address?.first_name ||
                ""
              } ${
                cart.billing_address?.last_name ||
                cart.shipping_address?.last_name ||
                ""
              }`.trim(),
              email: cart.email,
              phone:
                cart.billing_address?.phone ||
                cart.shipping_address?.phone ||
                undefined,
              address: {
                city:
                  cart.billing_address?.city ||
                  cart.shipping_address?.city ||
                  undefined,
                country:
                  cart.billing_address?.country_code ||
                  cart.shipping_address?.country_code ||
                  undefined,
                line1:
                  cart.billing_address?.address_1 ||
                  cart.shipping_address?.address_1 ||
                  undefined,
                line2:
                  cart.billing_address?.address_2 ||
                  cart.shipping_address?.address_2 ||
                  undefined,
                postal_code:
                  cart.billing_address?.postal_code ||
                  cart.shipping_address?.postal_code ||
                  undefined,
                state:
                  cart.billing_address?.province ||
                  cart.shipping_address?.province ||
                  undefined,
              },
            },
          },
        })

      if (stripeError) {
        console.error("[Stripe Payment] Payment failed:", stripeError)
        onError(stripeError.message || "Payment failed. Please try again.")
        setLoading(false)
        return
      }

      if (paymentIntent?.status !== "succeeded") {
        console.error(
          "[Stripe Payment] Payment not succeeded:",
          paymentIntent?.status
        )
        onError("Payment was not completed. Please try again.")
        setLoading(false)
        return
      }

      console.log("[Stripe Payment] ✅ Payment authorized:", paymentIntent.id)

      // Step 2: Authorize the payment session in Medusa
      console.log("[Stripe Payment] Authorizing payment session in Medusa...")

      const paymentSession = cart.payment_collection?.payment_sessions?.find(
        (ps: any) => ps.provider_id === "pp_stripe_stripe"
      )

      if (!paymentSession) {
        throw new Error("Payment session not found")
      }

      console.log("[Stripe Payment] Payment session ID:", paymentSession.id)

      // Authorize the payment session
      const authorizeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-collections/${cart.payment_collection.id}/payment-sessions/${paymentSession.id}/authorize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      )

      if (!authorizeResponse.ok) {
        const errorData = await authorizeResponse.json()
        console.error("[Stripe Payment] Authorization failed:", errorData)
        throw new Error(errorData.message || "Failed to authorize payment")
      }

      console.log("[Stripe Payment] ✅ Payment session authorized in Medusa")

      // Step 3: Complete cart to create order
      console.log("[Stripe Payment] Completing cart...")
      console.log("[Stripe Payment] Cart ID:", cart.id)
      console.log(
        "[Stripe Payment] Backend URL:",
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
      )

      const completeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      )

      console.log(
        "[Stripe Payment] Complete response status:",
        completeResponse.status
      )

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json()
        console.error("[Stripe Payment] Cart completion failed:", errorData)
        console.error("[Stripe Payment] Error type:", errorData.type)
        console.error("[Stripe Payment] Error message:", errorData.message)
        throw new Error(errorData.message || "Failed to complete order")
      }

      const result = await completeResponse.json()
      console.log("[Stripe Payment] Complete result:", result)

      if (result.type === "order" && result.order) {
        console.log("[Stripe Payment] ✅ Order created:", result.order.id)
        onPaymentComplete(result.order.id)
      } else {
        console.error("[Stripe Payment] Unexpected result type:", result.type)
        console.error("[Stripe Payment] Full result:", result)
        throw new Error("Order was not created. Please contact support.")
      }
    } catch (err: any) {
      console.error("[Stripe Payment] Error:", err)
      onError(err.message || "An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Card Input */}
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": {
                  color: "#9ca3af",
                },
              },
              invalid: {
                color: "#ef4444",
              },
            },
            hidePostalCode: false,
          }}
          onChange={handleCardChange}
        />
      </div>

      {/* Card Error */}
      {cardError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
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
            <span className="text-sm font-medium text-red-800">
              {cardError}
            </span>
          </div>
        </div>
      )}

      {/* Pay Button */}
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading || !stripe || !cardComplete}
        className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold text-base uppercase tracking-wider rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </button>

      {/* Security Badge */}
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
        <span>Secured by Stripe • Your payment information is encrypted</span>
      </div>
    </div>
  )
}
