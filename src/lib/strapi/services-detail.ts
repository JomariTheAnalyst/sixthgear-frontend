/**
 * Strapi Services Collection Type Fetcher
 *
 * Fetches individual service data from Strapi CMS collection type 'services'.
 * Used for the service detail pages at /services/[slug].
 *
 * This module provides a fallback mechanism: if Strapi is unavailable,
 * data from the local services-data.ts file is returned instead.
 */

import {
  ServiceCategory,
  servicesData,
  getServiceBySlug,
} from "@lib/services-data"

// ============================================================================
// Types
// ============================================================================

/**
 * Strapi image format structure
 */
interface StrapiImageFormat {
  url: string
  width: number
  height: number
  name: string
  hash: string
  ext: string
  mime: string
  size: number
}

/**
 * Strapi image object with optional formats
 */
interface StrapiImage {
  id: number
  documentId?: string
  url: string
  alternativeText?: string | null
  caption?: string | null
  width?: number
  height?: number
  formats?: {
    small?: StrapiImageFormat
    medium?: StrapiImageFormat
    large?: StrapiImageFormat
    thumbnail?: StrapiImageFormat
  } | null
}

/**
 * Strapi service item component (services_item)
 */
interface StrapiServiceItem {
  id: number
  services_name: string
}

/**
 * Raw Strapi service data structure (flattened in v5)
 */
interface StrapiServiceRaw {
  id: number
  documentId?: string
  title: string
  short_title: string | null
  slug: string
  description: string
  image: StrapiImage | null
  order: number | string | null
  is_active: boolean
  services_item: StrapiServiceItem[] | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

/**
 * Strapi API response wrapper
 */
interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// ============================================================================
// Constants
// ============================================================================

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337"

const STRAPI_TOKEN = process.env.STRAPI_TOKEN || ""

// Revalidation times (ISR)
const REVALIDATE_SERVICE_DATA = 60 // 60 seconds for service detail data
const REVALIDATE_SLUGS = 300 // 5 minutes for slug list

// ============================================================================
// Utilities
// ============================================================================

/**
 * Get the best available image URL from a Strapi image object
 *
 * Preference order: medium > large > small > original URL
 * Handles both relative and absolute URLs
 *
 * @param image - Strapi image object
 * @returns Absolute image URL or undefined if no image
 */
function getBestImageUrl(
  image: StrapiImage | null | undefined
): string | undefined {
  if (!image) return undefined

  // Prefer medium format, then large, then small, then original
  const formats = image.formats
  let imageUrl: string | undefined

  if (formats?.medium?.url) {
    imageUrl = formats.medium.url
  } else if (formats?.large?.url) {
    imageUrl = formats.large.url
  } else if (formats?.small?.url) {
    imageUrl = formats.small.url
  } else if (image.url) {
    imageUrl = image.url
  }

  if (!imageUrl) return undefined

  // Handle relative URLs - prefix with STRAPI_URL
  if (imageUrl.startsWith("/")) {
    return `${STRAPI_URL}${imageUrl}`
  }

  // Already absolute URL
  return imageUrl
}

/**
 * Map Strapi service data to local ServiceCategory format
 *
 * @param item - Raw Strapi service data
 * @returns ServiceCategory compatible with local data format
 */
function mapStrapiToService(item: StrapiServiceRaw): ServiceCategory {
  return {
    id: item.slug || String(item.id),
    slug: item.slug,
    title: item.title,
    shortTitle: item.short_title || item.title,
    description: item.description || "",
    image: getBestImageUrl(item.image) || "",
    items: (item.services_item || []).map((x) => x.services_name),
  }
}

// ============================================================================
// Strapi API Fetchers (raw data, no fallback)
// ============================================================================

/**
 * Fetch all active services from Strapi
 *
 * @returns Array of services or null if fetch fails
 */
async function fetchServicesFromStrapi(): Promise<ServiceCategory[] | null> {
  try {
    const url = new URL("/api/services", STRAPI_URL)
    url.searchParams.set("filters[is_active][$eq]", "true")
    url.searchParams.set("sort", "order:asc")
    url.searchParams.set("populate", "*")

    console.log("[Strapi Services] Fetching all services from:", url.toString())

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      next: { revalidate: REVALIDATE_SERVICE_DATA },
      // Add timeout and error handling
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error(
        `[Strapi Services] Failed to fetch services: ${response.status} ${response.statusText}`
      )
      return null
    }

    const result: StrapiResponse<StrapiServiceRaw[]> = await response.json()

    if (!result.data || !Array.isArray(result.data)) {
      console.error("[Strapi Services] Invalid response structure:", result)
      return null
    }

    console.log(
      `[Strapi Services] ✅ Fetched ${result.data.length} services from Strapi`
    )

    return result.data.map(mapStrapiToService)
  } catch (error) {
    console.error("[Strapi Services] Error fetching services:", error)
    // Always return null, never throw
    return null
  }
}

/**
 * Fetch a single service by slug from Strapi
 *
 * @param slug - Service slug
 * @returns Single service or null if not found/fetch fails
 */
async function fetchServiceBySlugFromStrapi(
  slug: string
): Promise<ServiceCategory | null> {
  try {
    const url = new URL("/api/services", STRAPI_URL)
    url.searchParams.set("filters[slug][$eq]", slug)
    url.searchParams.set("populate", "*")

    console.log(
      `[Strapi Services] Fetching service by slug "${slug}" from:`,
      url.toString()
    )

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      next: { revalidate: REVALIDATE_SERVICE_DATA },
    })

    if (!response.ok) {
      console.error(
        `[Strapi Services] Failed to fetch service by slug: ${response.status} ${response.statusText}`
      )
      return null
    }

    const result: StrapiResponse<StrapiServiceRaw[]> = await response.json()

    if (
      !result.data ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      console.log(`[Strapi Services] No service found with slug "${slug}"`)
      return null
    }

    console.log(
      `[Strapi Services] ✅ Found service "${result.data[0].title}" from Strapi`
    )

    return mapStrapiToService(result.data[0])
  } catch (error) {
    console.error(
      `[Strapi Services] Error fetching service by slug "${slug}":`,
      error
    )
    return null
  }
}

/**
 * Fetch all service slugs from Strapi
 *
 * @returns Array of slugs or null if fetch fails
 */
async function getAllServiceSlugsFromStrapi(): Promise<string[] | null> {
  try {
    const url = new URL("/api/services", STRAPI_URL)
    url.searchParams.set("filters[is_active][$eq]", "true")
    url.searchParams.set("fields[0]", "slug")
    url.searchParams.set("pagination[pageSize]", "1000")

    console.log(
      "[Strapi Services] Fetching all service slugs from:",
      url.toString()
    )

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      next: { revalidate: REVALIDATE_SLUGS },
    })

    if (!response.ok) {
      console.error(
        `[Strapi Services] Failed to fetch slugs: ${response.status} ${response.statusText}`
      )
      return null
    }

    const result: StrapiResponse<Array<{ id: number; slug: string }>> =
      await response.json()

    if (!result.data || !Array.isArray(result.data)) {
      console.error("[Strapi Services] Invalid response structure:", result)
      return null
    }

    const slugs = result.data.map((item) => item.slug).filter(Boolean)

    console.log(
      `[Strapi Services] ✅ Fetched ${slugs.length} slugs from Strapi`
    )

    return slugs
  } catch (error) {
    console.error("[Strapi Services] Error fetching slugs:", error)
    return null
  }
}

// ============================================================================
// Public API with Fallback
// ============================================================================

/**
 * Get all services (Strapi first, fallback to local data)
 *
 * @returns Array of all services
 */
export async function getAllServices(): Promise<ServiceCategory[]> {
  const strapiServices = await fetchServicesFromStrapi()

  if (strapiServices && strapiServices.length > 0) {
    return strapiServices
  }

  console.log("[Strapi Services] ⚠️ Using fallback local services data")
  return servicesData
}

/**
 * Get a single service by slug (Strapi first, fallback to local data)
 *
 * @param slug - Service slug
 * @returns Service or undefined if not found
 */
export async function getService(
  slug: string
): Promise<ServiceCategory | undefined> {
  const strapiService = await fetchServiceBySlugFromStrapi(slug)

  if (strapiService) {
    return strapiService
  }

  console.log(
    `[Strapi Services] ⚠️ Using fallback local data for slug "${slug}"`
  )
  return getServiceBySlug(slug)
}

/**
 * Get all service slugs (Strapi first, fallback to local data)
 *
 * @returns Array of all service slugs
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  const strapiSlugs = await getAllServiceSlugsFromStrapi()

  if (strapiSlugs && strapiSlugs.length > 0) {
    return strapiSlugs
  }

  console.log("[Strapi Services] ⚠️ Using fallback local slugs")
  return servicesData.map((s) => s.slug)
}
