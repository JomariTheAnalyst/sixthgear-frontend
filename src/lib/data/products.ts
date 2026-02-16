"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

// Fields for listing pages - includes options for size/color display
const LISTING_FIELDS =
  "id,title,handle,thumbnail,*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options,*collection,+metadata"

// Full fields for product detail pages
const DETAIL_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,*options,+metadata,+tags,*collection"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  minimal = false,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
  minimal?: boolean
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cacheOptions = await getCacheOptions("products")

  // Use ISR with revalidation - 30s for faster cache refresh
  const next = {
    ...cacheOptions,
    revalidate: 30,
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields: minimal ? LISTING_FIELDS : DETAIL_FIELDS,
          ...queryParams,
        },
        headers,
        next,
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * Optimized listing fetch with proper pagination (no more fetching 2000 products)
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  // Build order param based on sortBy
  let orderParam: string | undefined
  switch (sortBy) {
    case "price_asc":
      orderParam = "variants.calculated_price.calculated_amount"
      break
    case "price_desc":
      orderParam = "-variants.calculated_price.calculated_amount"
      break
    case "created_at":
      orderParam = "created_at"
      break
    case "created_at_desc":
      orderParam = "-created_at"
      break
    default:
      orderParam = "created_at"
  }

  // Fetch only the page we need with proper offset
  const {
    response: { products, count },
  } = await listProducts({
    pageParam: page,
    queryParams: {
      ...queryParams,
      limit,
      order: orderParam,
    },
    countryCode,
    minimal: true, // Use minimal fields for listing
  })

  const nextPage = count > page * limit ? page + 1 : null

  return {
    response: {
      products,
      count,
    },
    nextPage,
    queryParams,
  }
}

/**
 * Get a single product by handle with full variant details
 */
export const getProductByHandle = async (
  handle: string,
  countryCode: string
): Promise<HttpTypes.StoreProduct | null> => {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cacheOptions = await getCacheOptions("products")

  const next = {
    ...cacheOptions,
    revalidate: 30,
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      method: "GET",
      query: {
        handle,
        region_id: region.id,
        fields: DETAIL_FIELDS,
        limit: 1,
      },
      headers,
      next,
    })
    .then(({ products }) => products[0] || null)
    .catch(() => null)
}

/**
 * Fetch inventory data for a product from custom backend endpoint
 */
export const getProductInventory = async (
  productId: string
): Promise<Record<string, number> | null> => {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    console.log(`[Inventory] Fetching for product: ${productId}`)
    console.log(`[Inventory] Backend URL: ${backendUrl}`)

    const response = await fetch(
      `${backendUrl}/store/products/${productId}/inventory`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": apiKey || "",
        },
        next: {
          revalidate: 10, // Cache for 10 seconds
        },
      }
    )

    if (!response.ok) {
      console.error(
        `[Inventory] Failed to fetch for product ${productId}: ${response.status}`
      )
      return null
    }

    const data = await response.json()
    console.log(`[Inventory] Data received for ${productId}:`, data)

    // Convert to variant_id -> quantity map
    const inventoryMap: Record<string, number> = {}
    data.variants?.forEach((v: any) => {
      inventoryMap[v.variant_id] = v.inventory_quantity || 0
    })

    console.log(`[Inventory] Mapped inventory:`, inventoryMap)
    return inventoryMap
  } catch (error) {
    console.error(
      `[Inventory] Error fetching inventory for product ${productId}:`,
      error
    )
    return null
  }
}

/**
 * Fetch inventory for multiple products
 */
export const getProductsInventory = async (
  productIds: string[]
): Promise<Record<string, Record<string, number>>> => {
  const inventoryPromises = productIds.map((id) => getProductInventory(id))
  const inventoryResults = await Promise.all(inventoryPromises)

  const inventoryByProduct: Record<string, Record<string, number>> = {}
  productIds.forEach((id, index) => {
    if (inventoryResults[index]) {
      inventoryByProduct[id] = inventoryResults[index]!
    }
  })

  return inventoryByProduct
}

/**
 * Check if customer has purchased a product
 */
export const checkProductPurchased = async (
  productId: string
): Promise<boolean> => {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    const headers = {
      "Content-Type": "application/json",
      "x-publishable-api-key": apiKey || "",
      ...(await getAuthHeaders()),
    }

    const response = await fetch(
      `${backendUrl}/store/products/${productId}/purchased`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.purchased || false
  } catch (error) {
    console.error(`Error checking purchase for product ${productId}:`, error)
    return false
  }
}

/**
 * Fetch reviews for a product
 */
export const getProductReviews = async (
  productId: string
): Promise<{
  reviews: any[]
  count: number
  average_rating: number
} | null> => {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    const response = await fetch(
      `${backendUrl}/store/products/${productId}/reviews`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": apiKey || "",
        },
        next: {
          revalidate: 30,
        },
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch reviews for product ${productId}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error)
    return null
  }
}

/**
 * Fetch product rating summary (average rating and count)
 */
export const getProductRating = async (
  productId: string
): Promise<{ average_rating: number; count: number }> => {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    const response = await fetch(
      `${backendUrl}/store/products/${productId}/rating`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": apiKey || "",
        },
        next: {
          revalidate: 30,
        },
      }
    )

    if (!response.ok) {
      return { average_rating: 0, count: 0 }
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching rating for product ${productId}:`, error)
    return { average_rating: 0, count: 0 }
  }
}

/**
 * Submit a product review (requires authentication)
 */
export const submitProductReview = async (data: {
  product_id: string
  title?: string
  content: string
  rating: number
  first_name: string
  last_name: string
}): Promise<{ success: boolean; message: string }> => {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    const headers = {
      "Content-Type": "application/json",
      "x-publishable-api-key": apiKey || "",
      ...(await getAuthHeaders()),
    }

    const response = await fetch(`${backendUrl}/store/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to submit review",
      }
    }

    return {
      success: true,
      message: result.message || "Review submitted successfully",
    }
  } catch (error) {
    console.error("Error submitting review:", error)
    return {
      success: false,
      message: "An error occurred while submitting your review",
    }
  }
}

/**
 * Fetch related products from Meilisearch (You May Like section)
 */
export const getRelatedProducts = async (
  productId: string,
  regionId?: string
): Promise<any[]> => {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    console.log(`[Related Products] Fetching for product: ${productId}`)
    console.log(`[Related Products] Backend URL: ${backendUrl}`)
    console.log(`[Related Products] Region ID: ${regionId}`)
    console.log(`[Related Products] API Key: ${apiKey ? "Present" : "Missing"}`)

    const url = new URL(`${backendUrl}/store/products/${productId}/related`)
    if (regionId) {
      url.searchParams.append("region_id", regionId)
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": apiKey || "",
      },
      next: {
        revalidate: 60, // Cache for 1 minute
      },
    })

    console.log(`[Related Products] Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[Related Products] Failed to fetch for ${productId}: ${response.status}`
      )
      console.error(`[Related Products] Error response:`, errorText)
      return []
    }

    const data = await response.json()
    console.log(
      `[Related Products] Received ${
        data.related_products?.length || 0
      } products`
    )
    return data.related_products || []
  } catch (error) {
    console.error(`[Related Products] Error fetching for ${productId}:`, error)
    return []
  }
}
