"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { meilisearchClient, PRODUCT_INDEX_NAME } from "@lib/meilisearch-config"
import { sdk } from "@lib/config"
import { getProductsInventory } from "@lib/data/products"
import ProductCard from "@modules/home/components/product-sections/product-card"
import { Pagination } from "@modules/store/components/pagination"

const PRODUCT_LIMIT = 12

export default function FilteredProducts({
  page,
  region,
}: {
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
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchProducts = async () => {
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

        console.log("=== URL PARAMS ===")
        console.log(
          "All search params:",
          Object.fromEntries(searchParams.entries())
        )
        console.log("Categories:", categories)
        console.log("Brands:", brands)
        console.log("Tags:", tags)

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
          console.log("=== BRAND FILTER DEBUG ===")
          console.log("Brand IDs from URL:", brands)
          console.log("Brand filter string:", brandFilters)
          console.log("Full filter array:", filters)
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

        // Search Meilisearch
        const index = meilisearchClient.index(PRODUCT_INDEX_NAME)
        const offset = (page - 1) * PRODUCT_LIMIT

        const filterString =
          filters.length > 0 ? filters.join(" AND ") : undefined
        console.log("=== MEILISEARCH QUERY ===")
        console.log("Filter string:", filterString)
        console.log("Sort:", sort)

        const results = await index.search("", {
          limit: PRODUCT_LIMIT,
          offset,
          filter: filterString,
          sort: sort.length > 0 ? sort : undefined,
        })

        console.log("=== MEILISEARCH RESULTS ===")
        console.log("Total hits:", results.estimatedTotalHits)
        console.log("Returned hits:", results.hits.length)
        if (results.hits.length > 0) {
          console.log("First product brand:", results.hits[0].brand)
        }

        const productIds = results.hits.map((hit: any) => hit.id)
        const totalHits = results.estimatedTotalHits || 0

        setTotalHits(totalHits)

        if (productIds.length === 0) {
          setProducts([])
          setInventoryByProduct({})
          setLoading(false)
          return
        }

        // Fetch full product data from Medusa API
        const { products: fullProducts } = await sdk.store.product.list({
          id: productIds,
          fields:
            "+variants.inventory_quantity,+variants.prices,*collection,+images",
          region_id: region.id,
        })

        // Sort products to match Meilisearch order
        const sortedProducts = productIds
          .map((id) => fullProducts.find((p) => p.id === id))
          .filter((p): p is HttpTypes.StoreProduct => p !== undefined)

        // Fetch inventory data
        const inventory = await getProductsInventory(productIds)

        // Flatten inventory map: product_id -> variant_id -> quantity becomes variant_id -> quantity
        const flatInventoryMap: Record<string, Record<string, number>> = {}
        Object.entries(inventory).forEach(([productId, variantMap]) => {
          flatInventoryMap[productId] = variantMap
        })

        setProducts(sortedProducts)
        setInventoryByProduct(flatInventoryMap)
      } catch (error) {
        console.error("Filter error:", error)
        setError(
          error instanceof Error ? error.message : "Failed to load products"
        )
        setProducts([])
        setInventoryByProduct({})
        setTotalHits(0)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, region.id, searchParams])

  const totalPages = Math.ceil(totalHits / PRODUCT_LIMIT)

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
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Error Loading Products
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          Try adjusting your filters or browse our full catalog.
        </p>
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
