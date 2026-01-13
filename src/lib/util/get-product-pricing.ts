/**
 * Product Pricing Helper
 * Single source of truth for calculating sale prices from Medusa v2 pricing
 */

import { HttpTypes } from "@medusajs/types"

export interface ProductPricing {
  minOriginal: number | null
  minCalculated: number | null
  isOnSale: boolean
  discountPct: number | null
  currencyCode: string
  hasPrice: boolean
  formattedOriginal: string | null
  formattedCalculated: string | null
}

/**
 * Format price in PHP with peso sign and thousands separators
 */
export function formatPrice(
  amount: number | null,
  currencyCode = "php"
): string | null {
  if (amount === null || amount === undefined) return null

  // Medusa stores prices in smallest unit (centavos for PHP)
  const value = amount / 100

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Get pricing information from a Medusa product
 * Handles both single and multi-variant products
 */
export function getProductPricing(
  product: HttpTypes.StoreProduct
): ProductPricing {
  const defaultResult: ProductPricing = {
    minOriginal: null,
    minCalculated: null,
    isOnSale: false,
    discountPct: null,
    currencyCode: "php",
    hasPrice: false,
    formattedOriginal: null,
    formattedCalculated: null,
  }

  if (!product?.variants || product.variants.length === 0) {
    return defaultResult
  }

  let minOriginal: number | null = null
  let minCalculated: number | null = null
  let currencyCode = "php"

  for (const variant of product.variants) {
    const calculatedPrice = variant.calculated_price

    if (!calculatedPrice) continue

    // Get the calculated (sale) price
    const calculated = calculatedPrice.calculated_amount
    // Get the original price
    const original = calculatedPrice.original_amount

    if (calculated !== null && calculated !== undefined) {
      if (minCalculated === null || calculated < minCalculated) {
        minCalculated = calculated
      }
    }

    if (original !== null && original !== undefined) {
      if (minOriginal === null || original < minOriginal) {
        minOriginal = original
      }
    }

    // Get currency code from the price
    if (calculatedPrice.currency_code) {
      currencyCode = calculatedPrice.currency_code.toLowerCase()
    }
  }

  // Determine if on sale
  const hasPrice = minCalculated !== null
  const isOnSale =
    hasPrice &&
    minOriginal !== null &&
    minCalculated !== null &&
    minCalculated < minOriginal

  // Calculate discount percentage
  let discountPct: number | null = null
  if (isOnSale && minOriginal && minCalculated) {
    discountPct = Math.round(
      ((minOriginal - minCalculated) / minOriginal) * 100
    )
  }

  return {
    minOriginal,
    minCalculated,
    isOnSale,
    discountPct,
    currencyCode,
    hasPrice,
    formattedOriginal: formatPrice(minOriginal, currencyCode),
    formattedCalculated: formatPrice(minCalculated, currencyCode),
  }
}

/**
 * Check if product has multiple variants with different prices
 */
export function hasMultipleVariants(product: HttpTypes.StoreProduct): boolean {
  return (product?.variants?.length ?? 0) > 1
}
