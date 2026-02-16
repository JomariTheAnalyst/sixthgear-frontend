"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

// Minimal fields for tag-based product listing
const TAG_LISTING_FIELDS =
  "id,title,handle,thumbnail,*variants.calculated_price,+variants.inventory_quantity,*tags,*collection,+metadata"

/**
 * Get products by tag value with calculated pricing
 * Uses direct product query with tags expansion
 * @param tagValue - The tag value (e.g., "Best Seller", "Hot Deals")
 * @param limit - Maximum number of products to return
 * @param regionId - Region ID for price calculations
 */
export const getProductsByTagValue = async (
  tagValue: string,
  limit: number = 8,
  regionId?: string
): Promise<HttpTypes.StoreProduct[]> => {
  try {
    // Fetch products with tags included
    const query: Record<string, any> = {
      limit: 50, // Reduced from 100
      fields: TAG_LISTING_FIELDS,
    }

    if (regionId) {
      query.region_id = regionId
    }

    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      query,
      next: {
        revalidate: 30, // Cache for 30 seconds
      },
    })

    if (!response.products || response.products.length === 0) {
      return []
    }

    // Normalize function for comparison
    const normalize = (str: string) => str.toLowerCase().replace(/[\s-_]+/g, "")

    const normalizedSearch = normalize(tagValue)

    // Filter products that have the matching tag
    const filteredProducts = response.products.filter((product) => {
      if (!product.tags || product.tags.length === 0) {
        return false
      }

      return product.tags.some((tag: any) => {
        // Handle both tag.value and direct string tags
        const tagVal = typeof tag === "string" ? tag : tag.value || tag.id || ""
        const normalizedTag = normalize(tagVal)
        return normalizedTag === normalizedSearch
      })
    })

    // Return limited results
    return filteredProducts.slice(0, limit)
  } catch (error) {
    console.error(
      `[Tags] Error fetching products for tag "${tagValue}":`,
      error
    )
    return []
  }
}

/**
 * Get products by multiple tag values
 */
export const getProductsByTagValues = async (
  tagValues: string[],
  limit: number = 8,
  regionId?: string
): Promise<HttpTypes.StoreProduct[]> => {
  try {
    const query: Record<string, any> = {
      limit: 50,
      fields: TAG_LISTING_FIELDS,
    }

    if (regionId) {
      query.region_id = regionId
    }

    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      query,
      next: {
        revalidate: 30,
      },
    })

    if (!response.products) {
      return []
    }

    const normalize = (str: string) => str.toLowerCase().replace(/[\s-_]+/g, "")

    const normalizedSearches = tagValues.map(normalize)

    const filteredProducts = response.products.filter((product) => {
      if (!product.tags || product.tags.length === 0) {
        return false
      }

      return product.tags.some((tag: any) => {
        const tagVal = typeof tag === "string" ? tag : tag.value || tag.id || ""
        const normalizedTag = normalize(tagVal)
        return normalizedSearches.includes(normalizedTag)
      })
    })

    return filteredProducts.slice(0, limit)
  } catch (error) {
    console.error(
      `[Tags] Error fetching products for tags "${tagValues.join(", ")}":`,
      error
    )
    return []
  }
}
