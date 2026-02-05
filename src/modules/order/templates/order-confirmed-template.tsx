"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircleSolid } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { retrieveCart } from "@lib/data/cart"

/**
 * Order Confirmed Template
 *
 * Professional order confirmation page with:
 * - Success animation
 * - Order details
 * - Next steps
 * - Support information
 */
export default function OrderConfirmedTemplate() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams.get("order_id")
  const paymentId = searchParams.get("payment_id")
  const cartId = searchParams.get("cart_id")

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        // Priority 1: If we have an order ID, show success
        if (orderId) {
          console.log("[Order Confirmed] Order ID:", orderId)
          setOrderData({
            id: orderId,
            message: "Order created successfully!",
          })
          setLoading(false)
          return
        }

        // Priority 2: If we have a cart ID, check if it's completed
        if (cartId) {
          const cart = await retrieveCart(cartId)

          if (cart?.completed_at) {
            // Cart is completed, order was created
            setOrderData({
              id: cart.id,
              email: cart.email,
              total: cart.total,
              currency_code: cart.currency_code,
              completed_at: cart.completed_at,
            })
            setLoading(false)
            return
          }
        }

        // Priority 3: If we have a payment ID but no order yet, show success anyway
        if (paymentId) {
          setOrderData({
            payment_id: paymentId,
            message: "Payment successful! Your order is being processed.",
          })
          setLoading(false)
          return
        }

        // No payment ID or cart ID
        setError("No order information found.")
        setLoading(false)
      } catch (err: any) {
        console.error("[Order Confirmed] Error:", err)
        setError("Failed to load order information.")
        setLoading(false)
      }
    }

    checkOrderStatus()
  }, [orderId, paymentId, cartId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F16D34] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <LocalizedClientLink
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F16D34] text-white font-semibold rounded-lg hover:bg-[#d55a24] transition-colors"
          >
            Return to Home
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with Animation */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <CheckCircleSolid className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Order Confirmed!
            </h1>
            <p className="text-green-50 text-lg">Thank you for your purchase</p>
          </div>

          {/* Order Details */}
          <div className="px-8 py-8">
            {orderData?.id && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Details
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm text-gray-900">
                      {orderData.id}
                    </span>
                  </div>
                  {orderData.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{orderData.email}</span>
                    </div>
                  )}
                  {orderData.total && (
                    <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-[#F16D34]">
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: orderData.currency_code || "PHP",
                        }).format(orderData.total / 100)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {orderData?.payment_id && !orderData?.id && (
              <div className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        {orderData.message}
                      </p>
                      <p className="text-xs text-blue-700">
                        Payment ID: {orderData.payment_id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What's Next?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#F16D34] text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Confirmation Email
                    </h3>
                    <p className="text-sm text-gray-600">
                      You'll receive an order confirmation email shortly with
                      your order details and tracking information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#F16D34] text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Order Processing
                    </h3>
                    <p className="text-sm text-gray-600">
                      We're preparing your order for shipment. You'll be
                      notified when it's on its way.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#F16D34] text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Track Your Order
                    </h3>
                    <p className="text-sm text-gray-600">
                      You can track your order status anytime from your account
                      dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <LocalizedClientLink
                href="/account/orders"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F16D34] text-white font-semibold rounded-lg hover:bg-[#d55a24] transition-colors"
              >
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                View Orders
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Continue Shopping
              </LocalizedClientLink>
            </div>

            {/* Support */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Need help with your order?
              </p>
              <LocalizedClientLink
                href="/contact"
                className="text-sm font-medium text-[#F16D34] hover:text-[#d55a24] transition-colors"
              >
                Contact Support →
              </LocalizedClientLink>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <svg
              className="w-8 h-8 text-green-600 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <p className="text-xs font-medium text-gray-900">Secure Payment</p>
            <p className="text-xs text-gray-500">SSL Encrypted</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <svg
              className="w-8 h-8 text-blue-600 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs font-medium text-gray-900">Email Updates</p>
            <p className="text-xs text-gray-500">Order Tracking</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <svg
              className="w-8 h-8 text-[#F16D34] mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <p className="text-xs font-medium text-gray-900">24/7 Support</p>
            <p className="text-xs text-gray-500">We're Here to Help</p>
          </div>
        </div>
      </div>
    </div>
  )
}
