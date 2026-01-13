/**
 * Hot Deals Section
 */

import { HttpTypes } from "@medusajs/types"
import { getProductsByCollectionHandle } from "@lib/data/collections"
import ProductSection from "../product-section"

interface HotDealsSectionProps {
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function HotDealsSection({
  region,
}: HotDealsSectionProps) {
  let products = await getProductsByCollectionHandle("hot-deals", 4, region.id)

  if (!products || products.length === 0) {
    products = await getProductsByCollectionHandle("hot-deals1", 4, region.id)
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <ProductSection
      title="Hot Right Now"
      products={products}
      region={region}
      viewAllLink="/collections/hot-deals"
      maxItems={4}
    />
  )
}
