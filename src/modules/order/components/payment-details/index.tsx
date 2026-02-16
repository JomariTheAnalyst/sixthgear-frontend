import { paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const paymentSession = order.payment_collections?.[0]?.payment_sessions?.[0]
  const providerId =
    payment?.provider_id ||
    paymentSession?.provider_id ||
    (order as any).payment_provider_id

  // Determine if COD - check for pp_system_default, manual, or cod
  const isCOD =
    providerId === "pp_system_default" ||
    providerId === "manual" ||
    providerId === "cod"

  // Determine display title
  const paymentTitle = isCOD
    ? "Cash on Delivery (COD)"
    : paymentInfoMap[providerId]?.title || providerId

  return (
    <div>
      <h2
        className="text-xl font-bold text-gray-900 mb-6"
        style={{ fontFamily: "BRHendrix, sans-serif" }}
      >
        Payment Information
      </h2>

      <div className="space-y-6">
        {/* Payment Method */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              Payment Method
            </p>
          </div>
          <div className="pl-10 flex items-center gap-3">
            {!isCOD && paymentInfoMap[providerId]?.icon && (
              <div className="flex items-center justify-center p-2 w-10 h-10 rounded-lg bg-gray-50 border border-gray-200">
                {paymentInfoMap[providerId].icon}
              </div>
            )}
            <span className="text-sm font-medium text-gray-900">
              {paymentTitle}
            </span>
          </div>
        </div>

        {/* Payment Amount */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Total Amount</p>
          </div>
          <div className="pl-10">
            <span
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "BRHendrix, sans-serif" }}
            >
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </span>
          </div>
        </div>

        {/* COD Notice */}
        {isCOD && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-amber-600"
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
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Cash on Delivery
                </p>
                <p className="text-sm text-amber-800">
                  Please prepare the exact amount of{" "}
                  <span className="font-bold">
                    {convertToLocale({
                      amount: order.total,
                      currency_code: order.currency_code,
                    })}
                  </span>{" "}
                  for the courier upon delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentDetails
