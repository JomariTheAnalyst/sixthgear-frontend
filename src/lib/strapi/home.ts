/**
 * Strapi Home Page Content Fetcher
 *
 * Fetches dynamic content for the home page from Strapi CMS,
 * including hero section data.
 */

import { fetchStrapi } from "../strapi"

// Type definitions for Strapi Home content (Strapi v5 structure)
export interface StrapiImageFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string | null
  size: number
  width: number
  height: number
  sizeInBytes: number
}

export interface StrapiImage {
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: {
    large?: StrapiImageFormat
    medium?: StrapiImageFormat
    small?: StrapiImageFormat
    thumbnail?: StrapiImageFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: any
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface HeroBlock {
  __component: "sections.hero"
  id: number
  trust_badge: string
  title: string
  description: string
  primary_cta_text: string
  primary_cta_link: string
  secondary_cta_text: string
  secondary_cta_link: string
  enabled: boolean
  hero_bg: StrapiImage | null
}

export interface HomeContent {
  data: {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    blocks: Array<HeroBlock | any>
  }
}

export interface HeroContent {
  trustBadge: string
  title: string
  description: string
  primaryCta: {
    text: string
    link: string
  }
  secondaryCta: {
    text: string
    link: string
  }
  backgroundImage: string | null
}

/**
 * Fetch home page content from Strapi
 *
 * @returns Home content with hero block or null if unavailable
 */
export async function fetchHomeContent(): Promise<HomeContent | null> {
  return fetchStrapi<HomeContent>("/api/home", {
    params: {
      "populate[blocks][populate]": "*",
    },
    // Note: caching is handled by fetchStrapi based on draft mode
  })
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
 * Extract hero content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted hero content or null if not found/disabled
 */
export function extractHeroContent(
  homeContent: HomeContent | null
): HeroContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[Strapi] No blocks found in home content")
    return null
  }

  console.log("[Strapi] Extracting hero from blocks:", {
    totalBlocks: homeContent.data.blocks.length,
    blockTypes: homeContent.data.blocks.map((b) => b.__component),
  })

  // Find the hero block that is enabled
  const heroBlock = homeContent.data.blocks.find(
    (block): block is HeroBlock =>
      block.__component === "sections.hero" && block.enabled === true
  )

  if (!heroBlock) {
    console.log("[Strapi] No enabled hero block found")
    return null
  }

  console.log("[Strapi] Found hero block:", {
    id: heroBlock.id,
    title: heroBlock.title,
    enabled: heroBlock.enabled,
    hasBackground: !!heroBlock.hero_bg,
  })

  // Extract background image URL (Strapi v5 structure - direct object, not nested in data)
  const backgroundImageUrl = heroBlock.hero_bg?.url || null
  const resolvedBackgroundImage = resolveImageUrl(backgroundImageUrl)

  // Transform to frontend format
  return {
    trustBadge: heroBlock.trust_badge,
    title: heroBlock.title,
    description: heroBlock.description,
    primaryCta: {
      text: heroBlock.primary_cta_text,
      link: heroBlock.primary_cta_link,
    },
    secondaryCta: {
      text: heroBlock.secondary_cta_text,
      link: heroBlock.secondary_cta_link,
    },
    backgroundImage: resolvedBackgroundImage,
  }
}

/**
 * Get hero content with fallback
 *
 * Fetches hero content from Strapi and returns formatted data.
 * Returns null if CMS is unavailable or content is disabled.
 *
 * @returns Hero content or null for fallback
 */
export async function getHeroContent(): Promise<HeroContent | null> {
  try {
    const homeContent = await fetchHomeContent()
    return extractHeroContent(homeContent)
  } catch (error) {
    console.error("[Strapi] Error getting hero content:", error)
    return null
  }
}
