"use client"

import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InvoiceDownload from "@modules/order/components/invoice-download"

type OrderConfirmedClientProps = {
  orderId: string
  countryCode: string
}

export default function OrderConfirmedClient({
  orderId,
  countryCode: _countryCode,
}: OrderConfirmedClientProps) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // FORCE VISIBLE MARKER - Remove after testing
  useEffect(() => {
    console.log("=== ORDER CONFIRMED CLIENT LOADED ===")
    console.log("Order ID:", orderId)
    console.log("Timestamp:", new Date().toISOString())
  }, [orderId])

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)

        const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/orders/${orderId}?fields=*items,*items.product_title,*items.variant_title,*items.quantity,*items.unit_price,*items.total,*items.original_total,*items.thumbnail,*items.variant,*items.product,*shipping_address,*billing_address,*shipping_methods,*payment_collections,*payment_collections.payment_sessions,*payment_collections.payments`

        console.log("[Order Confirmed] Fetching:", url)

        const response = await fetch(url, {
          credentials: "include",
          cache: "no-store",
          headers: {
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        })

        console.log("[Order Confirmed] Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[Order Confirmed] Error response:", errorText)
          throw new Error(`Failed to fetch order: ${response.status}`)
        }

        const data = await response.json()

        console.log(
          "[Order Confirmed] RAW RESPONSE:",
          JSON.stringify(data, null, 2)
        )

        if (!data.order) {
          throw new Error("No order in response")
        }

        console.log(
          "[Order Confirmed] Items count:",
          data.order.items?.length || 0
        )
        console.log("[Order Confirmed] Items:", data.order.items)

        setOrder(data.order)
      } catch (err: any) {
        console.error("[Order Confirmed] Error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const getNumericValue = (value: any): number => {
    if (value === null || value === undefined) return 0
    if (typeof value === "object" && "numeric_" in value)
      return Number(value.numeric_)
    if (typeof value === "object" && "raw_" in value && value.raw_?.value)
      return Number(value.raw_.value)
    if (typeof value === "object" && "value" in value)
      return Number(value.value)
    if (typeof value === "number") return value
    if (typeof value === "string") {
      const parsed = Number(value)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  const formatPrice = (amount: any) => {
    const numericValue = getNumericValue(amount)
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: order?.currency_code || "PHP",
    }).format(numericValue)
  }

  const getProviderId = (inputOrder: any): string => {
    const paymentCollection = inputOrder?.payment_collections?.[0]
    const sessionProvider =
      paymentCollection?.payment_sessions?.[0]?.provider_id
    const paymentProvider = paymentCollection?.payments?.[0]?.provider_id
    const topLevelProvider = inputOrder?.payment_provider_id
    const metadataProvider =
      inputOrder?.metadata?.payment_provider ||
      inputOrder?.metadata?.provider_id

    return (
      sessionProvider ||
      paymentProvider ||
      topLevelProvider ||
      metadataProvider ||
      ""
    )
  }

  const getPaymentMethod = (inputOrder: any) => {
    const providerId = String(getProviderId(inputOrder) || "").toLowerCase()
    const metadataMethod = String(
      inputOrder?.metadata?.payment_method || ""
    ).toLowerCase()

    const isCOD =
      providerId === "pp_system_default" ||
      providerId === "manual" ||
      providerId === "cod" ||
      providerId === "cash_on_delivery" ||
      providerId.includes("cod") ||
      providerId.includes("system_default") ||
      metadataMethod.includes("cod") ||
      metadataMethod.includes("cash on delivery")

    if (isCOD) {
      return "Cash on Delivery (COD)"
    }

    if (providerId.includes("stripe")) {
      return "Card via Stripe"
    }

    if (providerId.includes("paypal")) {
      return "PayPal"
    }

    return "Online Payment"
  }

  const getShippingTotal = (inputOrder: any): number => {
    const shippingTotal = getNumericValue(inputOrder?.shipping_total)
    if (shippingTotal > 0) {
      return shippingTotal
    }

    const shippingMethods = inputOrder?.shipping_methods || []
    const methodsTotal = shippingMethods.reduce((sum: number, method: any) => {
      const methodAmount =
        getNumericValue(method?.total) ||
        getNumericValue(method?.amount) ||
        getNumericValue(method?.price)
      return sum + methodAmount
    }, 0)

    return methodsTotal
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
          <p className="text-xs text-red-600 mt-2">
            DEBUG: OrderConfirmedClient v2.0 - {new Date().toISOString()}
          </p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
          <p className="text-gray-600 mb-6">
            {error || "Unable to load order"}
          </p>
          <LocalizedClientLink
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  const displayId = getNumericValue(order.display_id)
  const orderNumber = displayId
    ? `SIX-${displayId.toString().padStart(6, "0")}`
    : `#${String(order.id || "").slice(-8)}`
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const paymentMethod = getPaymentMethod(order)
  const isCOD = paymentMethod === "Cash on Delivery (COD)"
  const items = order.items || []
  const hasItems = items.length > 0
  const computedItemsSubtotal = items.reduce(
    (sum: number, item: any) =>
      sum +
      (getNumericValue(item.total) ||
        getNumericValue(item.subtotal) ||
        getNumericValue(item.unit_price) * getNumericValue(item.quantity)),
    0
  )
  const subtotal = getNumericValue(order.subtotal) || computedItemsSubtotal
  const shippingTotal = getShippingTotal(order)
  const discountTotal = getNumericValue(order.discount_total)
  const taxTotal = getNumericValue(order.tax_total)
  const total =
    getNumericValue(order.total) ||
    subtotal + shippingTotal + taxTotal - discountTotal

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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

          <div className="border-t border-gray-200"></div>

          <div className="px-8 py-6">
            {hasItems ? (
              <div className="space-y-4">
                {items.map((item: any, index: number) => {
                  const itemTotal =
                    getNumericValue(item.total) ||
                    getNumericValue(item.subtotal) ||
                    getNumericValue(item.unit_price) *
                      getNumericValue(item.quantity)
                  const itemQuantity = getNumericValue(item.quantity)

                  return (
                    <div
                      key={item.id || index}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <span className="text-gray-500 text-sm mt-0.5">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.title ||
                                item.product_title ||
                                item.variant?.product?.title ||
                                item.product?.title ||
                                "Product"}
                            </p>
                            {(item.subtitle || item.variant?.title) &&
                              (item.subtitle || item.variant?.title) !==
                                "Default" && (
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {item.subtitle || item.variant?.title}
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
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">
                  No items found in this order
                </p>
                <p className="text-xs text-gray-400">Order ID: {order.id}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="px-8 py-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shippingTotal === 0 ? "Free" : formatPrice(shippingTotal)}
                </span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">
                    -{formatPrice(discountTotal)}
                  </span>
                </div>
              )}
              {taxTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(taxTotal)}</span>
                </div>
              )}
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

          <div className="border-t border-gray-200"></div>
          <div className="px-8 py-4 bg-gray-50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900">{paymentMethod}</span>
            </div>
          </div>

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

          <div className="px-8 py-6 space-y-3">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <InvoiceDownload orderId={order.id} />
              </div>
            </div>
            <LocalizedClientLink
              href="/"
              className="block w-full px-6 py-3 text-center border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Shop
            </LocalizedClientLink>
          </div>

          <div className="px-8 pb-8 text-center">
            <p className="text-xs text-gray-500">Need help with your order?</p>
          </div>
        </div>
      </div>
    </div>
  )
}
