/**
 * ProductSection Component
 * Dominating title, 4 column grid with bigger cards
 */

import { HttpTypes } from "@medusajs/types"
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

export default function ProductSection({
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

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 lg:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Dominating Title */}
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tight"
            style={{ fontFamily: "BRHendrix, sans-serif" }}
          >
            {title}
          </h2>

          {/* Shop the Collection Button */}
          {viewAllLink && (
            <LocalizedClientLink
              href={viewAllLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#F16D34] transition-colors duration-300"
              style={{ fontFamily: "BRHendrix, sans-serif" }}
            >
              <span>Shop the Collection</span>
              <svg
                className="w-4 h-4"
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

        {/* Products Grid - 4 columns, bigger gaps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              region={region}
              badgeMode={badgeMode}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
