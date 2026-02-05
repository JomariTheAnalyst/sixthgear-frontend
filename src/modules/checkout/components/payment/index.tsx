"use client"

import { RadioGroup } from "@headlessui/react"
import { paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer from "@modules/checkout/components/payment-container"
import StripePayment from "@modules/checkout/components/payment-stripe"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? availablePaymentMethods?.[0]?.id ?? ""
  )
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Always open by default - no need to click edit
  const isOpen = true

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setOrderError(null)

    console.log("[Payment] Selected payment method:", method)
    console.log("[Payment] Cart ID:", cart.id)
    console.log("[Payment] Cart payment collection:", cart.payment_collection)

    // Check if cart has payment collection
    if (!cart.payment_collection) {
      console.error("[Payment] ❌ Cart has no payment collection!")
      setError(
        "Cart is not ready for payment. Please refresh the page and try again."
      )
      return
    }

    setSelectedPaymentMethod(method)

    // Initiate payment session when method is selected
    try {
      console.log("[Payment] Initiating payment session for provider:", method)
      const result = await initiatePaymentSession(cart, {
        provider_id: method,
      })
      console.log(
        "[Payment] ✅ Payment session initiated successfully:",
        result
      )

      // The result should contain the updated cart with payment session
      // Force page reload to get fresh cart data with client_secret
      console.log("[Payment] Reloading page to fetch updated cart...")
      window.location.reload()
    } catch (err: any) {
      console.error("[Payment] ❌ Failed to initiate payment session:", err)
      console.error("[Payment] Error details:", err)
      setError(
        err.message || "Failed to initialize payment method. Please try again."
      )
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  // Check if previous steps are completed
  const previousStepsCompleted =
    cart?.shipping_address &&
    cart?.email &&
    (cart?.shipping_methods?.length ?? 0) > 0

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  // Check if ready to place order
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const canPlaceOrder =
    agreedToTerms && !notReady && (paidByGiftcard || selectedPaymentMethod)

  // Handle place order for manual/COD payments (not Stripe)
  const handlePlaceOrder = async () => {
    setSubmitting(true)
    setOrderError(null)

    try {
      // Ensure payment session is initiated
      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession && selectedPaymentMethod) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      // Place the order (COD / Manual payment)
      await placeOrder()
      setOrderSuccess(true)
    } catch (err: any) {
      setOrderError(err.message || "Failed to place order")
      setSubmitting(false)
    }
  }

  // Handle Stripe payment success
  const handleStripeSuccess = () => {
    setOrderSuccess(true)
  }

  // Handle Stripe payment error
  const handleStripeError = (errorMessage: string) => {
    setOrderError(errorMessage)
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  // Auto-select first payment method if none selected
  useEffect(() => {
    if (!selectedPaymentMethod && availablePaymentMethods?.length > 0) {
      setSelectedPaymentMethod(availablePaymentMethods[0].id)
    }
  }, [availablePaymentMethods, selectedPaymentMethod])

  // Success screen
  if (orderSuccess) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleSolid className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. You will receive a confirmation email
          shortly.
        </p>
        <LocalizedClientLink
          href="/account/orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          View Your Orders
        </LocalizedClientLink>
      </div>
    )
  }

  // Check if Stripe is selected (handle multiple Stripe provider IDs)
  const isStripeSelected =
    selectedPaymentMethod === "stripe" ||
    selectedPaymentMethod?.startsWith("pp_stripe") ||
    selectedPaymentMethod?.includes("stripe")

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-sm ${
              paymentReady
                ? "bg-green-500 text-white"
                : previousStepsCompleted
                ? "bg-[#F16D34] text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {paymentReady ? <CheckCircleSolid className="w-6 h-6" /> : "3"}
          </div>
          <div>
            <Heading
              level="h2"
              className={clx("text-xl font-bold", {
                "text-gray-400": !previousStepsCompleted,
                "text-gray-900": previousStepsCompleted,
              })}
            >
              Payment & Review
            </Heading>
            <p className="text-sm text-gray-500 mt-0.5">
              Complete your order securely
            </p>
          </div>
        </div>
      </div>

      {previousStepsCompleted ? (
        <div>
          {/* Payment Methods */}
          {!paidByGiftcard && availablePaymentMethods?.length > 0 && (
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select Payment Method
              </p>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
                className="space-y-3"
              >
                {availablePaymentMethods.map((paymentMethod) => {
                  const isThisStripe =
                    paymentMethod.id === "stripe" ||
                    paymentMethod.id?.startsWith("pp_stripe") ||
                    paymentMethod.id?.includes("stripe")

                  return (
                    <PaymentContainer
                      key={paymentMethod.id}
                      paymentInfoMap={paymentInfoMap}
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                    >
                      {/* Show Stripe form inside accordion when this payment method is selected */}
                      {isThisStripe &&
                        selectedPaymentMethod === paymentMethod.id &&
                        agreedToTerms && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <StripePayment
                              cart={cart}
                              onSuccess={handleStripeSuccess}
                              onError={handleStripeError}
                              submitting={submitting}
                              setSubmitting={setSubmitting}
                            />
                          </div>
                        )}
                    </PaymentContainer>
                  )
                })}
              </RadioGroup>
            </div>
          )}

          {paidByGiftcard && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <Text className="text-sm font-medium text-green-800">
                Your order will be paid with gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          {/* Terms and Conditions Checkbox */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
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

          {/* Order Error Message */}
          {orderError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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

          {/* Place Order Button (for non-Stripe payments) */}
          {!isStripeSelected && (
            <>
              <button
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder || submitting}
                className="w-full h-14 mt-6 bg-[#F16D34] hover:bg-[#d55a24] text-white font-bold text-base uppercase tracking-wider rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="submit-order-button"
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

              {/* Helper text */}
              {!agreedToTerms && (
                <p className="mt-3 text-xs text-gray-500 text-center">
                  Please agree to the Terms of Service and Privacy Policy to
                  place your order.
                </p>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Complete the previous steps to proceed with payment.
        </div>
      )}
    </div>
  )
}

export default Payment
