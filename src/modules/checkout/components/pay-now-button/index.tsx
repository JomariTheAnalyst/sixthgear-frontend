"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { initiatePaymentSession, placeOrder } from "@lib/data/cart"

interface PayNowButtonProps {
  cart: HttpTypes.StoreCart
  selectedPaymentMethod: string
  agreedToTerms: boolean
  isFormValid: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

/**
 * Pay Now Button Component
 *
 * Single button at the bottom of checkout form
 * Handles both COD and Stripe payment flows
 * Shows loading state to prevent spam clicking
 */
const PayNowButton = ({
  cart,
  selectedPaymentMethod,
  agreedToTerms,
  isFormValid,
  onSuccess,
  onError,
}: PayNowButtonProps) => {
  const [submitting, setSubmitting] = useState(false)

  // Check if Stripe is selected
  const isStripeSelected =
    selectedPaymentMethod === "stripe" ||
    selectedPaymentMethod?.startsWith("pp_stripe") ||
    selectedPaymentMethod?.includes("stripe")

  // Check if button should be disabled
  const isDisabled =
    !agreedToTerms || !isFormValid || !selectedPaymentMethod || submitting

  // Handle button click
  const handleClick = async () => {
    if (isDisabled) return

    setSubmitting(true)

    try {
      // For Stripe: The StripeCheckoutButton component handles the redirect
      // This button is only for COD and other direct payment methods
      if (isStripeSelected) {
        // Stripe button will handle this
        return
      }

      // For COD and other methods: Place order directly
      console.log(
        "[Pay Now] Placing order with payment method:",
        selectedPaymentMethod
      )

      // Ensure payment session is initialized
      const activeSession = cart.payment_collection?.payment_sessions?.find(
        (ps: any) => ps.status === "pending"
      )

      if (
        !activeSession ||
        activeSession.provider_id !== selectedPaymentMethod
      ) {
        console.log("[Pay Now] Initializing payment session...")
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      // Place order
      console.log("[Pay Now] Placing order...")
      await placeOrder()

      console.log("[Pay Now] ✅ Order placed successfully")
      onSuccess?.()
    } catch (err: any) {
      console.error("[Pay Now] ❌ Error:", err)
      const errorMessage =
        err.message || "Failed to place order. Please try again."
      onError?.(errorMessage)
      setSubmitting(false)
    }
  }

  // Get button text
  const getButtonText = () => {
    if (submitting) {
      return "Processing..."
    }
    if (!agreedToTerms) {
      return "Agree to Terms to Continue"
    }
    if (!isFormValid) {
      return "Complete All Fields"
    }
    return "Pay Now"
  }

  // Get button icon
  const getButtonIcon = () => {
    if (submitting) {
      return (
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
      )
    }

    return (
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
          d="M5 13l4 4L19 7"
        />
      </svg>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className="w-full h-14 bg-[#F16D34] hover:bg-[#d55a24] text-white font-bold text-base uppercase tracking-wider rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#F16D34] flex items-center justify-center gap-2"
    >
      {getButtonIcon()}
      {getButtonText()}
    </button>
  )
}

export default PayNowButton
