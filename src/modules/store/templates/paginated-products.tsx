import { listProductsWithSort, getProductsInventory } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductsByTagValue } from "@lib/data/tags"
import ProductCard from "@modules/home/components/product-sections/product-card"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SearchResults from "./search-results"
import FilteredProducts from "./filtered-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  tagValue,
  searchQuery,
  hasFilters,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  tagValue?: string
  searchQuery?: string
  hasFilters?: boolean
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // If there's a search query, use Meilisearch
  if (searchQuery) {
    return (
      <SearchResults searchQuery={searchQuery} page={page} region={region} />
    )
  }

  // If there are active Meilisearch filters (categories, tags, price), use FilteredProducts
  if (hasFilters) {
    return <FilteredProducts page={page} region={region} />
  }

  // If filtering by tag, use the tag-based query
  if (tagValue) {
    const products = await getProductsByTagValue(tagValue, 50, region.id)

    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No products found
          </h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your filters or check back later
          </p>
        </div>
      )
    }

    // Paginate
    const startIndex = (page - 1) * PRODUCT_LIMIT
    const paginatedProducts = products.slice(
      startIndex,
      startIndex + PRODUCT_LIMIT
    )
    const totalPages = Math.ceil(products.length / PRODUCT_LIMIT)

    // Fetch inventory for all products
    const productIds = paginatedProducts.map((p) => p.id)
    const inventoryByProduct = await getProductsInventory(productIds)

    return (
      <>
        <ul
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full"
          data-testid="products-list"
        >
          {paginatedProducts.map((p) => {
            // Flatten inventory for this product
            const productInventory = inventoryByProduct[p.id] || {}
            return (
              <li key={p.id}>
                <ProductCard
                  product={p}
                  region={region}
                  inventoryMap={productInventory}
                />
              </li>
            )
          })}
        </ul>
        {totalPages > 1 && (
          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        )}
      </>
    )
  }

  // Default: use collection/category based query
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No products found
        </h3>
        <p className="text-gray-500 text-sm">
          Try adjusting your filters or check back later
        </p>
      </div>
    )
  }

  // Fetch inventory for all products
  const productIds = products.map((p) => p.id)
  const inventoryByProduct = await getProductsInventory(productIds)

  return (
    <>
      <ul
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full"
        data-testid="products-list"
      >
        {products.map((p) => {
          // Flatten inventory for this product
          const productInventory = inventoryByProduct[p.id] || {}
          return (
            <li key={p.id}>
              <ProductCard
                product={p}
                region={region}
                inventoryMap={productInventory}
              />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
