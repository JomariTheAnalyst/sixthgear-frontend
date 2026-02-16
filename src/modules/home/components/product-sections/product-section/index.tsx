/**
 * ProductSection Component
 * Dominating title, horizontal scroll on mobile/tablet, 4 column grid on desktop
 */

import { HttpTypes } from "@medusajs/types"
import { getProductsInventory } from "@lib/data/products"
import ProductCard, { BadgeMode } from "../product-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ProductSectionProps {
  title: string
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  badgeMode?: BadgeMode
  viewAllLink?: string
  maxItems?: number
}

export default async function ProductSection({
  title,
  products,
  region,
  badgeMode = "none",
  viewAllLink,
  maxItems = 4,
}: ProductSectionProps) {
  if (!products || products.length === 0) {
    return null
  }

  // Limit to maxItems
  const displayProducts = products.slice(0, maxItems)

  // Fetch inventory for all products
  const productIds = displayProducts.map((p) => p.id)
  const inventoryByProduct = await getProductsInventory(productIds)

  return (
    <section className="py-10 md:py-12 lg:py-16 bg-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 px-4 md:px-8 lg:px-12">
          {/* Dominating Title */}
          <h2
            className="text-2xl md:text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tight"
            style={{ fontFamily: "BRHendrix, sans-serif" }}
          >
            {title}
          </h2>

          {/* Shop the Collection Button */}
          {viewAllLink && (
            <LocalizedClientLink
              href={viewAllLink}
              className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-gray-900 text-white text-xs md:text-sm font-semibold uppercase tracking-wide hover:bg-[#F16D34] transition-colors duration-300"
              style={{ fontFamily: "BRHendrix, sans-serif" }}
            >
              <span className="hidden sm:inline">Shop the Collection</span>
              <span className="sm:hidden">Shop</span>
              <svg
                className="w-3 h-3 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </LocalizedClientLink>
          )}
        </div>

        {/* Mobile/Tablet: Horizontal Scroll */}
        <div className="lg:hidden">
          <div
            className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[40vw] snap-start"
              >
                <ProductCard
                  product={product}
                  region={region}
                  badgeMode={badgeMode}
                  inventoryMap={inventoryByProduct[product.id]}
                />
              </div>
            ))}
          </div>
          {/* Scroll Indicator */}
          <div className="flex justify-center gap-1 mt-3 px-4">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              Swipe
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 px-4 md:px-8 lg:px-12">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              region={region}
              badgeMode={badgeMode}
              inventoryMap={inventoryByProduct[product.id]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
