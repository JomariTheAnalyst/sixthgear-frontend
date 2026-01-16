/**
 * Best Sellers Section
 * Fetches products tagged with "Best Seller"
 */

import { HttpTypes } from "@medusajs/types"
import { getProductsByTagValue } from "@lib/data/tags"
import ProductSection from "../product-section"

interface BestSellersSectionProps {
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function BestSellersSection({
  region,
  countryCode,
}: BestSellersSectionProps) {
  // Try both formats - "Best Seller" (admin) and "best-seller" (normalized)
  const products = await getProductsByTagValue("Best Seller", 4, region.id)

  if (!products || products.length === 0) {
    return null
  }

  return (
    <ProductSection
      title="Best Sellers"
      products={products}
      region={region}
      viewAllLink={`/${countryCode}/store?tag=best-seller`}
      maxItems={4}
    />
  )
}
