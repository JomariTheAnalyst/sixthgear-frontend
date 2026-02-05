/**
 * Payment Status Page
 *
 * Agent: Frontend Specialist
 * Skills: NextJS React Expert, Frontend Design
 *
 * Displays payment status after Xendit payment (GCash/Bank Transfer)
 */

import { Metadata } from "next"
import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CheckCircleSolid } from "@medusajs/icons"

export const metadata: Metadata = {
  title: "Payment Status",
  description: "Check your payment status",
}

interface PaymentStatusPageProps {
  searchParams: {
    status?: string
    external_id?: string
    order_id?: string
  }
}

export default async function PaymentStatusPage({
  searchParams,
}: PaymentStatusPageProps) {
  const { status, external_id, order_id } = searchParams

  if (!status) {
    notFound()
  }

  const isSuccess = status === "PAID" || status === "SETTLED"
  const isPending = status === "PENDING"
  const isFailed = status === "FAILED" || status === "EXPIRED"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Success State */}
        {isSuccess && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleSolid className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. Thank you for your
              order!
            </p>

            {order_id && (
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {order_id}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <LocalizedClientLink
                href={`/order/confirmed/${order_id || external_id}`}
                className="block w-full h-12 bg-[#F16D34] hover:bg-[#d55a24] text-white font-bold rounded-lg transition-colors flex items-center justify-center"
              >
                View Order Details
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/account/orders"
                className="block w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                View All Orders
              </LocalizedClientLink>
            </div>
          </div>
        )}

        {/* Pending State */}
        {isPending && (
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Pending
            </h1>
            <p className="text-gray-600 mb-6">
              We're waiting for your payment to be confirmed. This usually takes
              a few minutes.
            </p>

            {external_id && (
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-1">Reference ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {external_id}
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                💡 Your order will be automatically confirmed once payment is
                received. You can close this page and check your order status
                later.
              </p>
            </div>

            <div className="space-y-3">
              <LocalizedClientLink
                href="/account/orders"
                className="block w-full h-12 bg-[#F16D34] hover:bg-[#d55a24] text-white font-bold rounded-lg transition-colors flex items-center justify-center"
              >
                Check Order Status
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/"
                className="block w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                Continue Shopping
              </LocalizedClientLink>
            </div>
          </div>
        )}

        {/* Failed State */}
        {isFailed && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment {status === "EXPIRED" ? "Expired" : "Failed"}
            </h1>
            <p className="text-gray-600 mb-6">
              {status === "EXPIRED"
                ? "Your payment session has expired. Please try again."
                : "We couldn't process your payment. Please try again or use a different payment method."}
            </p>

            <div className="space-y-3">
              <LocalizedClientLink
                href="/checkout"
                className="block w-full h-12 bg-[#F16D34] hover:bg-[#d55a24] text-white font-bold rounded-lg transition-colors flex items-center justify-center"
              >
                Try Again
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/cart"
                className="block w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                Back to Cart
              </LocalizedClientLink>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <LocalizedClientLink
              href="/contact"
              className="font-medium text-[#F16D34] hover:underline"
            >
              Contact Support
            </LocalizedClientLink>
          </p>
        </div>
      </div>
    </div>
  )
}
