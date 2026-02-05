"use client"

import { Heading } from "@medusajs/ui"
import { useMemo } from "react"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"
import { convertToLocale } from "@lib/util/money"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  const { selectedItems } = useSelectedItems()

  // Calculate selected items total using ORIGINAL prices (before discount)
  const selectedTotal = useMemo(() => {
    if (!cart.items) return 0

    return cart.items
      .filter((item: any) => selectedItems.has(item.id))
      .reduce((sum: number, item: any) => {
        // Use original_total if available, otherwise use total
        const itemPrice =
          item.original_total ?? item.total ?? item.subtotal ?? 0
        return sum + itemPrice
      }, 0)
  }, [cart.items, selectedItems])

  // Calculate actual selected count from cart items
  const actualSelectedCount = useMemo(() => {
    if (!cart.items) return 0
    return cart.items.filter((item: any) => selectedItems.has(item.id)).length
  }, [cart.items, selectedItems])

  // Get discount, shipping, and tax from cart (from backend)
  const discountTotal = cart.discount_total || 0
  const shippingTotal = cart.shipping_total || 0
  const taxTotal = cart.tax_total || 0

  // Calculate final total: original prices - discount + shipping + tax
  const finalTotal = selectedTotal - discountTotal + shippingTotal + taxTotal

  const formatPrice = (amount: number) => {
    return convertToLocale({
      amount,
      currency_code: cart.currency_code,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">
          Order Summary ({actualSelectedCount}{" "}
          {actualSelectedCount === 1 ? "item" : "items"})
        </h2>
      </div>

      {/* Cart Items - Only Selected */}
      <div className="px-6 py-5 max-h-[400px] overflow-y-auto">
        <ItemsPreviewTemplate cart={cart} />
      </div>

      {/* Discount Code */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <DiscountCode cart={cart} />
      </div>

      {/* Totals - Based on Selected Items */}
      <div className="px-6 py-5 border-t border-gray-200">
        <div>
          <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle">
            <div className="flex items-center justify-between">
              <span>Subtotal (excl. shipping and taxes)</span>
              <span data-testid="cart-subtotal">
                {formatPrice(selectedTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span data-testid="cart-shipping">
                {formatPrice(shippingTotal)}
              </span>
            </div>
            {discountTotal > 0 && (
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span
                  className="text-ui-fg-interactive"
                  data-testid="cart-discount"
                >
                  - {formatPrice(discountTotal)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="flex gap-x-1 items-center">Taxes</span>
              <span data-testid="cart-taxes">{formatPrice(taxTotal)}</span>
            </div>
          </div>
          <div className="h-px w-full border-b border-gray-200 my-4" />
          <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium">
            <span>Total</span>
            <span className="txt-xlarge-plus" data-testid="cart-total">
              {formatPrice(finalTotal)}
            </span>
          </div>
          <div className="h-px w-full border-b border-gray-200 mt-4" />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
