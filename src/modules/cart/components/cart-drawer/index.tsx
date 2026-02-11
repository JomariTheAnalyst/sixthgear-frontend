"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"
import { convertToLocale } from "@lib/util/money"
import {
  updateLineItem,
  changeLineItemVariant,
  forceNewCart,
} from "@lib/data/cart"
import { getProductByHandle } from "@lib/data/products"
import {
  getStockStatus,
  getStockLabel,
  isItemOutOfStock,
} from "@lib/util/cart-helpers"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DeleteButton from "@modules/common/components/delete-button"
import Thumbnail from "@modules/products/components/thumbnail"
import { useRouter, useParams } from "next/navigation"

type CartDrawerProps = {
  cart: HttpTypes.StoreCart | null
}

type VariantSelectorState = {
  itemId: string
  productHandle: string
  currentVariantId: string
  quantity: number
} | null

export default function CartDrawer({ cart }: CartDrawerProps) {
  const { isCartOpen, closeCart } = useCartDrawer()
  const {
    isSelected,
    toggleItem,
    selectAll,
    deselectAll,
    selectedItems,
    hasSelectedItems,
    selectedCount,
  } = useSelectedItems()
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [variantSelector, setVariantSelector] =
    useState<VariantSelectorState>(null)
  const [productData, setProductData] = useState<HttpTypes.StoreProduct | null>(
    null
  )
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [changingVariant, setChangingVariant] = useState(false)
  const [clearingCart, setClearingCart] = useState(false)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params.countryCode as string) || "ph"

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (variantSelector) {
          setVariantSelector(null)
        } else {
          closeCart()
        }
      }
    }
    if (isCartOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isCartOpen, closeCart, variantSelector])

  // Clean up stale selected items when cart changes
  useEffect(() => {
    if (cart?.items) {
      const currentItemIds = new Set(cart.items.map((item) => item.id))
      const staleIds = Array.from(selectedItems).filter(
        (id) => !currentItemIds.has(id)
      )

      if (staleIds.length > 0) {
        console.log(
          "[Cart Drawer] Removing stale selected items:",
          staleIds.length
        )
        // Remove stale IDs from selection
        const validIds = Array.from(selectedItems).filter((id) =>
          currentItemIds.has(id)
        )
        if (validIds.length !== selectedItems.size) {
          // Update selection to only include valid IDs
          if (validIds.length === 0) {
            deselectAll()
          } else {
            selectAll(validIds)
          }
        }
      }
    }
  }, [cart?.items, selectedItems, deselectAll, selectAll])

  // Fetch product data when variant selector opens
  useEffect(() => {
    if (variantSelector) {
      setLoadingProduct(true)
      getProductByHandle(variantSelector.productHandle, countryCode)
        .then((product) => {
          setProductData(product)
        })
        .finally(() => {
          setLoadingProduct(false)
        })
    } else {
      setProductData(null)
    }
  }, [variantSelector, countryCode])

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cart?.subtotal ?? 0
  const discount = cart?.discount_total ?? 0
  const total = cart?.total ?? 0

  // Calculate selected items total
  const selectedTotal = useMemo(() => {
    if (!cart?.items) return 0

    const filtered = cart.items.filter((item) => selectedItems.has(item.id))

    console.log("[Cart Drawer] Calculating selected total...")
    console.log("[Cart Drawer] Selected item IDs:", Array.from(selectedItems))
    console.log("[Cart Drawer] Filtered items:", filtered.length)

    const total = filtered.reduce((sum, item) => {
      const itemTotal = item.subtotal || item.total || 0
      console.log(
        `[Cart Drawer] Item ${item.id}: subtotal=${item.subtotal}, total=${item.total}, using=${itemTotal}`
      )
      return sum + itemTotal
    }, 0)

    console.log("[Cart Drawer] Selected total:", total)
    return total
  }, [cart?.items, selectedItems])

  // Calculate actual selected count from cart items (not from Set size)
  const actualSelectedCount =
    cart?.items?.filter((item) => selectedItems.has(item.id)).length || 0

  // Get in-stock items for select all
  const inStockItems =
    cart?.items?.filter((item) => !isItemOutOfStock(item)) || []
  const inStockItemIds = inStockItems.map((item) => item.id)
  const allSelected =
    inStockItemIds.length > 0 &&
    inStockItemIds.every((id) => selectedItems.has(id))

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll()
    } else {
      selectAll(inStockItemIds)
    }
  }

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

    // Store selected item IDs in sessionStorage for checkout page
    const selectedItemIds = Array.from(selectedItems)
    sessionStorage.setItem(
      "checkoutSelectedItems",
      JSON.stringify(selectedItemIds)
    )
    console.log(
      "[Cart Drawer] Stored selected items for checkout:",
      selectedItemIds.length
    )

    setIsRedirecting(true)
    closeCart()
    router.push("/checkout")
  }

  const openVariantSelector = (item: HttpTypes.StoreCartLineItem) => {
    setVariantSelector({
      itemId: item.id,
      productHandle: item.product_handle || "",
      currentVariantId: item.variant_id || "",
      quantity: item.quantity,
    })
  }

  const handleVariantChange = async (newVariantId: string) => {
    if (!variantSelector || newVariantId === variantSelector.currentVariantId) {
      setVariantSelector(null)
      return
    }

    setChangingVariant(true)
    try {
      await changeLineItemVariant({
        lineId: variantSelector.itemId,
        newVariantId,
        quantity: variantSelector.quantity,
      })
      setVariantSelector(null)
    } catch (error) {
      console.error("Failed to change variant:", error)
    } finally {
      setChangingVariant(false)
    }
  }

  const handleClearCart = async () => {
    if (
      !confirm(
        "Are you sure you want to clear your cart? This will create a fresh cart and remove all items."
      )
    ) {
      return
    }

    setClearingCart(true)
    try {
      await forceNewCart(countryCode)
      // Cart will be refreshed automatically by the page
      window.location.reload()
    } catch (error) {
      console.error("Failed to clear cart:", error)
      alert("Failed to clear cart. Please try again.")
    } finally {
      setClearingCart(false)
    }
  }

  // Get option values from a variant
  const getVariantOptions = (variant: HttpTypes.StoreProductVariant) => {
    return (
      variant.options?.map((opt) => ({
        name: opt.option?.title || "",
        value: opt.value || "",
      })) || []
    )
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
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Your Cart{" "}
              <span className="font-normal text-gray-500">[{totalItems}]</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {cart && cart.items && cart.items.length > 0 && (
              <>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    disabled={inStockItems.length === 0}
                    className="w-4 h-4 rounded border-gray-300 text-[#F16D34] focus:ring-[#F16D34]"
                  />
                  <span>{allSelected ? "Deselect All" : "Select All"}</span>
                </label>
                <button
                  onClick={handleClearCart}
                  disabled={clearingCart}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  title="Clear cart and start fresh"
                >
                  {clearingCart ? (
                    <>
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
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
                      Clearing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear Cart
                    </>
                  )}
                </button>
              </>
            )}
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
                    const stockStatus = getStockStatus(item)
                    const outOfStock = isItemOutOfStock(item)
                    const inventoryQty = item.variant?.inventory_quantity || 0

                    return (
                      <div
                        key={item.id}
                        className={`flex gap-4 p-6 border-b border-gray-100 relative group ${
                          outOfStock ? "opacity-60" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="flex items-start pt-2">
                          <input
                            type="checkbox"
                            checked={isSelected(item.id)}
                            onChange={() => toggleItem(item.id, outOfStock)}
                            disabled={outOfStock}
                            className="w-4 h-4 rounded border-gray-300 text-[#F16D34] focus:ring-[#F16D34] cursor-pointer disabled:cursor-not-allowed"
                          />
                        </div>

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

                          {/* Variant Info - Clickable to change */}
                          {(item.variant?.title || item.subtitle) && (
                            <button
                              onClick={() => openVariantSelector(item)}
                              className="mt-1.5 text-xs text-left flex items-center gap-1 group/variant"
                            >
                              <span className="font-medium text-gray-600">
                                Variant:
                              </span>{" "}
                              <span className="text-gray-800 group-hover/variant:text-[#F16D34] transition-colors">
                                {item.variant?.title || item.subtitle}
                              </span>
                              <svg
                                className="w-3 h-3 text-gray-400 group-hover/variant:text-[#F16D34] transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                          )}

                          {/* Stock Status Badges */}
                          {stockStatus === "out_of_stock" && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider w-fit mt-2">
                              {getStockLabel(stockStatus)}
                            </span>
                          )}
                          {stockStatus === "low_stock" && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider w-fit mt-2">
                              {getStockLabel(stockStatus, inventoryQty)}
                            </span>
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
            {/* Dual Totals: Selected vs Total */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Selected Items ({actualSelectedCount})
                </span>
                <span className="font-semibold text-gray-900">
                  {convertToLocale({
                    amount: selectedTotal,
                    currency_code: cart.currency_code,
                  })}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">
                  Total in Cart ({totalItems})
                </span>
                <span className="text-gray-500">
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
                  amount: selectedTotal,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>

            {/* Checkout Button - Disabled when no selection */}
            <button
              onClick={handleCheckout}
              disabled={isRedirecting || !hasSelectedItems}
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
              ) : hasSelectedItems ? (
                <>
                  Checkout ({actualSelectedCount}{" "}
                  {actualSelectedCount === 1 ? "item" : "items"})
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
              ) : (
                "Select items to checkout"
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

        {/* Variant Selector Modal */}
        {variantSelector && (
          <div className="absolute inset-0 bg-black/50 z-10 flex items-end">
            <div className="bg-white w-full rounded-t-2xl max-h-[70%] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  Select Variant
                </h3>
                <button
                  onClick={() => setVariantSelector(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingProduct ? (
                  <div className="flex items-center justify-center py-12">
                    <svg
                      className="animate-spin h-8 w-8 text-gray-400"
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
                  </div>
                ) : productData?.variants && productData.variants.length > 0 ? (
                  <div className="space-y-2">
                    {productData.variants.map((variant) => {
                      const isSelected =
                        variant.id === variantSelector.currentVariantId
                      const options = getVariantOptions(variant)
                      const inStock =
                        (variant.inventory_quantity ?? 0) > 0 ||
                        variant.manage_inventory === false

                      return (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(variant.id)}
                          disabled={!inStock || changingVariant}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                            isSelected
                              ? "border-[#F16D34] bg-orange-50"
                              : inStock
                              ? "border-gray-200 hover:border-gray-300"
                              : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {variant.title}
                            </p>
                            {options.length > 0 && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {options
                                  .map((o) => `${o.name}: ${o.value}`)
                                  .join(" • ")}
                              </p>
                            )}
                            {!inStock && (
                              <p className="text-xs text-red-500 mt-0.5">
                                Out of stock
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {variant.calculated_price && (
                              <span className="text-sm font-bold text-gray-900">
                                {convertToLocale({
                                  amount:
                                    variant.calculated_price
                                      .calculated_amount || 0,
                                  currency_code: cart?.currency_code || "PHP",
                                })}
                              </span>
                            )}
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#F16D34] flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No other variants available
                  </p>
                )}
              </div>

              {/* Modal Footer */}
              {changingVariant && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    Updating cart...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
