import { Metadata } from "next"
import Link from "next/link"
import CartRefresh from "@modules/order/components/cart-refresh"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    session_id?: string
    cart_id?: string
    order_id?: string
    refresh?: string
  }>
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your order has been confirmed",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  return (
    <>
      {/* Force refresh cart on page load */}
      {searchParams.refresh && <CartRefresh />}

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed
            successfully.
          </p>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm text-gray-600 space-y-2">
              {searchParams.order_id && (
                <div>
                  <span className="font-medium">Order ID:</span>
                  <br />
                  <span className="text-xs font-mono break-all">
                    {searchParams.order_id}
                  </span>
                </div>
              )}
              {searchParams.session_id && (
                <div>
                  <span className="font-medium">Payment ID:</span>
                  <br />
                  <span className="text-xs font-mono break-all">
                    {searchParams.session_id}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium">What's next?</span>
                <br />
                <span>
                  You will receive an order confirmation email shortly.
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={`/${params.countryCode}`}
              className="block w-full px-6 py-3 bg-[#F16D34] text-white font-semibold rounded-lg hover:bg-[#d55a24] transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/${params.countryCode}/account/orders`}
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Orders
            </Link>
          </div>

          {/* Support */}
          <p className="text-xs text-gray-500 mt-6">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </>
  )
}
