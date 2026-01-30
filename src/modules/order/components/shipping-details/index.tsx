import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  // Safely access fulfillments
  const fulfillments = (order as any).fulfillments || []
  const hasFulfillments = fulfillments.length > 0

  // Get all tracking info from fulfillment labels
  const trackingInfo: Array<{ number: string; url?: string }> = []
  fulfillments.forEach((fulfillment: any) => {
    // Check for labels array (from fulfillment_label table)
    if (fulfillment.labels && Array.isArray(fulfillment.labels)) {
      fulfillment.labels.forEach((label: any) => {
        if (label.tracking_number) {
          trackingInfo.push({
            number: label.tracking_number,
            url: label.tracking_url || undefined,
          })
        }
      })
    }
    // Fallback: check for tracking_numbers array (legacy format)
    else if (
      fulfillment.tracking_numbers &&
      Array.isArray(fulfillment.tracking_numbers)
    ) {
      fulfillment.tracking_numbers.forEach((number: string) => {
        trackingInfo.push({ number })
      })
    }
  })

  const hasTracking = trackingInfo.length > 0

  return (
    <div>
      <h2
        className="text-xl font-bold text-gray-900 mb-6"
        style={{ fontFamily: "BRHendrix, sans-serif" }}
      >
        Delivery Information
      </h2>

      <div className="space-y-6">
        {/* Shipping Address */}
        <div data-testid="shipping-address-summary">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              Shipping Address
            </p>
          </div>
          <div className="pl-10 text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-gray-900">
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </p>
            <p className="mt-1">
              {order.shipping_address?.address_1}
              {order.shipping_address?.address_2 &&
                `, ${order.shipping_address.address_2}`}
            </p>
            <p>
              {order.shipping_address?.postal_code},{" "}
              {order.shipping_address?.city}
            </p>
            <p>{order.shipping_address?.country_code?.toUpperCase()}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div data-testid="shipping-contact-summary">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              Contact Details
            </p>
          </div>
          <div className="pl-10 text-sm space-y-1">
            <p className="text-gray-700">{order.email}</p>
            <p className="text-gray-700">{order.shipping_address?.phone}</p>
          </div>
        </div>

        {/* Tracking Information */}
        <div data-testid="shipping-tracking-summary">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              Tracking Number
            </p>
          </div>
          <div className="pl-10">
            {hasTracking ? (
              <div className="flex flex-col gap-3">
                {trackingInfo.map((tracking, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <span className="font-mono text-sm font-bold text-gray-900 tracking-wide">
                        {tracking.number}
                      </span>
                      {tracking.url && (
                        <a
                          href={tracking.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#F16D34] text-white text-sm font-semibold rounded-lg hover:bg-[#d95d2a] transition-colors duration-200"
                          style={{ fontFamily: "BRHendrix, sans-serif" }}
                        >
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
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Track Package
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600">
                  {hasFulfillments
                    ? "Tracking number will be updated soon."
                    : "Tracking number will be available once your order is shipped."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Method */}
        {order.shipping_methods && order.shipping_methods.length > 0 && (
          <div data-testid="shipping-method-summary">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                Shipping Method
              </p>
            </div>
            <div className="pl-10 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {order.shipping_methods[0]?.name || "Standard Shipping"}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {convertToLocale({
                  amount: order.shipping_methods[0]?.total ?? 0,
                  currency_code: order.currency_code,
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShippingDetails
