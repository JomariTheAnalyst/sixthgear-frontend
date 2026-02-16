"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InvoiceDownload from "@modules/order/components/invoice-download"
import { convertToLocale } from "@lib/util/money"

type OrderConfirmedTemplateProps = {
  order: HttpTypes.StoreOrder
  countryCode: string
}

export default function OrderConfirmedTemplate({
  order,
  countryCode,
}: OrderConfirmedTemplateProps) {
  // Extensive debugging
  console.log("[Template] Full order object:", order)
  console.log("[Template] Order items:", order.items)
  console.log("[Template] Items length:", order.items?.length)
  console.log("[Template] Shipping total raw:", order.shipping_total)
  console.log("[Template] Payment collections:", order.payment_collections)
  console.log(
    "[Template] Payment provider:",
    order.payment_collections?.[0]?.payment_sessions?.[0]?.provider_id
  )

  // Helper to extract numeric value from BigNumber or regular number
  const getNumericValue = (value: any): number => {
    if (!value) return 0
    if (typeof value === "number") return value
    if (value.numeric_ !== undefined) return Number(value.numeric_)
    if (value.value !== undefined) return Number(value.value)
    return Number(value) || 0
  }

  // Format order number as SIX-XXXXXX
  const displayId = getNumericValue(order.display_id)
  const orderNumber = displayId
    ? `SIX-${displayId.toString().padStart(6, "0")}`
    : `#${order.id.slice(-8)}`

  // Format date
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Detect payment method
  const paymentMethod = getPaymentMethod(order)
  const isCOD = paymentMethod === "Cash on Delivery (COD)"

  // Format currency
  const formatPrice = (amount: any) => {
    const numericValue = getNumericValue(amount)
    return convertToLocale({
      amount: numericValue,
      currency_code: order.currency_code,
    })
  }

  // Extract numeric values for totals
  const subtotal = getNumericValue(order.subtotal)
  const shippingTotal = getNumericValue(order.shipping_total)
  const taxTotal = getNumericValue(order.tax_total)
  const discountTotal = getNumericValue(order.discount_total)
  const total = getNumericValue(order.total)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Success Icon */}
          <div className="flex justify-center pt-12 pb-6">
            <div className="w-16 h-16 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center px-8 pb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Order Confirmed
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. A receipt has been sent
              <br />
              to your email.
            </p>
          </div>

          {/* Order Info Header */}
          <div className="px-8 pb-6">
            <div className="flex justify-between items-start text-sm">
              <div>
                <p className="text-gray-500 uppercase text-xs mb-1">
                  Order No.
                </p>
                <p className="font-semibold text-gray-900">{orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 uppercase text-xs mb-1">Date</p>
                <p className="font-semibold text-gray-900">{orderDate}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Order Items */}
          <div className="px-8 py-6">
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const itemQuantity = getNumericValue(item.quantity)
                  const itemTotal = getNumericValue(item.total)
                  const variantTitle =
                    item.variant?.title || item.subtitle || ""

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <span className="text-gray-500 text-sm mt-0.5">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.title || item.product_title || "Product"}
                            </p>
                            {variantTitle && variantTitle !== "Default" && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                {variantTitle}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              Qty: {itemQuantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No items found in this order
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Order Summary */}
          <div className="px-8 py-6">
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shippingTotal === 0 ? "Free" : formatPrice(shippingTotal)}
                </span>
              </div>

              {/* Discount */}
              {discountTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">
                    -{formatPrice(discountTotal)}
                  </span>
                </div>
              )}

              {/* Tax */}
              {taxTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(taxTotal)}</span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-900 uppercase text-sm">
                  Total Paid
                </span>
                <span className="font-bold text-gray-900 text-xl">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {paymentMethod && (
            <>
              <div className="border-t border-gray-200"></div>
              <div className="px-8 py-4 bg-gray-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900">
                    {paymentMethod}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* COD Payment Notice */}
          {isCOD && (
            <div className="px-8 py-6 bg-yellow-50 border-t-2 border-yellow-400">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5"
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
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    Cash on Delivery
                  </h3>
                  <p className="text-sm text-yellow-800">
                    Please prepare the exact amount of{" "}
                    <span className="font-bold">{formatPrice(total)}</span> for
                    payment upon delivery. Having the exact amount ready helps
                    speed up the delivery process.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-8 py-6 space-y-3">
            {/* Download Invoice - Centered Black Button */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <InvoiceDownload orderId={order.id} />
              </div>
            </div>

            {/* Back to Shop */}
            <LocalizedClientLink
              href="/"
              className="block w-full px-6 py-3 text-center border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Shop
            </LocalizedClientLink>
          </div>

          {/* Footer Help Text */}
          <div className="px-8 pb-8 text-center">
            <p className="text-xs text-gray-500">Need help with your order?</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Helper function to detect payment method from order
 */
function getPaymentMethod(order: HttpTypes.StoreOrder): string {
  // Check payment collections
  const paymentCollection = order.payment_collections?.[0]
  if (paymentCollection) {
    const paymentSession = paymentCollection.payment_sessions?.[0]
    if (paymentSession) {
      const providerId = paymentSession.provider_id

      // Map provider IDs to display names
      if (providerId === "pp_system_default") {
        return "Cash on Delivery (COD)"
      } else if (providerId?.includes("stripe")) {
        return "Card via Stripe"
      } else if (providerId?.includes("paypal")) {
        return "PayPal"
      }
    }
  }

  // Check metadata
  if (order.metadata?.payment_provider === "pp_system_default") {
    return "Cash on Delivery (COD)"
  }

  // Default
  return "Online Payment"
}
