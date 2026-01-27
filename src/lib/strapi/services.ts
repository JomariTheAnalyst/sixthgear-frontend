/**
 * Strapi Services Integration
 * Fetches service data from Strapi CMS with fallback to local data
 * Supports separate hero and detail images
 */

import {
  ServiceCategory,
  servicesData,
  getServiceBySlug as getLocalServiceBySlug,
  getAllServiceSlugs as getLocalServiceSlugs,
} from "@lib/services-data"

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  "http://localhost:1337"

// Strapi response types
interface StrapiImage {
  id: number
  url: string
  formats?: {
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  }
}

interface StrapiServiceItem {
  id: number
  services_name: string
  services_description?: string
  is_popular?: boolean
}

interface StrapiService {
  id: number
  title: string
  short_title: string
  slug: string
  description: string
  image?: StrapiImage
  hero_image?: StrapiImage
  detail_image?: StrapiImage
  services_item?: StrapiServiceItem[]
  order?: number
  is_active?: boolean
}

/**
 * Get best image URL from Strapi image object
 * Prefers medium, then large, then small, then original
 * Returns undefined if no image exists
 */
function getBestImageUrl(
  image: StrapiImage | undefined | null
): string | undefined {
  if (!image) return undefined

  // Try formats in order of preference
  const url =
    image.formats?.medium?.url ||
    image.formats?.large?.url ||
    image.formats?.small?.url ||
    image.url

  if (!url) return undefined

  // If URL is relative, prefix with Strapi URL
  if (url.startsWith("/")) {
    return `${STRAPI_URL}${url}`
  }

  return url
}

/**
 * Map Strapi service to local ServiceCategory format
 * Handles hero_image and detail_image with fallbacks
 */
function mapStrapiToService(item: StrapiService): ServiceCategory {
  // Extract image URLs
  const hero = getBestImageUrl(item.hero_image)
  const detail = getBestImageUrl(item.detail_image)
  const legacy = getBestImageUrl(item.image)

  return {
    id: item.slug || String(item.id),
    slug: item.slug,
    title: item.title,
    shortTitle: item.short_title || item.title,
    description: item.description,
    image: legacy || "", // Keep for backward compatibility
    heroImage: hero || legacy || "", // Fallback to legacy image
    detailImage: detail || legacy || "", // Fallback to legacy image
    items: (item.services_item || []).map((si) => si.services_name),
  }
}

/**
 * Fetch all services from Strapi
 * Returns null if fetch fails
 */
async function fetchServicesFromStrapi(): Promise<ServiceCategory[] | null> {
  try {
    const url = `${STRAPI_URL}/api/services?filters[is_active][$eq]=true&sort=order:asc&populate=*`

    console.log("[Strapi Services] Fetching from:", url)

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error(
        "[Strapi Services] Fetch failed:",
        response.status,
        response.statusText
      )
      return null
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      console.error("[Strapi Services] Invalid response format")
      return null
    }

    // Map Strapi data to local format
    const services = data.data.map((item: any) => {
      // Handle both nested and flat response formats
      const attributes = item.attributes || item
      return mapStrapiToService({
        id: item.id,
        ...attributes,
      })
    })

    console.log(`[Strapi Services] Fetched ${services.length} services`)
    return services
  } catch (error) {
    console.error("[Strapi Services] Error fetching services:", error)
    return null
  }
}

/**
 * Fetch single service by slug from Strapi
 * Returns null if fetch fails or service not found
 * Only returns active services (is_active=true)
 */
async function fetchServiceBySlugFromStrapi(
  slug: string
): Promise<ServiceCategory | null> {
  try {
    const url = `${STRAPI_URL}/api/services?filters[slug][$eq]=${slug}&filters[is_active][$eq]=true&populate=*`

    console.log("[Strapi Services] Fetching service by slug:", slug)

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error(
        "[Strapi Services] Fetch failed:",
        response.status,
        response.statusText
      )
      return null
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.log("[Strapi Services] Service not found:", slug)
      return null
    }

    // Get first matching service
    const item = data.data[0]
    const attributes = item.attributes || item
    const service = mapStrapiToService({
      id: item.id,
      ...attributes,
    })

    console.log("[Strapi Services] Found service:", service.title)
    console.log("[Strapi Services] Hero image:", service.heroImage ? "✓" : "✗")
    console.log(
      "[Strapi Services] Detail image:",
      service.detailImage ? "✓" : "✗"
    )
    return service
  } catch (error) {
    console.error("[Strapi Services] Error fetching service by slug:", error)
    return null
  }
}

/**
 * Get all service slugs from Strapi
 * Returns null if fetch fails
 */
async function getAllServiceSlugsFromStrapi(): Promise<string[] | null> {
  try {
    const url = `${STRAPI_URL}/api/services?filters[is_active][$eq]=true&fields[0]=slug&pagination[pageSize]=1000`

    console.log("[Strapi Services] Fetching slugs")

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error("[Strapi Services] Fetch slugs failed:", response.status)
      return null
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      console.error("[Strapi Services] Invalid slugs response format")
      return null
    }

    const slugs = data.data
      .map((item: any) => {
        const attributes = item.attributes || item
        return attributes.slug
      })
      .filter(Boolean)

    console.log(`[Strapi Services] Fetched ${slugs.length} slugs`)
    return slugs
  } catch (error) {
    console.error("[Strapi Services] Error fetching slugs:", error)
    return null
  }
}

/**
 * Get all services with fallback to local data
 * This is the main function to use in pages
 */
export async function getAllServices(): Promise<ServiceCategory[]> {
  const strapiServices = await fetchServicesFromStrapi()

  if (strapiServices && strapiServices.length > 0) {
    console.log("[Strapi Services] Using Strapi data")
    return strapiServices
  }

  console.log("[Strapi Services] Using fallback local data")
  // Add heroImage and detailImage to fallback data
  return servicesData.map((service) => ({
    ...service,
    heroImage: service.image,
    detailImage: service.image,
  }))
}

/**
 * Get single service by slug with fallback to local data
 * This is the main function to use in pages
 */
export async function getService(
  slug: string
): Promise<ServiceCategory | undefined> {
  const strapiService = await fetchServiceBySlugFromStrapi(slug)

  if (strapiService) {
    console.log("[Strapi Services] Using Strapi service data")
    return strapiService
  }

  console.log("[Strapi Services] Using fallback local service data")
  const localService = getLocalServiceBySlug(slug)
  if (localService) {
    // Add heroImage and detailImage to fallback data
    return {
      ...localService,
      heroImage: localService.image,
      detailImage: localService.image,
    }
  }
  return undefined
}

/**
 * Get all service slugs with fallback to local data
 * This is the main function to use in generateStaticParams
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  const strapiSlugs = await getAllServiceSlugsFromStrapi()

  if (strapiSlugs && strapiSlugs.length > 0) {
    console.log("[Strapi Services] Using Strapi slugs")
    return strapiSlugs
  }

  console.log("[Strapi Services] Using fallback local slugs")
  return getLocalServiceSlugs()
}
