"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { convertToLocale } from "@lib/util/money"
import { updateLineItem } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DeleteButton from "@modules/common/components/delete-button"
import Thumbnail from "@modules/products/components/thumbnail"
import { useRouter } from "next/navigation"

type CartDrawerProps = {
  cart: HttpTypes.StoreCart | null
}

export default function CartDrawer({ cart }: CartDrawerProps) {
  const { isCartOpen, closeCart } = useCartDrawer()
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }
    if (isCartOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isCartOpen, closeCart])

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cart?.subtotal ?? 0
  const discount = cart?.discount_total ?? 0
  const total = cart?.total ?? 0

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingItem(itemId)
    try {
      await updateLineItem({ lineId: itemId, quantity: newQuantity })
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setUpdatingItem(null)
    }
  }

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsRedirecting(true)
    closeCart()
    router.push("/checkout")
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-[#f5f5f0] z-[101] transform transition-transform duration-300 ease-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
            Your Cart{" "}
            <span className="font-normal text-gray-500">[{totalItems}]</span>
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cart && cart.items && cart.items.length > 0 ? (
            <>
              {/* Cart Items */}
              <div className="bg-white">
                {cart.items
                  .sort((a, b) =>
                    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  )
                  .map((item) => {
                    const isOnSale =
                      item.compare_at_unit_price &&
                      item.compare_at_unit_price > (item.unit_price ?? 0)
                    const isUpdating = updatingItem === item.id

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-6 border-b border-gray-100 relative group"
                      >
                        {/* Image */}
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-28 h-36 bg-gray-100 shrink-0 relative overflow-hidden"
                          onClick={closeCart}
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="full"
                          />
                        </LocalizedClientLink>

                        {/* Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start gap-2">
                            <LocalizedClientLink
                              href={`/products/${item.product_handle}`}
                              className="text-sm font-bold text-gray-900 hover:text-[#F16D34] transition-colors line-clamp-2 uppercase"
                              onClick={closeCart}
                            >
                              {item.title}
                            </LocalizedClientLink>
                            {/* Delete Button (Red) - Single icon only */}
                            <DeleteButton
                              id={item.id}
                              className="!text-red-500 hover:!text-red-700 shrink-0"
                            />
                          </div>

                          {/* Variant Info - Show variant title or subtitle */}
                          {(item.variant?.title || item.subtitle) && (
                            <div className="mt-1.5 text-xs text-gray-600">
                              <span className="font-medium">Variant:</span>{" "}
                              <span className="text-gray-800">
                                {item.variant?.title || item.subtitle}
                              </span>
                            </div>
                          )}

                          {/* Sale Badge & Price */}
                          <div className="mt-2 flex flex-col gap-1">
                            {isOnSale && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-[#F16D34] text-white text-[10px] font-bold uppercase tracking-wider w-fit">
                                On Sale Price
                              </span>
                            )}
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`text-sm font-bold ${
                                  isOnSale ? "text-[#F16D34]" : "text-gray-900"
                                }`}
                              >
                                {convertToLocale({
                                  amount:
                                    (item.unit_price ?? 0) * item.quantity,
                                  currency_code: cart.currency_code,
                                })}
                              </span>
                              {isOnSale && item.compare_at_unit_price && (
                                <span className="text-xs text-gray-400 line-through">
                                  {convertToLocale({
                                    amount:
                                      item.compare_at_unit_price *
                                      item.quantity,
                                    currency_code: cart.currency_code,
                                  })}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-auto pt-3 flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 bg-white rounded-md overflow-hidden">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1 || isUpdating}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                −
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-300">
                                {isUpdating ? (
                                  <svg
                                    className="animate-spin h-3 w-3"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                  </svg>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={isUpdating}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* High Demand Banner */}
              <div className="mx-6 mt-4 bg-gray-900 text-white py-3 px-4 rounded-lg flex items-center gap-3 text-sm animate-pulse-slow">
                <svg
                  className="w-5 h-5 shrink-0 text-[#F16D34]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span>
                  <span className="font-bold text-[#F16D34]">HIGH DEMAND!</span>{" "}
                  {totalItems} added to cart in the last few days
                </span>
              </div>
            </>
          ) : (
            /* Empty Cart */
            <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added anything yet.
              </p>
              <LocalizedClientLink
                href="/store"
                onClick={closeCart}
                className="px-8 py-3 bg-gray-900 text-white font-bold uppercase tracking-wider hover:bg-[#F16D34] transition-colors"
              >
                Start Shopping
              </LocalizedClientLink>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-6 space-y-4">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {convertToLocale({
                    amount: subtotal,
                    currency_code: cart.currency_code,
                  })}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#F16D34]">
                  <span>Savings</span>
                  <span className="font-semibold">
                    -
                    {convertToLocale({
                      amount: discount,
                      currency_code: cart.currency_code,
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <span className="text-sm font-bold text-gray-900 uppercase">
                  Order Total
                </span>
                <p className="text-xs text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {convertToLocale({
                  amount: total,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isRedirecting}
              className="w-full h-14 bg-gray-900 hover:bg-[#F16D34] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isRedirecting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Checkout
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Free Shipping over ₱3,000
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Guaranteed Authenticity
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
