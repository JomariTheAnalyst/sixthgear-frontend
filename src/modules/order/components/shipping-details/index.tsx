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
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Delivery Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div data-testid="shipping-address-summary">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Shipping Address
          </p>
          <div className="text-sm text-gray-900 leading-relaxed font-medium">
            <p>
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </p>
            <p className="text-gray-600 font-normal mt-1">
              {order.shipping_address?.address_1}
              {order.shipping_address?.address_2 &&
                `, ${order.shipping_address.address_2}`}
              <br />
              {order.shipping_address?.postal_code},{" "}
              {order.shipping_address?.city}
              <br />
              {order.shipping_address?.country_code?.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div data-testid="shipping-contact-summary">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Contact Details
          </p>
          <div className="text-sm text-gray-900 space-y-1">
            <p className="font-medium text-gray-900">{order.email}</p>
            <p className="text-gray-600">{order.shipping_address?.phone}</p>
          </div>
        </div>
      </div>

      {/* Tracking Information */}
      <div
        className="mt-6 pt-6 border-t border-gray-100"
        data-testid="shipping-tracking-summary"
      >
        <p className="text-sm font-medium text-gray-500 mb-2">
          Tracking Number
        </p>
        <div className="text-sm text-gray-900">
          {hasTracking ? (
            <div className="flex flex-col gap-3">
              {trackingInfo.map((tracking, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="font-mono text-sm font-semibold text-gray-900 tracking-wide">
                      {tracking.number}
                    </span>
                    {tracking.url && (
                      <a
                        href={tracking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-[#F16D34] text-white text-sm font-medium rounded-lg hover:bg-[#d95d2a] transition-colors duration-200"
                      >
                        Track Now
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic text-sm">
              {hasFulfillments
                ? "Tracking number will be updated soon."
                : "Tracking number will be available once your order is shipped."}
            </p>
          )}
        </div>
      </div>

      {/* Shipping Method */}
      {order.shipping_methods && order.shipping_methods.length > 0 && (
        <div
          className="mt-6 pt-6 border-t border-gray-100"
          data-testid="shipping-method-summary"
        >
          <p className="text-sm font-medium text-gray-500 mb-2">Method</p>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-900">
              {order.shipping_methods[0]?.name || "Standard Shipping"}
            </span>
            <span className="text-gray-900">
              {convertToLocale({
                amount: order.shipping_methods[0]?.total ?? 0,
                currency_code: order.currency_code,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShippingDetails
