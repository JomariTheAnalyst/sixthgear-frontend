/**
 * Hot Deals Section
 * Fetches products tagged with "Hot Deals"
 */

import { HttpTypes } from "@medusajs/types"
import { getProductsByTagValue } from "@lib/data/tags"
import ProductSection from "../product-section"

interface HotDealsSectionProps {
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function HotDealsSection({
  region,
  countryCode,
}: HotDealsSectionProps) {
  // Try both formats - "Hot Deals" (admin) and "hot-deal" (normalized)
  const products = await getProductsByTagValue("Hot Deals", 4, region.id)

  if (!products || products.length === 0) {
    return null
  }

  return (
    <ProductSection
      title="Hot Right Now"
      products={products}
      region={region}
      viewAllLink={`/${countryCode}/store?tag=hot-deals`}
      maxItems={4}
    />
  )
}
