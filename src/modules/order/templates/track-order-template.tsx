"use client"

import { useState } from "react"

type OrderStatus = "processing" | "shipped" | "delivered"

type TrackingInfo = {
  trackingNumber: string
  carrier: string | null
  trackingUrl: string | null
}

type OrderItem = {
  title: string
  quantity: number
  thumbnail: string | null
  variant_title: string | null
  unit_price: number
  subtotal: number
}

type OrderTrackingResult = {
  orderNumber: string
  status: OrderStatus
  orderDate: string
  trackingInfo: TrackingInfo[] | null
  estimatedDelivery: string | null
  items: OrderItem[]
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  gift_card_total: number
  total: number
  currency_code: string
}

type TrackingMethod = "order" | "tracking"
type VerifyMethod = "email" | "phone"

// Mask sensitive information
const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@")
  if (!local || !domain) return email
  const maskedLocal =
    local.length > 2
      ? `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}`
      : local
  return `${maskedLocal}@${domain}`
}

const maskPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 4) return phone
  return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`
}

export default function TrackOrderTemplate() {
  const [method, setMethod] = useState<TrackingMethod>("order")
  const [verifyBy, setVerifyBy] = useState<VerifyMethod>("email")
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OrderTrackingResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      let body: any

      if (method === "order") {
        // Order number with email or phone
        body = {
          orderNumber: orderNumber.trim(),
        }
        if (verifyBy === "email") {
          body.email = email.trim()
        } else {
          body.phone = phone.trim()
        }
      } else {
        // Tracking number only
        body = {
          trackingNumber: trackingNumber.trim(),
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/track-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify(body),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to find your order. Please check your information and try again."
        )
        return
      }

      setResult(data.order)
    } catch (err) {
      console.error("Track order error:", err)
      setError(
        "An error occurred while tracking your order. Please try again later."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleMethodChange = (newMethod: TrackingMethod) => {
    setMethod(newMethod)
    setError(null)
    // Clear form fields when switching methods
    setOrderNumber("")
    setEmail("")
    setPhone("")
    setTrackingNumber("")
  }

  const handleVerifyMethodChange = (newVerifyMethod: VerifyMethod) => {
    setVerifyBy(newVerifyMethod)
    setError(null)
    // Clear verification fields when switching
    setEmail("")
    setPhone("")
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatPrice = (amount: number, currencyCode: string) => {
    const code = currencyCode || "PHP"
    try {
      // Use the amount directly without dividing by 100
      // Medusa stores the actual amount, not in smallest currency unit
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
      }).format(amount)
    } catch {
      // Fallback if currency code is invalid
      return `${code} ${amount.toFixed(2)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Order</h1>
          <p className="text-sm text-gray-600">
            Enter your details to view order status
          </p>
        </div>

        {/* Form */}
        {!result && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            {/* Method Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => handleMethodChange("order")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  method === "order"
                    ? "bg-[#F16D34] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Order Number
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange("tracking")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  method === "tracking"
                    ? "bg-[#F16D34] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tracking Number
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order Number Method */}
              {method === "order" && (
                <>
                  <div>
                    <label
                      htmlFor="orderNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Order Number
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g., 1234"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F16D34] focus:border-transparent outline-none"
                      disabled={loading}
                    />
                  </div>

                  {/* Verify By Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verify by
                    </label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => handleVerifyMethodChange("email")}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          verifyBy === "email"
                            ? "bg-[#F16D34] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        disabled={loading}
                      >
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerifyMethodChange("phone")}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          verifyBy === "phone"
                            ? "bg-[#F16D34] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        disabled={loading}
                      >
                        Phone
                      </button>
                    </div>

                    {verifyBy === "email" && (
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F16D34] focus:border-transparent outline-none"
                        disabled={loading}
                      />
                    )}

                    {verifyBy === "phone" && (
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+63 912 345 6789"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F16D34] focus:border-transparent outline-none"
                        disabled={loading}
                      />
                    )}
                  </div>
                </>
              )}

              {/* Tracking Number Method */}
              {method === "tracking" && (
                <div>
                  <label
                    htmlFor="trackingNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g., 1234567890"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F16D34] focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-[#F16D34] text-white font-medium rounded-md hover:bg-[#d95d2a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </form>
          </div>
        )}

        {/* Results - Minimalist Design */}
        {result && (
          <div className="space-y-4">
            {/* Order Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Number</p>
                  <p className="text-lg font-bold text-gray-900">
                    #{result.orderNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    result.status
                  )}`}
                >
                  {getStatusLabel(result.status)}
                </span>
              </div>

              {/* Order Date */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-1">Order Date</p>
                <p className="text-sm text-gray-900">
                  {formatDate(result.orderDate)}
                </p>
              </div>

              {/* Status Progress */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-3">Status</p>
                <div className="flex items-center">
                  {/* Processing */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        result.status === "processing" ||
                        result.status === "shipped" ||
                        result.status === "delivered"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 text-white"
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
                    <p className="text-xs text-gray-600 mt-1">Processing</p>
                  </div>

                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      result.status === "shipped" ||
                      result.status === "delivered"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />

                  {/* Shipped */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        result.status === "shipped" ||
                        result.status === "delivered"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Shipped</p>
                  </div>

                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      result.status === "delivered"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />

                  {/* Delivered */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        result.status === "delivered"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 text-white"
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
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Delivered</p>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              {result.estimatedDelivery && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-900">
                    <span className="font-semibold">Est. Delivery:</span>{" "}
                    {formatDate(result.estimatedDelivery)}
                  </p>
                </div>
              )}

              {/* Tracking Info */}
              {result.trackingInfo && result.trackingInfo.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-2">Tracking</p>
                  <div className="space-y-2">
                    {result.trackingInfo.map((tracking, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 border border-gray-200 rounded-md"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {tracking.carrier && (
                              <p className="text-xs text-gray-500 mb-1">
                                {tracking.carrier}
                              </p>
                            )}
                            <p className="font-mono text-sm font-medium text-gray-900 truncate">
                              {tracking.trackingNumber}
                            </p>
                          </div>
                          {tracking.trackingUrl && (
                            <a
                              href={tracking.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 px-3 py-1.5 bg-[#F16D34] text-white text-xs font-medium rounded-md hover:bg-[#d95d2a] transition-colors"
                            >
                              Track
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Items */}
              {result.items && result.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {result.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        {item.thumbnail && (
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">
                            {item.title}
                          </p>
                          {item.variant_title && (
                            <p className="text-sm text-gray-500 mt-1">
                              Variant: {item.variant_title}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-500">
                            {formatPrice(
                              item.unit_price,
                              result.currency_code || "PHP"
                            )}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">each</p>
                          <p className="text-base font-medium text-gray-900 mt-2">
                            {formatPrice(
                              item.subtotal,
                              result.currency_code || "PHP"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal (excl. shipping and taxes)
                  </span>
                  <span className="text-gray-900">
                    {formatPrice(
                      result.subtotal || 0,
                      result.currency_code || "PHP"
                    )}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {formatPrice(
                      result.shipping_total || 0,
                      result.currency_code || "PHP"
                    )}
                  </span>
                </div>

                {/* Taxes */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">
                    {formatPrice(
                      result.tax_total || 0,
                      result.currency_code || "PHP"
                    )}
                  </span>
                </div>

                {/* Discount */}
                {result.discount_total > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">
                      -{" "}
                      {formatPrice(
                        result.discount_total,
                        result.currency_code || "PHP"
                      )}
                    </span>
                  </div>
                )}

                {/* Gift Card */}
                {result.gift_card_total > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Gift Card</span>
                    <span className="text-green-600">
                      -{" "}
                      {formatPrice(
                        result.gift_card_total,
                        result.currency_code || "PHP"
                      )}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(
                      result.total || 0,
                      result.currency_code || "PHP"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Track Another Order */}
            <button
              onClick={() => {
                setResult(null)
                setOrderNumber("")
                setEmail("")
                setPhone("")
                setTrackingNumber("")
                setError(null)
              }}
              className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Track Another Order
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
