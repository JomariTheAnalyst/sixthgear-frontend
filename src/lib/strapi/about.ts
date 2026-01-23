/**
 * Strapi About Overview Content Fetcher
 *
 * Fetches about section content from Strapi CMS for the homepage.
 */

import { fetchStrapi } from "../strapi"
import { StrapiImage } from "./home"

// Type definitions for About Overview block (Strapi v5 structure)
export interface HighlightItem {
  id: number
  text: string
}

export interface AboutOverviewBlock {
  __component: "sections.about-overview"
  id: number
  kicker: string
  Title: string // Note: Capital T from Strapi
  title?: string // Fallback for lowercase
  description: string
  highlights: HighlightItem[]
  primary_cta_text: string
  primary_cta_link: string
  image_top: StrapiImage | null
  image_bottom: StrapiImage | null
  video_url: string | null
  enabled: boolean
}

export interface AboutContent {
  kicker: string
  title: string
  description: string
  highlights: string[]
  primaryCta: {
    text: string
    link: string
  }
  imageTop: string | null
  imageBottom: string | null
  videoUrl: string | null
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
 * Extract about overview content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted about content or null if not found/disabled
 */
export function extractAboutContent(homeContent: any): AboutContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractAboutContent] No blocks found in homeContent")
    return null
  }

  // Find the about-overview block that is enabled
  const aboutBlock = homeContent.data.blocks.find(
    (block: any): block is AboutOverviewBlock =>
      block.__component === "sections.about-overview" && block.enabled === true
  )

  if (!aboutBlock) {
    console.log("[extractAboutContent] No enabled about-overview block found")
    return null
  }

  console.log("[extractAboutContent] Found about block:", {
    kicker: aboutBlock.kicker,
    Title: aboutBlock.Title,
    title: aboutBlock.title,
    description: aboutBlock.description?.substring(0, 50),
  })

  // Extract image URLs (Strapi v5 structure - direct object, not nested in data)
  const imageTopUrl = aboutBlock.image_top?.url || null
  const imageBottomUrl = aboutBlock.image_bottom?.url || null

  // Transform to frontend format
  // Note: Strapi field is "Title" (capital T), not "title"
  const result = {
    kicker: aboutBlock.kicker,
    title: aboutBlock.Title || aboutBlock.title || "", // Handle both cases
    description: aboutBlock.description,
    highlights: aboutBlock.highlights?.map((h) => h.text) || [],
    primaryCta: {
      text: aboutBlock.primary_cta_text,
      link: aboutBlock.primary_cta_link,
    },
    imageTop: resolveImageUrl(imageTopUrl),
    imageBottom: resolveImageUrl(imageBottomUrl),
    videoUrl: aboutBlock.video_url,
  }

  console.log(
    "[extractAboutContent] Returning result with title:",
    result.title
  )
  return result
}

/**
 * Get about content with fallback
 *
 * Fetches about content from Strapi and returns formatted data.
 * Returns null if CMS is unavailable or content is disabled.
 *
 * @param homeContent - Home content already fetched (to avoid duplicate requests)
 * @returns About content or null for fallback
 */
export function getAboutContent(homeContent: any): AboutContent | null {
  try {
    return extractAboutContent(homeContent)
  } catch (error) {
    console.error("[Strapi] Error getting about content:", error)
    return null
  }
}
