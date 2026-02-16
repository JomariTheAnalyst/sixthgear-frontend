import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listBrands } from "@lib/data/brands"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import StoreLayout from "./store-layout"

// Tag display names (handles various input formats)
const TAG_TITLES: Record<string, string> = {
  "best-seller": "Best Sellers",
  bestseller: "Best Sellers",
  "best seller": "Best Sellers",
  "hot-deal": "Hot Deals",
  "hot-deals": "Hot Deals",
  hotdeals: "Hot Deals",
  "hot deals": "Hot Deals",
  "new-arrival": "New Arrivals",
  newarrivals: "New Arrivals",
  featured: "Featured",
}

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  tagValue,
  categoryHandle,
  searchQuery,
  hasFilters,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  tagValue?: string
  categoryHandle?: string
  searchQuery?: string
  hasFilters?: boolean
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Fetch categories and brands for the sidebar
  const categories = await listCategories()
  const brands = await listBrands()

  // Find category by handle if provided (handles with/without leading slash)
  const selectedCategory = categoryHandle
    ? categories.find((cat) => {
        const cleanCatHandle = cat.handle.startsWith("/")
          ? cat.handle.slice(1)
          : cat.handle
        return (
          cleanCatHandle === categoryHandle ||
          cat.handle === categoryHandle ||
          cat.handle === `/${categoryHandle}`
        )
      })
    : null

  // Normalize tag for title lookup
  const normalizedTag = tagValue?.toLowerCase().replace(/[\s-_]+/g, "") || ""
  const title = searchQuery
    ? `Search results for "${searchQuery}"`
    : tagValue
    ? TAG_TITLES[tagValue.toLowerCase()] ||
      TAG_TITLES[normalizedTag] ||
      tagValue
    : selectedCategory
    ? selectedCategory.name
    : null

  return (
    <StoreLayout
      sortBy={sort}
      categories={categories}
      brands={brands}
      searchQuery={searchQuery}
    >
      <div className="p-6 md:p-8 w-full">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {searchQuery
                ? `Showing results for your search`
                : selectedCategory
                ? `Browse our ${selectedCategory.name.toLowerCase()} products`
                : `Browse our ${title.toLowerCase()} collection`}
            </p>
          </div>
        )}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            tagValue={tagValue}
            categoryId={selectedCategory?.id}
            searchQuery={searchQuery}
            hasFilters={hasFilters}
          />
        </Suspense>
      </div>
    </StoreLayout>
  )
}

export default StoreTemplate
