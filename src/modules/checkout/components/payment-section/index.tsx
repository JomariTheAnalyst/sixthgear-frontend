"use client"

import { useState, useEffect } from "react"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { RadioGroup, Radio } from "@headlessui/react"
import { paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession, placeOrder } from "@lib/data/cart"
import PaymentContainer from "../payment-container"
import StripeCheckoutButton from "../stripe-checkout-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TrustSignals from "../trust-signals"

interface PaymentSectionProps {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: any[]
  isEnabled: boolean
}

/**
 * Payment Section Component
 *
 * Always visible payment section with Stripe integration
 * No accordion - payment form is always shown
 * Includes terms checkbox and place order button
 */
const PaymentSection = ({
  cart,
  availablePaymentMethods,
  isEnabled,
}: PaymentSectionProps) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? availablePaymentMethods?.[0]?.id ?? ""
  )
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [initializingPayment, setInitializingPayment] = useState(false)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  // Check if Stripe is selected
  const isStripeSelected =
    selectedPaymentMethod === "stripe" ||
    selectedPaymentMethod?.startsWith("pp_stripe") ||
    selectedPaymentMethod?.includes("stripe")

  // Set payment method
  const setPaymentMethod = async (method: string) => {
    setError(null)
    setOrderError(null)
    setInitializingPayment(true)

    console.log("[Payment] Selected payment method:", method)
    console.log(
      "[Payment] Cart has payment collection:",
      !!cart.payment_collection
    )

    setSelectedPaymentMethod(method)

    try {
      console.log("[Payment] Initiating payment session...")
      await initiatePaymentSession(cart, { provider_id: method })

      // Wait for backend to process and create payment session
      console.log("[Payment] Waiting for payment session to be created...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[Payment] Payment session should be created, reloading...")
      window.location.reload()
    } catch (err: any) {
      console.error("[Payment] Failed to initiate payment session:", err)
      setError(err.message || "Failed to initialize payment method.")
      setInitializingPayment(false)
    }
  }

  // Handle place order for non-Stripe payments
  const handlePlaceOrder = async () => {
    setSubmitting(true)
    setOrderError(null)

    try {
      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession && selectedPaymentMethod) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      await placeOrder()
      setOrderSuccess(true)
    } catch (err: any) {
      setOrderError(err.message || "Failed to place order")
      setSubmitting(false)
    }
  }

  // Handle Stripe success
  const handleStripeSuccess = () => {
    setOrderSuccess(true)
  }

  // Handle Stripe error
  const handleStripeError = (errorMessage: string) => {
    setOrderError(errorMessage)
  }

  // Auto-select first payment method
  useEffect(() => {
    if (!selectedPaymentMethod && availablePaymentMethods?.length > 0) {
      setSelectedPaymentMethod(availablePaymentMethods[0].id)
    }
  }, [availablePaymentMethods, selectedPaymentMethod])

  // Success screen
  if (orderSuccess) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleSolid className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. You will receive a confirmation email
            shortly.
          </p>
          <LocalizedClientLink
            href="/account/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F16D34] text-white font-semibold rounded-lg hover:bg-[#d55a24] transition-colors"
          >
            View Your Orders
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  // Disabled view
  if (!isEnabled) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden opacity-60">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-base font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-400">Payment</h3>
              <p className="text-sm text-gray-400 mt-0.5">
                Complete previous steps first
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const canPlaceOrder =
    agreedToTerms && (paidByGiftcard || selectedPaymentMethod)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#F16D34] text-white flex items-center justify-center text-base font-bold">
            4
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Payment</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Complete your order securely
            </p>
          </div>
        </div>

        {/* Payment Methods Selection */}
        {!paidByGiftcard && availablePaymentMethods?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Select Payment Method
            </p>

            {/* Loading Overlay */}
            {initializingPayment && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
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
                  <span className="text-sm font-medium text-blue-800">
                    Initializing payment method, please wait...
                  </span>
                </div>
              </div>
            )}

            <RadioGroup
              value={selectedPaymentMethod}
              onChange={setPaymentMethod}
              className="space-y-3"
              disabled={initializingPayment}
            >
              {availablePaymentMethods.map((paymentMethod) => (
                <PaymentContainer
                  key={paymentMethod.id}
                  paymentInfoMap={paymentInfoMap}
                  paymentProviderId={paymentMethod.id}
                  selectedPaymentOptionId={selectedPaymentMethod}
                />
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Gift Card Payment */}
        {paidByGiftcard && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
            <p className="text-sm font-medium text-green-800">
              Your order will be paid with gift card
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Stripe Checkout (Hosted Page) - ONLY OPTION */}
        {isStripeSelected && selectedPaymentMethod && agreedToTerms && (
          <div className="mb-6">
            <div className="p-6 bg-gradient-to-br from-[#635BFF]/5 to-[#635BFF]/10 border-2 border-[#635BFF] rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-[#635BFF]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                </svg>
                <h4 className="text-sm font-bold text-gray-900">
                  Stripe Checkout
                </h4>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Secure, fast checkout on Stripe's hosted payment page. Supports
                all payment methods including cards, wallets, and
                buy-now-pay-later options.
              </p>
              <StripeCheckoutButton cart={cart} />
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#F16D34] focus:ring-[#F16D34]"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I agree to Sixthgear's{" "}
              <LocalizedClientLink
                href="/terms"
                className="font-medium text-[#F16D34] hover:underline"
              >
                Terms of Service
              </LocalizedClientLink>{" "}
              and{" "}
              <LocalizedClientLink
                href="/privacy"
                className="font-medium text-[#F16D34] hover:underline"
              >
                Privacy Policy
              </LocalizedClientLink>
              .
            </span>
          </label>
        </div>

        {/* Order Error */}
        {orderError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
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
                {orderError}
              </span>
            </div>
          </div>
        )}

        {/* Place Order Button - For Non-Stripe Payments */}
        {!isStripeSelected && (
          <button
            onClick={handlePlaceOrder}
            disabled={!canPlaceOrder || submitting}
            className="w-full h-14 bg-[#F16D34] hover:bg-[#d55a24] text-white font-bold text-base uppercase tracking-wider rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
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
                Processing Order...
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Place Order
              </>
            )}
          </button>
        )}

        {/* Helper Text */}
        {!agreedToTerms && (
          <p className="mt-3 text-xs text-gray-500 text-center">
            Please agree to the Terms of Service and Privacy Policy to continue.
          </p>
        )}

        {/* Trust Signals */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <TrustSignals variant="compact" />
        </div>
      </div>
    </div>
  )
}

export default PaymentSection
