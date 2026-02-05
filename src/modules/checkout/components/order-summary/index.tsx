"use client"

import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TrustSignals from "../trust-signals"
import { ChevronDown, ChevronUpMini } from "@medusajs/icons"
import { useState } from "react"
import Image from "next/image"

interface OrderSummaryProps {
  cart: HttpTypes.StoreCart
  className?: string
}

/**
 * Order Summary Component
 *
 * Sticky sidebar on desktop showing cart items, pricing breakdown, and trust signals
 * Collapsible on mobile to save space
 */
const OrderSummary = ({ cart, className = "" }: OrderSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const itemCount =
    cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  const subtotal =
    cart.items?.reduce(
      (sum, item) => sum + (item.unit_price || 0) * item.quantity,
      0
    ) || 0

  const shippingTotal =
    cart.shipping_methods?.reduce(
      (sum, method) => sum + (method.amount || 0),
      0
    ) || 0

  const taxTotal = cart.tax_total || 0
  const total = cart.total || 0

  return (
    <div className={className}>
      {/* Mobile: Collapsible Header */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUpMini className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
            <span className="text-sm font-medium text-gray-900">
              {isExpanded ? "Hide" : "Show"} order summary
            </span>
            <span className="text-sm text-gray-500">({itemCount} items)</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {convertToLocale({
              amount: total,
              currency_code: cart.currency_code,
            })}
          </span>
        </button>
      </div>

      {/* Summary Content */}
      <div
        className={`bg-gray-50 lg:bg-white lg:sticky lg:top-8 ${
          isExpanded ? "block" : "hidden lg:block"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header - Desktop Only */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Order Summary
            </h2>
            <p className="text-sm text-gray-500">
              {itemCount} items in your cart
            </p>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {cart.items?.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.product_title || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                  {/* Quantity Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.product_title}
                  </h3>
                  {item.variant_title && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.variant_title}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {convertToLocale({
                      amount: (item.unit_price || 0) * item.quantity,
                      currency_code: cart.currency_code,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Cart Link */}
          <LocalizedClientLink
            href="/cart"
            className="block text-center text-sm font-medium text-[#F16D34] hover:text-[#d55a24] transition-colors"
          >
            Edit Cart
          </LocalizedClientLink>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                {convertToLocale({
                  amount: subtotal,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>

            {shippingTotal > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  {convertToLocale({
                    amount: shippingTotal,
                    currency_code: cart.currency_code,
                  })}
                </span>
              </div>
            ) : cart.shipping_methods?.length > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            ) : null}

            {taxTotal > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">
                  {convertToLocale({
                    amount: taxTotal,
                    currency_code: cart.currency_code,
                  })}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {convertToLocale({
                  amount: total,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="pt-4 border-t border-gray-200">
            <TrustSignals variant="full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
