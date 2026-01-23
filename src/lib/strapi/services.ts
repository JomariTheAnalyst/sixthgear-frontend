/**
 * Strapi Moto Services Content Fetcher
 *
 * Fetches moto services section content from Strapi CMS for the homepage.
 */

import { StrapiImage } from "./home"

// Type definitions for Moto Services block (Strapi v5 structure)
export interface ServiceItem {
  id: number
  services_name: string
  services_description: string
  services_image: StrapiImage | null
  enabled: boolean
}

export interface MotoServicesBlock {
  __component: "sections.moto-services"
  id: number
  section_title: string
  section_description: string
  enabled: boolean
  services: ServiceItem[]
}

export interface MotoServicesContent {
  sectionTitle: string
  sectionDescription: string
  services: Array<{
    id: number
    title: string
    description: string
    image: string | null
  }>
}

/**
 * Resolve Strapi image URL to absolute URL
 *
 * @param url - Image URL from Strapi (can be relative or absolute)
 * @returns Absolute image URL
 */
function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // If already absolute URL, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // If relative URL, prefix with STRAPI_URL
  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
  return `${strapiUrl}${url.startsWith("/") ? "" : "/"}${url}`
}

/**
 * Extract moto services content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted moto services content or null if not found/disabled
 */
export function extractMotoServicesContent(
  homeContent: any
): MotoServicesContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractMotoServices] No blocks found in homeContent")
    return null
  }

  // Find the moto-services block that is enabled
  const servicesBlock = homeContent.data.blocks.find(
    (block: any): block is MotoServicesBlock =>
      block.__component === "sections.moto-services" && block.enabled === true
  )

  if (!servicesBlock) {
    console.log("[extractMotoServices] No enabled moto-services block found")
    return null
  }

  console.log("[extractMotoServices] Found services block:", {
    section_title: servicesBlock.section_title,
    servicesCount: servicesBlock.services?.length || 0,
  })

  // Filter and transform service items (only enabled ones)
  const services =
    servicesBlock.services
      ?.filter((service) => service.enabled !== false)
      .map((service) => ({
        id: service.id,
        title: service.services_name,
        description: service.services_description,
        image: service.services_image
          ? resolveImageUrl(service.services_image.url)
          : null,
      })) || []

  // Transform to frontend format
  const result: MotoServicesContent = {
    sectionTitle: servicesBlock.section_title,
    sectionDescription: servicesBlock.section_description,
    services,
  }

  console.log(
    "[extractMotoServices] Returning result with",
    services.length,
    "enabled services"
  )
  return result
}

/**
 * Get moto services content with fallback
 *
 * Fetches moto services content from Strapi and returns formatted data.
 * Returns null if CMS is unavailable or content is disabled.
 *
 * @param homeContent - Home content already fetched (to avoid duplicate requests)
 * @returns Moto services content or null for fallback
 */
export function getMotoServicesContent(
  homeContent: any
): MotoServicesContent | null {
  try {
    return extractMotoServicesContent(homeContent)
  } catch (error) {
    console.error("[Strapi] Error getting moto services content:", error)
    return null
  }
}
