/**
 * Breadcrumb Component
 * Dynamic breadcrumb navigation for product pages
 * Mobile responsive with truncation
 */

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BreadcrumbProps = {
  product: HttpTypes.StoreProduct
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-2 text-xs md:text-sm text-gray-500 overflow-x-auto scrollbar-hide py-2"
      aria-label="Breadcrumb"
    >
      {/* Home */}
      <LocalizedClientLink
        href="/"
        className="hover:text-[#F16D34] transition-colors whitespace-nowrap"
      >
        HOME
      </LocalizedClientLink>

      {/* Separator */}
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>

      {/* Store/Shop Link */}
      <LocalizedClientLink
        href="/store"
        className="hover:text-[#F16D34] transition-colors whitespace-nowrap"
      >
        STORE
      </LocalizedClientLink>

      {/* Separator */}
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>

      {/* Current Product */}
      <span className="text-gray-900 font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-none uppercase">
        {product.title}
      </span>
    </nav>
  )
}
