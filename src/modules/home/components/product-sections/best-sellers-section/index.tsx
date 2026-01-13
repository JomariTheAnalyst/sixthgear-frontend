/**
 * Best Sellers Section
 */

import { HttpTypes } from "@medusajs/types"
import { getProductsByCollectionHandle } from "@lib/data/collections"
import ProductSection from "../product-section"

interface BestSellersSectionProps {
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function BestSellersSection({
  region,
}: BestSellersSectionProps) {
  const products = await getProductsByCollectionHandle(
    "best-sellers",
    4,
    region.id
  )

  if (!products || products.length === 0) {
    return null
  }

  return (
    <ProductSection
      title="Best Sellers"
      products={products}
      region={region}
      viewAllLink="/collections/best-sellers"
      maxItems={4}
    />
  )
}
