"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async (id: string) => {
  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        cache: "no-store", // Real-time updates
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        query: queryParams,
        cache: "no-store", // Real-time updates
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  try {
    const response =
      await sdk.client.fetch<HttpTypes.StoreCollectionListResponse>(
        `/store/collections`,
        {
          query: { handle, fields: "*products" },
          cache: "no-store", // Real-time updates
        }
      )
    return response.collections[0] || null
  } catch (error) {
    console.error(`Error fetching collection by handle "${handle}":`, error)
    return null
  }
}

/**
 * Get products by collection handle with calculated pricing
 * Includes region_id for price list/sale price calculation
 */
export const getProductsByCollectionHandle = async (
  handle: string,
  limit: number = 8,
  regionId?: string
): Promise<HttpTypes.StoreProduct[]> => {
  try {
    // First get the collection
    const collection = await getCollectionByHandle(handle)

    if (!collection?.id) {
      console.warn(`Collection with handle "${handle}" not found`)
      return []
    }

    // Fetch products with calculated pricing context
    const query: Record<string, any> = {
      collection_id: [collection.id],
      limit,
      // Include calculated_price for sale price detection
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    }

    // IMPORTANT: region_id enables price list (sale) calculations
    if (regionId) {
      query.region_id = regionId
    }

    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      query,
      cache: "no-store", // Real-time sale price updates
    })

    return response.products || []
  } catch (error) {
    console.error(`Error fetching products for collection "${handle}":`, error)
    return []
  }
}

/**
 * Get new arrivals with calculated pricing
 */
export const getNewArrivals = async (
  limit: number = 8,
  regionId?: string
): Promise<HttpTypes.StoreProduct[]> => {
  try {
    const query: Record<string, any> = {
      limit,
      order: "-created_at",
      // Include calculated_price for sale price detection
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    }

    // IMPORTANT: region_id enables price list (sale) calculations
    if (regionId) {
      query.region_id = regionId
    }

    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      query,
      cache: "no-store", // Real-time sale price updates
    })

    return response.products || []
  } catch (error) {
    console.error("Error fetching new arrivals:", error)
    return []
  }
}
