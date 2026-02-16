import { cookies as nextCookies } from "next/headers"
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  // Debug logging
  console.log("=== ORDER COMPLETED TEMPLATE DEBUG ===")
  console.log("Order ID:", order.id)
  console.log("Display ID:", order.display_id)
  console.log("Items count:", order.items?.length || 0)
  console.log("Items:", JSON.stringify(order.items, null, 2))
  console.log("Total:", order.total)
  console.log("Subtotal:", order.subtotal)
  console.log("Item Subtotal:", order.item_subtotal)
  console.log("Shipping Total:", order.shipping_total)
  console.log("Shipping Subtotal:", order.shipping_subtotal)
  console.log("Payment Collections:", order.payment_collections?.length || 0)
  if (order.payment_collections && order.payment_collections.length > 0) {
    console.log(
      "Payment Collection 0:",
      JSON.stringify(order.payment_collections[0], null, 2)
    )
  }
  console.log("Full Order Object:", JSON.stringify(order, null, 2))

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section with Success Message */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {isOnboarding && <OnboardingCta orderId={order.id} />}

          {/* Success Icon & Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-50 mb-6">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
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

            <h1
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "BRHendrix, sans-serif" }}
            >
              Order Confirmed!
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Thank you for your order. We've sent a confirmation email to{" "}
              <span className="font-semibold text-gray-900">{order.email}</span>
            </p>
          </div>

          {/* Order Number & Date - Prominent Display */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "BRHendrix, sans-serif" }}
                  data-testid="order-id"
                >
                  #{order.display_id}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-500 mb-1">Order Date</p>
                <p
                  className="text-lg font-semibold text-gray-900"
                  data-testid="order-date"
                >
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "BRHendrix, sans-serif" }}
                >
                  Order Items
                </h2>
              </div>

              <Items order={order} />

              <div className="px-6 py-6 border-t border-gray-100 bg-gray-50">
                <CartTotals totals={order} />
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <ShippingDetails order={order} />
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <PaymentDetails order={order} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "BRHendrix, sans-serif" }}
              >
                Order Status
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment</span>
                  <span
                    className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20"
                    data-testid="order-payment-status"
                  >
                    {order.payment_status
                      .split("_")
                      .join(" ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fulfillment</span>
                  <span
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20"
                    data-testid="order-status"
                  >
                    {order.fulfillment_status
                      .split("_")
                      .join(" ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "BRHendrix, sans-serif" }}
              >
                Quick Actions
              </h3>

              <div className="space-y-3">
                <LocalizedClientLink
                  href="/account/orders"
                  className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    View All Orders
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/store"
                  className="flex items-center justify-between w-full px-4 py-3 bg-[#F16D34] hover:bg-[#d95d2a] rounded-xl transition-colors group"
                >
                  <span className="text-sm font-medium text-white">
                    Continue Shopping
                  </span>
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </LocalizedClientLink>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <Help />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
