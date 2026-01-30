"use client"

import { useState, useTransition, useMemo } from "react"
import { Wishlist, WishlistItem } from "@lib/data/wishlist"
import { removeFromWishlist, clearWishlist } from "@lib/data/wishlist"
import { useRouter } from "next/navigation"
import { Trash, ShoppingCart, ChevronRight } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import Image from "next/image"
import {
  getProductPricing,
  hasMultipleVariants,
} from "@lib/util/get-product-pricing"
import {
  isColorOption,
  isSizeOption,
  getUniqueOptionValues,
  getColorHexForValue,
  COLOR_NAME_TO_HEX,
} from "@lib/util/variant-helpers"

type WishlistPageProps = {
  wishlist: Wishlist | null
  products: Map<string, HttpTypes.StoreProduct>
  countryCode: string
}

export default function WishlistPage({
  wishlist,
  products,
  countryCode,
}: WishlistPageProps) {
  const [isPending, startTransition] = useTransition()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)
  const router = useRouter()

  // Debug logging
  console.log("🎨 WishlistPage render:", {
    hasWishlist: !!wishlist,
    itemCount: wishlist?.items?.length || 0,
    productMapSize: products.size,
    productIds: Array.from(products.keys()),
    items: wishlist?.items?.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      hasProduct: products.has(item.product_id || ""),
    })),
  })

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-500 mb-8">
            Save items you love so you can find them later.
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            Continue Shopping
            <ChevronRight className="w-4 h-4" />
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId)
    startTransition(async () => {
      await removeFromWishlist(itemId)
      router.refresh()
      setRemovingId(null)
    })
  }

  const handleClear = async () => {
    if (
      !confirm(`Remove all ${wishlist.items.length} items from your wishlist?`)
    ) {
      return
    }

    startTransition(async () => {
      await clearWishlist()
      router.refresh()
    })
  }

  const handleAddToCart = async (item: WishlistItem) => {
    setAddingToCartId(item.id)
    try {
      await addToCart({
        variantId: item.variant_id,
        quantity: 1,
        countryCode: countryCode,
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setAddingToCartId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Wishlist
          </h1>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        {wishlist.items.length > 0 && (
          <button
            onClick={handleClear}
            disabled={isPending}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Trash className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {wishlist.items.map((item) => {
          const product = products.get(item.product_id || "")

          if (!product) {
            console.log("❌ Product not found for wishlist item:", {
              itemId: item.id,
              productId: item.product_id,
              variantId: item.variant_id,
            })
            return null
          }

          const imageUrl = product.thumbnail || product.images?.[0]?.url
          const pricing = getProductPricing(product)

          // Extract size and color options (no hooks here)
          const options = product.options || []
          const variants = product.variants || []
          const sizeOpt = options.find((o) => isSizeOption(o))
          const colorOpt = options.find((o) => isColorOption(o))

          const sizes = sizeOpt
            ? getUniqueOptionValues(variants, sizeOpt.id)
            : []
          const colors = colorOpt
            ? getUniqueOptionValues(variants, colorOpt.id)
            : []

          const getColorHex = (colorValue: string): string => {
            if (colorOpt) {
              const hex = getColorHexForValue(variants, colorOpt.id, colorValue)
              if (hex) return hex
            }
            const normalized = colorValue.toLowerCase().trim()
            if (COLOR_NAME_TO_HEX[normalized]) {
              return COLOR_NAME_TO_HEX[normalized]
            }
            for (const [name, hex] of Object.entries(COLOR_NAME_TO_HEX)) {
              if (normalized.includes(name) || name.includes(normalized)) {
                return hex
              }
            }
            return "#FFFFFF"
          }

          const isLightColor = (hex: string): boolean => {
            const cleanHex = hex.replace("#", "")
            const r = parseInt(cleanHex.substring(0, 2), 16)
            const g = parseInt(cleanHex.substring(2, 4), 16)
            const b = parseInt(cleanHex.substring(4, 6), 16)
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            return luminance > 0.6
          }

          const isRemoving = removingId === item.id
          const isAddingToCart = addingToCartId === item.id

          return (
            <div
              key={item.id}
              className={`group relative h-full ${
                isRemoving ? "opacity-50" : ""
              }`}
            >
              <LocalizedClientLink
                href={`/products/${product.handle}`}
                className="block h-full"
              >
                {/* Card with border - h-full ensures consistent height */}
                <div className="flex flex-col h-full border border-gray-200 hover:border-gray-300 transition-colors">
                  {/* Product Image - White background */}
                  <div className="relative aspect-[4/5] bg-white overflow-hidden">
                    {/* SALE Badge */}
                    {pricing.isOnSale && (
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        <span
                          className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 uppercase tracking-wide"
                          style={{ fontFamily: "BRHendrix, sans-serif" }}
                        >
                          Sale
                        </span>
                        {pricing.discountPct && pricing.discountPct >= 5 && (
                          <span
                            className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1"
                            style={{ fontFamily: "BRHendrix, sans-serif" }}
                          >
                            -{pricing.discountPct}%
                          </span>
                        )}
                      </div>
                    )}

                    {/* Filled Heart Icon - Always visible */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemove(item.id)
                      }}
                      disabled={isRemoving || isPending}
                      className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 hover:bg-red-600 transition-colors disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      {isRemoving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg
                          className="w-5 h-5 text-white fill-white"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      )}
                    </button>

                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.title || "Product"}
                        fill
                        className="object-contain p-6 md:p-8 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Quick View Button - Shows on Hover */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToCart(item)
                      }}
                      disabled={isAddingToCart || isPending}
                      className="absolute bottom-4 left-4 right-4 py-3 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wide opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#F16D34] disabled:opacity-50"
                      style={{ fontFamily: "BRHendrix, sans-serif" }}
                    >
                      {isAddingToCart ? (
                        "Adding..."
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Line separator */}
                  <div className="h-px bg-gray-200" />

                  {/* Product Info - Gray background */}
                  <div className="flex flex-col flex-1 p-3 gap-2 bg-gray-50">
                    {/* Brand/Category */}
                    {product.collection?.title && (
                      <p
                        className="text-xs text-gray-500 uppercase tracking-wide"
                        style={{ fontFamily: "BRHendrix, sans-serif" }}
                      >
                        {product.collection.title}
                      </p>
                    )}

                    {/* Product Title - Fixed height with line-clamp */}
                    <h3
                      className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#F16D34] transition-colors min-h-[2.5rem]"
                      style={{ fontFamily: "BRHendrix, sans-serif" }}
                    >
                      {product.title}
                    </h3>

                    {/* Sizes Display */}
                    {sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {sizes.slice(0, 6).map((size) => (
                          <span
                            key={size}
                            className="px-2 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-100 rounded"
                            style={{ fontFamily: "BRHendrix, sans-serif" }}
                          >
                            {size}
                          </span>
                        ))}
                        {sizes.length > 6 && (
                          <span
                            className="px-2 py-0.5 text-[10px] font-medium text-gray-400"
                            style={{ fontFamily: "BRHendrix, sans-serif" }}
                          >
                            +{sizes.length - 6}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Color Swatches */}
                    {colors.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        {colors.slice(0, 5).map((color) => {
                          const hex = getColorHex(color)
                          const isLight = isLightColor(hex)
                          return (
                            <div
                              key={color}
                              className={`w-4 h-4 rounded-full flex-shrink-0 ${
                                isLight ? "border border-gray-300" : ""
                              }`}
                              style={{ backgroundColor: hex }}
                              title={color}
                            />
                          )
                        })}
                        {colors.length > 5 && (
                          <span
                            className="text-[10px] text-gray-400 ml-0.5"
                            style={{ fontFamily: "BRHendrix, sans-serif" }}
                          >
                            +{colors.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto pt-1">
                      {pricing.hasPrice ? (
                        <p
                          className="text-sm flex items-center gap-2 flex-wrap"
                          style={{ fontFamily: "BRHendrix, sans-serif" }}
                        >
                          <span
                            className={`font-bold ${
                              pricing.isOnSale
                                ? "text-red-500"
                                : "text-[#F16D34]"
                            }`}
                          >
                            {pricing.formattedCalculated}
                          </span>
                          {pricing.isOnSale && pricing.formattedOriginal && (
                            <span className="text-gray-400 line-through text-xs">
                              {pricing.formattedOriginal}
                            </span>
                          )}
                        </p>
                      ) : (
                        <p
                          className="text-sm text-gray-400"
                          style={{ fontFamily: "BRHendrix, sans-serif" }}
                        >
                          Price unavailable
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            </div>
          )
        })}
      </div>
    </div>
  )
}
