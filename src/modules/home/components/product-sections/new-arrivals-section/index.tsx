/**
 * New Arrivals Section
 */

import { HttpTypes } from "@medusajs/types"
import { getNewArrivals } from "@lib/data/collections"
import ProductSection from "../product-section"

interface NewArrivalsSectionProps {
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function NewArrivalsSection({
  region,
}: NewArrivalsSectionProps) {
  const products = await getNewArrivals(4, region.id)

  if (!products || products.length === 0) {
    return null
  }

  return (
    <ProductSection
      title="New Arrivals"
      products={products}
      region={region}
      viewAllLink="/store?sort=created_at"
      maxItems={4}
    />
  )
}
