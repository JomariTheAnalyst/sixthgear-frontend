/**
 * Featured Section
 */

import { HttpTypes } from "@medusajs/types"
import { getProductsByCollectionHandle } from "@lib/data/collections"
import ProductSection from "../product-section"

interface FeaturedSectionProps {
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function FeaturedSection({
  region,
}: FeaturedSectionProps) {
  let products = await getProductsByCollectionHandle("featured", 4, region.id)

  if (!products || products.length === 0) {
    products = await getProductsByCollectionHandle(
      "helmet-test123",
      4,
      region.id
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <ProductSection
      title="Featured"
      products={products}
      region={region}
      viewAllLink="/collections/featured"
      maxItems={4}
    />
  )
}
