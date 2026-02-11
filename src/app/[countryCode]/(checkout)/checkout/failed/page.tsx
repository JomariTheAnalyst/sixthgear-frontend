import { Metadata } from "next"
import Link from "next/link"
import { XCircle } from "lucide-react"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ session_id?: string; reason?: string }>
}

export const metadata: Metadata = {
  title: "Payment Failed",
  description: "Your payment could not be processed",
}

/**
 * Stripe Checkout Failed Page
 *
 * Shown when payment fails or is canceled
 */
export default async function CheckoutFailedPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { session_id, reason } = searchParams

  const reasonMessages: Record<string, string> = {
    canceled: "You canceled the payment",
    failed: "Your payment could not be processed",
    expired: "Your payment session expired",
    insufficient_funds: "Insufficient funds in your account",
    card_declined: "Your card was declined",
  }

  const message = reason
    ? reasonMessages[reason] || "Payment failed"
    : "Payment failed"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">{message}</p>

        {/* Session ID (for debugging) */}
        {session_id && (
          <p className="text-sm text-gray-400 mb-8">Session ID: {session_id}</p>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href={`/${params.countryCode}/checkout`}
            className="block w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </Link>

          <Link
            href={`/${params.countryCode}/cart`}
            className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors"
          >
            Return to Cart
          </Link>

          <Link
            href={`/${params.countryCode}`}
            className="block w-full text-gray-600 py-3 px-6 hover:text-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Need help? Contact us:</p>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Phone:</span> 0995 093 0157
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Facebook:</span>{" "}
              <a
                href="https://facebook.com/camille.sixthgear"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                facebook.com/camille.sixthgear
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
