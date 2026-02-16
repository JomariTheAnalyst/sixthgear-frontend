"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { meilisearchClient, PRODUCT_INDEX_NAME } from "@lib/meilisearch-config"
import { sdk } from "@lib/config"
import { getProductsInventory } from "@lib/data/products"
import ProductCard from "@modules/home/components/product-sections/product-card"
import { Pagination } from "@modules/store/components/pagination"

const PRODUCT_LIMIT = 12

export default function SearchResults({
  searchQuery,
  page,
  region,
}: {
  searchQuery: string
  page: number
  region: HttpTypes.StoreRegion
}) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [inventoryByProduct, setInventoryByProduct] = useState<
    Record<string, Record<string, number>>
  >({})
  const [totalHits, setTotalHits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const searchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        // Get filter params from URL
        const categories =
          searchParams.get("categories")?.split(",").filter(Boolean) || []
        const brands =
          searchParams.get("brands")?.split(",").filter(Boolean) || []
        const tags = searchParams.get("tags")?.split(",").filter(Boolean) || []
        const minPrice = searchParams.get("minPrice")
        const maxPrice = searchParams.get("maxPrice")
        const sortBy = searchParams.get("sort") || "relevance"

        // Build Meilisearch filter string
        const filters: string[] = []

        if (categories.length > 0) {
          const categoryFilters = categories
            .map((cat) => `categories.handle = "${cat}"`)
            .join(" OR ")
          filters.push(`(${categoryFilters})`)
        }

        if (brands.length > 0) {
          const brandFilters = brands
            .map((brandId) => `brand.id = "${brandId}"`)
            .join(" OR ")
          filters.push(`(${brandFilters})`)
        }

        if (tags.length > 0) {
          const tagFilters = tags
            .map((tag) => `tags.value = "${tag}"`)
            .join(" OR ")
          filters.push(`(${tagFilters})`)
        }

        if (minPrice || maxPrice) {
          if (minPrice && maxPrice) {
            filters.push(
              `min_price >= ${minPrice} AND max_price <= ${maxPrice}`
            )
          } else if (minPrice) {
            filters.push(`min_price >= ${minPrice}`)
          } else if (maxPrice) {
            filters.push(`max_price <= ${maxPrice}`)
          }
        }

        // Build sort parameter
        let sort: string[] = []
        if (sortBy === "price_asc") {
          sort = ["min_price:asc"]
        } else if (sortBy === "price_desc") {
          sort = ["min_price:desc"]
        } else if (sortBy === "newest") {
          sort = ["created_at:desc"]
        } else if (sortBy === "oldest") {
          sort = ["created_at:asc"]
        }

        // Step 1: Search Meilisearch for product IDs
        const index = meilisearchClient.index(PRODUCT_INDEX_NAME)
        const offset = (page - 1) * PRODUCT_LIMIT

        const results = await index.search(searchQuery, {
          limit: PRODUCT_LIMIT,
          offset,
          filter: filters.length > 0 ? filters.join(" AND ") : undefined,
          sort: sort.length > 0 ? sort : undefined,
        })

        const productIds = results.hits.map((hit: any) => hit.id)
        const totalHits = results.estimatedTotalHits || 0

        setTotalHits(totalHits)

        if (productIds.length === 0) {
          setProducts([])
          setInventoryByProduct({})
          setLoading(false)
          return
        }

        // Step 2: Fetch full product data from Medusa API
        const { products: fullProducts } = await sdk.store.product.list({
          id: productIds,
          fields:
            "+variants.inventory_quantity,+variants.prices,*collection,+images",
          region_id: region.id,
        })

        // Step 3: Sort products to match Meilisearch order
        const sortedProducts = productIds
          .map((id) => fullProducts.find((p) => p.id === id))
          .filter((p): p is HttpTypes.StoreProduct => p !== undefined)

        // Step 4: Fetch inventory data
        const inventory = await getProductsInventory(productIds)

        setProducts(sortedProducts)
        setInventoryByProduct(inventory)
      } catch (error) {
        console.error("Search error:", error)
        setError(error instanceof Error ? error.message : "Search failed")
        setProducts([])
        setInventoryByProduct({})
        setTotalHits(0)
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [searchQuery, page, region.id, searchParams])

  const totalPages = Math.ceil(totalHits / PRODUCT_LIMIT)

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("query")
    router.push(`${pathname}?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Search Error</h3>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
        <button
          onClick={handleClearSearch}
          className="px-6 py-3 bg-[#F16D34] text-white font-medium rounded-lg hover:bg-[#d85a28] transition-colors"
        >
          Clear search and browse all products
        </button>
      </div>
    )
  }

  if (totalHits === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find anything for "{searchQuery}". Try a different keyword
          or browse our categories.
        </p>
        <button
          onClick={handleClearSearch}
          className="px-6 py-3 bg-[#F16D34] text-white font-medium rounded-lg hover:bg-[#d85a28] transition-colors"
        >
          Clear search and browse all products
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        Found {totalHits} {totalHits === 1 ? "product" : "products"}
      </div>
      <ul
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full"
        data-testid="products-list"
      >
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard
              product={p}
              region={region}
              inventoryMap={inventoryByProduct[p.id]}
            />
          </li>
        ))}
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
