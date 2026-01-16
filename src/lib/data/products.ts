"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

// Fields for listing pages - includes options for size/color display
const LISTING_FIELDS =
  "id,title,handle,thumbnail,*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options"

// Full fields for product detail pages
const DETAIL_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,*options,+metadata,+tags"

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
