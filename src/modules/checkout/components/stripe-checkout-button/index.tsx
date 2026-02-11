"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

interface StripeCheckoutButtonProps {
  cart: HttpTypes.StoreCart
}

/**
 * Stripe Checkout Button Component
 *
 * Redirects to Stripe-hosted checkout page when clicked
 * Following official Stripe Checkout documentation
 *
 * @see https://stripe.com/docs/payments/checkout/how-checkout-works
 */
export default function StripeCheckoutButton({
  cart,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      // Validate cart has required data
      if (!cart.email) {
        setError("Please provide your email address")
        setLoading(false)
        return
      }

      if (!cart.shipping_address) {
        setError("Please provide your shipping address")
        setLoading(false)
        return
      }

      if (!cart.shipping_methods || cart.shipping_methods.length === 0) {
        setError("Please select a shipping method")
        setLoading(false)
        return
      }

      console.log(
        "[Stripe Checkout] Preparing cart for external payment:",
        cart.id
      )

      // Step 1: Create payment collection for cart (if not exists)
      console.log("[Stripe Checkout] Step 1: Creating payment collection...")
      const paymentCollectionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-collections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({
            cart_id: cart.id,
          }),
        }
      )

      if (!paymentCollectionResponse.ok) {
        const errorData = await paymentCollectionResponse.json()
        console.error("[Stripe Checkout] Payment collection error:", errorData)
        throw new Error(
          errorData.message || "Failed to create payment collection"
        )
      }

      const paymentCollectionData = await paymentCollectionResponse.json()
      console.log(
        "[Stripe Checkout] Payment collection response:",
        paymentCollectionData
      )
      console.log(
        "[Stripe Checkout] Response keys:",
        Object.keys(paymentCollectionData)
      )
      console.log(
        "[Stripe Checkout] Full response:",
        JSON.stringify(paymentCollectionData, null, 2)
      )

      // Handle different response formats - be very flexible
      let payment_collection

      // Medusa v2 returns: { payment_collection: {...} }
      if (paymentCollectionData.payment_collection) {
        payment_collection = paymentCollectionData.payment_collection
        console.log("[Stripe Checkout] Format: payment_collection object")
      }
      // Or direct object: { id: "..." }
      else if (paymentCollectionData.id) {
        payment_collection = paymentCollectionData
        console.log("[Stripe Checkout] Format: direct object")
      } else {
        console.error(
          "[Stripe Checkout] ❌ Unexpected payment collection response format:",
          paymentCollectionData
        )
        console.error(
          "[Stripe Checkout] Available keys:",
          Object.keys(paymentCollectionData)
        )
        throw new Error(
          "Unexpected response format from payment collection API. Check console for details."
        )
      }

      if (!payment_collection || !payment_collection.id) {
        console.error(
          "[Stripe Checkout] ❌ Payment collection missing ID:",
          payment_collection
        )
        throw new Error("Failed to get payment collection ID")
      }

      console.log(
        "[Stripe Checkout] ✅ Payment collection created:",
        payment_collection.id
      )

      // Step 2: Initialize payment session with system provider
      console.log("[Stripe Checkout] Step 2: Initializing payment session...")
      const sessionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-collections/${payment_collection.id}/payment-sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({
            provider_id: "pp_stripe_stripe",
            data: {
              stripe_checkout: true,
            },
          }),
        }
      )

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json()
        console.error("[Stripe Checkout] Payment session error:", errorData)
        throw new Error(errorData.message || "Failed to initialize payment")
      }

      const sessionData = await sessionResponse.json()
      console.log("[Stripe Checkout] Payment session response:", sessionData)
      console.log("[Stripe Checkout] Response keys:", Object.keys(sessionData))
      console.log(
        "[Stripe Checkout] Full response:",
        JSON.stringify(sessionData, null, 2)
      )

      // Handle different response formats - be very flexible
      let payment_session

      // Medusa v2 returns: { payment_collection: { payment_sessions: [...] } }
      if (sessionData.payment_collection?.payment_sessions) {
        payment_session = sessionData.payment_collection.payment_sessions[0]
        console.log(
          "[Stripe Checkout] Format: payment_collection.payment_sessions"
        )
      }
      // Or just: { payment_sessions: [...] }
      else if (
        sessionData.payment_sessions &&
        Array.isArray(sessionData.payment_sessions)
      ) {
        payment_session = sessionData.payment_sessions[0]
        console.log("[Stripe Checkout] Format: payment_sessions array")
      }
      // Or: { payment_session: {...} }
      else if (sessionData.payment_session) {
        payment_session = sessionData.payment_session
        console.log("[Stripe Checkout] Format: payment_session object")
      }
      // Or direct object: { id: "..." }
      else if (sessionData.id) {
        payment_session = sessionData
        console.log("[Stripe Checkout] Format: direct object")
      } else {
        console.error(
          "[Stripe Checkout] ❌ Unexpected payment session response format:",
          sessionData
        )
        console.error(
          "[Stripe Checkout] Available keys:",
          Object.keys(sessionData)
        )
        throw new Error(
          "Unexpected response format from payment session API. Check console for details."
        )
      }

      if (!payment_session || !payment_session.id) {
        console.error(
          "[Stripe Checkout] ❌ Payment session missing ID:",
          payment_session
        )
        throw new Error("Failed to get payment session ID")
      }

      console.log(
        "[Stripe Checkout] ✅ Payment session initialized:",
        payment_session.id
      )

      // Step 3: Create Stripe Checkout Session
      console.log("[Stripe Checkout] Step 3: Creating Stripe checkout...")

      // Get selected item IDs from sessionStorage
      const selectedItemsJson = sessionStorage.getItem("checkoutSelectedItems")
      const selectedItemIds = selectedItemsJson
        ? JSON.parse(selectedItemsJson)
        : []

      console.log(
        "[Stripe Checkout] Selected items for checkout:",
        selectedItemIds.length
      )

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/checkout-sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({
            cart_id: cart.id,
            payment_collection_id: payment_collection.id,
            payment_session_id: payment_session.id,
            selected_item_ids: selectedItemIds, // Pass selected items
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[Stripe Checkout] Checkout session error:", errorData)
        console.error("[Stripe Checkout] Response status:", response.status)

        // Provide user-friendly error messages
        let userMessage = errorData.error || "Failed to create checkout session"

        if (userMessage.includes("Invalid price for item")) {
          userMessage = "Processing your order. Please wait..."
        }

        throw new Error(userMessage)
      }

      const responseData = await response.json()
      console.log("[Stripe Checkout] Response data:", responseData)

      const { checkout_url } = responseData

      if (!checkout_url) {
        console.error(
          "[Stripe Checkout] No checkout_url in response:",
          responseData
        )
        throw new Error("Failed to get checkout URL from Stripe")
      }

      console.log("[Stripe Checkout] ✅ Redirecting to:", checkout_url)

      // Redirect to Stripe Checkout
      window.location.href = checkout_url
    } catch (err: any) {
      console.error("[Stripe Checkout] Error:", err)
      setError(err.message || "Failed to start checkout")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
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
            <span className="text-sm font-medium text-red-800">{error}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold text-base uppercase tracking-wider rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

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
        <span>
          Secured by Stripe • You'll be redirected to complete payment
        </span>
      </div>
    </div>
  )
}
