/**
 * ProductCard Component
 * Redesigned layout: Image → Category → Title → Reviews → Price/Stock → Add to Cart
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductPricing } from "@lib/util/get-product-pricing"
import { addToCart } from "@lib/data/cart"
import WishlistButton from "@modules/wishlist/components/wishlist-button"
import StarRating from "@modules/products/components/star-rating"

export type BadgeMode = "discount" | "rank" | "new" | "hot" | "none"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  badgeMode?: BadgeMode
  rank?: number
  region?: HttpTypes.StoreRegion
  inventoryMap?: Record<string, number> // variant_id -> quantity (flattened from product level)
  rating?: { average_rating: number; count: number } // Rating data passed from server
}

export default function ProductCard({
  product,
  region,
  inventoryMap,
  rating, // Keep for backward compatibility but prefer metadata
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  // Read rating from product metadata (precomputed aggregates)
  const ratingAverage = (product.metadata?.rating_average as number) || 0
  const ratingCount = (product.metadata?.rating_count as number) || 0

  console.log(`[ProductCard] ${product.title}:`, {
    ratingAverage,
    ratingCount,
    metadata: product.metadata,
  })

  // Get pricing with sale detection
  const pricing = getProductPricing(product)
  const imageUrl = product.thumbnail || product.images?.[0]?.url

  // Get first variant for quick add to cart and stock check
  const firstVariant = product.variants?.[0]
  const canAddToCart = firstVariant && region

  // Check stock status using inventory data if available
  // Priority: inventoryMap > allow_backorder > manage_inventory false > inventory_quantity from API
  const isInStock = (() => {
    if (!firstVariant) return false

    console.log(`[ProductCard] ${product.title}:`, {
      variantId: firstVariant.id,
      hasInventoryMap: !!inventoryMap,
      inventoryMapValue: inventoryMap?.[firstVariant.id],
      allow_backorder: firstVariant.allow_backorder,
      manage_inventory: firstVariant.manage_inventory,
      inventory_quantity: firstVariant.inventory_quantity,
    })

    // If we have inventory data from our custom endpoint, use it
    if (inventoryMap && firstVariant.id in inventoryMap) {
      const quantity = inventoryMap[firstVariant.id]
      console.log(`[ProductCard] Using inventoryMap: ${quantity}`)
      return quantity > 0
    }

    // Fallback to variant properties
    if (firstVariant.allow_backorder === true) {
      console.log(`[ProductCard] Using allow_backorder: true`)
      return true
    }
    if (firstVariant.manage_inventory === false) {
      console.log(`[ProductCard] Using manage_inventory: false`)
      return true
    }

    // Check API inventory_quantity (may be null in Medusa v2)
    if (
      firstVariant.inventory_quantity !== null &&
      firstVariant.inventory_quantity !== undefined
    ) {
      console.log(
        `[ProductCard] Using inventory_quantity: ${firstVariant.inventory_quantity}`
      )
      return firstVariant.inventory_quantity > 0
    }

    // Default: if manage_inventory is true but no data, assume out of stock
    console.log(`[ProductCard] Defaulting to out of stock`)
    return false
  })()

  // Get brand name from collection (not category)
  const brandName = product.collection?.title || "No Brand"

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!canAddToCart || isAdding || !isInStock) return

    setIsAdding(true)
    try {
      await addToCart({
        variantId: firstVariant.id,
        quantity: 1,
        countryCode: region.countries?.[0]?.iso_2 || "ph",
      })
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  // Star rating component - reads from product metadata
  const StarRatingDisplay = () => (
    <StarRating rating={ratingAverage} count={ratingCount} size="sm" />
  )

  return (
    <div className="group block h-full">
      {/* Card with border */}
      <div className="flex flex-col h-full border border-gray-200 hover:border-gray-300 transition-colors bg-white">
        {/* Product Image */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            {/* Discount Badge */}
            {pricing.isOnSale &&
              pricing.discountPct &&
              pricing.discountPct >= 5 && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded">
                    -{pricing.discountPct}%
                  </span>
                </div>
              )}

            {/* Wishlist Button */}
            <div className="absolute top-3 right-3 z-10">
              <WishlistButton
                variantId={firstVariant?.id || ""}
                productId={product.id}
                size="sm"
              />
            </div>

            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.title || "Product"}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-300"
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
          </div>
        </LocalizedClientLink>

        {/* Product Details */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Brand Name (from Collection) */}
          <LocalizedClientLink href={`/products/${product.handle}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {brandName}
            </p>
          </LocalizedClientLink>

          {/* Product Title */}
          <LocalizedClientLink href={`/products/${product.handle}`}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
              {product.title}
            </h3>
          </LocalizedClientLink>

          {/* Reviews */}
          <StarRatingDisplay />

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {pricing.hasPrice ? (
              <>
                <span
                  className={`text-base font-bold ${
                    pricing.isOnSale ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {pricing.formattedCalculated}
                </span>
                {pricing.isOnSale && pricing.formattedOriginal && (
                  <span className="text-sm text-gray-400 line-through">
                    {pricing.formattedOriginal}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-400">Price unavailable</span>
            )}
          </div>

          {/* Add to Cart Button - Always visible at bottom */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !canAddToCart || !isInStock}
            className="w-full mt-auto py-2.5 bg-gray-900 text-white text-sm font-semibold uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding
              ? "Adding..."
              : !isInStock
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}
