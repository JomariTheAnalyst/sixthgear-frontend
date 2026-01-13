/**
 * ProductCard Component
 * Shows SALE badge and crossed-out original price when on sale
 * All data from backend - no hardcoded values
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  getProductPricing,
  hasMultipleVariants,
} from "@lib/util/get-product-pricing"
import { addToCart } from "@lib/data/cart"

export type BadgeMode = "discount" | "rank" | "new" | "hot" | "none"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  badgeMode?: BadgeMode
  rank?: number
  region?: HttpTypes.StoreRegion
}

export default function ProductCard({ product, region }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  // Get pricing with sale detection
  const pricing = getProductPricing(product)
  const isMultiVariant = hasMultipleVariants(product)

  const imageUrl = product.thumbnail || product.images?.[0]?.url

  // Get available variants count
  const variantCount = product.variants?.length || 0
  const availabilityText =
    variantCount > 1
      ? `Available in ${variantCount} sizes`
      : variantCount === 1
      ? "Available in 1 size"
      : ""

  // Get first variant for quick add to cart
  const firstVariant = product.variants?.[0]
  const canAddToCart = firstVariant && region

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!canAddToCart || isAdding) return

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

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      {/* Card with border outline on all sides */}
      <div className="flex flex-col h-full border border-gray-200 hover:border-gray-300 transition-colors">
        {/* Product Image - Gray background */}
        <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden">
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

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title || "Product"}
              fill
              className="object-contain p-6 md:p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-20 h-20 text-gray-300"
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

          {/* Add to Cart Button - Shows on Hover */}
          {canAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="absolute bottom-4 left-4 right-4 py-3 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wide opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#F16D34] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "BRHendrix, sans-serif" }}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>

        {/* Line separator between image and text */}
        <div className="h-px bg-gray-200" />

        {/* Product Info - Minimal vertical spacing */}
        <div className="flex flex-col p-3">
          {/* Product Title */}
          <h3
            className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#F16D34] transition-colors"
            style={{ fontFamily: "BRHendrix, sans-serif" }}
          >
            {product.title}
          </h3>

          {/* Availability - minimal spacing */}
          {availabilityText && (
            <p
              className="text-xs text-gray-400 mt-0.5"
              style={{ fontFamily: "BRHendrix, sans-serif" }}
            >
              {availabilityText}
            </p>
          )}

          {/* Price - with sale support */}
          <div className="mt-1">
            {pricing.hasPrice ? (
              <p
                className="text-sm flex items-center gap-2 flex-wrap"
                style={{ fontFamily: "BRHendrix, sans-serif" }}
              >
                {isMultiVariant && <span className="text-gray-400">From </span>}
                <span
                  className={`font-bold ${
                    pricing.isOnSale ? "text-red-500" : "text-[#F16D34]"
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
  )
}
