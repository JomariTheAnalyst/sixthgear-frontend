"use client"

import { Button, Heading } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"
import { useMemo } from "react"
import { convertToLocale } from "@lib/util/money"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const { selectedItems, hasSelectedItems } = useSelectedItems()

  // Calculate selected items total using ORIGINAL prices (before discount)
  const selectedTotal = useMemo(() => {
    if (!cart.items) return 0

    return cart.items
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => {
        // Use original_total if available, otherwise use total
        const itemPrice =
          item.original_total ?? item.total ?? item.subtotal ?? 0
        return sum + itemPrice
      }, 0)
  }, [cart.items, selectedItems])

  // Calculate actual selected count from cart items
  const actualSelectedCount = useMemo(() => {
    if (!cart.items) return 0
    return cart.items.filter((item) => selectedItems.has(item.id)).length
  }, [cart.items, selectedItems])

  // Calculate total in cart
  const cartTotal = cart.subtotal || 0

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
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />

      {/* Dual Summary: Selected vs Total */}
      <div className="flex flex-col gap-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-ui-fg-subtle">
            Selected Items ({actualSelectedCount})
          </span>
          <span className="font-semibold text-ui-fg-base">
            {formatPrice(selectedTotal)}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-ui-border-base">
          <span className="text-ui-fg-subtle">
            Total in Cart ({cart.items?.length || 0})
          </span>
          <span className="text-ui-fg-muted">{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {/* Order Total Section - Based on Selected Items */}
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

      {/* Checkout Button - Disabled when no selection */}
      {hasSelectedItems ? (
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <Button className="w-full h-10">
            Checkout ({actualSelectedCount}{" "}
            {actualSelectedCount === 1 ? "item" : "items"})
          </Button>
        </LocalizedClientLink>
      ) : (
        <Button
          className="w-full h-10"
          disabled
          data-testid="checkout-button-disabled"
        >
          Select items to checkout
        </Button>
      )}
    </div>
  )
}

export default Summary
