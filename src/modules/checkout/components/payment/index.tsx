"use client"

import { RadioGroup } from "@headlessui/react"
import { paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer from "@modules/checkout/components/payment-container"
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

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
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
    agreedToTerms &&
    !notReady &&
    (paidByGiftcard || selectedPaymentMethod)

  // Handle place order for manual/COD payments
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              !isOpen && paymentReady
                ? "bg-green-500 text-white"
                : !isOpen && !paymentReady
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-900 text-white"
            }`}
          >
            {!isOpen && paymentReady ? (
              <CheckCircleSolid className="w-5 h-5" />
            ) : (
              "3"
            )}
          </div>
          <Heading
            level="h2"
            className={clx("text-lg font-semibold", {
              "text-gray-400": !isOpen && !paymentReady && !previousStepsCompleted,
              "text-gray-900": isOpen || paymentReady || previousStepsCompleted,
            })}
          >
            Payment & Order
          </Heading>
        </div>
        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-sm font-medium text-[#F16D34] hover:text-[#d55a24] transition-colors"
            data-testid="edit-payment-button"
          >
            Edit
          </button>
        )}
      </div>

      {/* Show content if step is payment OR if previous steps are completed */}
      {(isOpen || previousStepsCompleted) && (
        <div>
          {/* Payment Methods */}
          {!paidByGiftcard && availablePaymentMethods?.length > 0 && (
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</p>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
                className="space-y-3"
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
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

          {/* Place Order Button */}
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
              Please agree to the Terms of Service and Privacy Policy to place your order.
            </p>
          )}
        </div>
      )}

      {/* Summary view when not open and payment not ready */}
      {!isOpen && !previousStepsCompleted && (
        <div className="text-sm text-gray-500">
          Complete the previous steps to proceed with payment.
        </div>
      )}

      {/* Summary when payment is ready but section is collapsed */}
      {!isOpen && paymentReady && activeSession && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Payment Method
            </Text>
            <Text
              className="text-sm text-gray-600"
              data-testid="payment-method-summary"
            >
              {paymentInfoMap[activeSession?.provider_id]?.title ||
                activeSession?.provider_id}
            </Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Payment Details
            </Text>
            <div
              className="flex gap-2 items-center"
              data-testid="payment-details-summary"
            >
              <Container className="flex items-center h-7 w-fit p-2 bg-gray-100 rounded">
                {paymentInfoMap[selectedPaymentMethod]?.icon || (
                  <CreditCard />
                )}
              </Container>
              <Text className="text-sm text-gray-600">
                Cash on Delivery
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment
