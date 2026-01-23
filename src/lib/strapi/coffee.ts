/**
 * Strapi Coffee Showcase Content Fetcher
 *
 * Fetches coffee showcase section content from Strapi CMS for the homepage.
 */

import { StrapiImage } from "./home"

// Type definitions for Coffee Showcase block (Strapi v5 structure)
export interface CoffeeItem {
  id: number
  coffee_name: string
  coffee_description: string
  coffee_image?: StrapiImage | null
}

export interface CoffeeShowcaseBlock {
  __component: "sections.coffee-showcase"
  id: number
  heading_line_1: string
  heading_highlight: string
  heading_line_2: string
  footer_text: string
  cta_text: string
  cta_link: string
  coffees: CoffeeItem[]
  enabled: boolean
}

export interface CoffeeShowcaseContent {
  mainHeadingLine1: string
  highlightedWord: string
  mainHeadingLine2: string
  descriptionText: string
  buttonText: string
  buttonLink: string
  coffeeItems: Array<{
    id: number
    name: string
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
 * Extract coffee showcase content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted coffee showcase content or null if not found/disabled
 */
export function extractCoffeeShowcaseContent(
  homeContent: any
): CoffeeShowcaseContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractCoffeeShowcase] No blocks found in homeContent")
    return null
  }

  // Find the coffee-showcase block that is enabled
  const coffeeBlock = homeContent.data.blocks.find(
    (block: any): block is CoffeeShowcaseBlock =>
      block.__component === "sections.coffee-showcase" && block.enabled === true
  )

  if (!coffeeBlock) {
    console.log(
      "[extractCoffeeShowcase] No enabled coffee-showcase block found"
    )
    return null
  }

  console.log("[extractCoffeeShowcase] Found coffee block:", {
    heading_line_1: coffeeBlock.heading_line_1,
    heading_highlight: coffeeBlock.heading_highlight,
    itemsCount: coffeeBlock.coffees?.length || 0,
  })

  // Transform coffee items
  const coffeeItems =
    coffeeBlock.coffees?.map((item) => ({
      id: item.id,
      name: item.coffee_name,
      description: item.coffee_description,
      image: item.coffee_image ? resolveImageUrl(item.coffee_image?.url) : null,
    })) || []

  // Transform to frontend format
  const result: CoffeeShowcaseContent = {
    mainHeadingLine1: coffeeBlock.heading_line_1,
    highlightedWord: coffeeBlock.heading_highlight,
    mainHeadingLine2: coffeeBlock.heading_line_2,
    descriptionText: coffeeBlock.footer_text,
    buttonText: coffeeBlock.cta_text,
    buttonLink: coffeeBlock.cta_link,
    coffeeItems,
  }

  console.log(
    "[extractCoffeeShowcase] Returning result with",
    coffeeItems.length,
    "items"
  )
  return result
}

/**
 * Get coffee showcase content with fallback
 *
 * Fetches coffee showcase content from Strapi and returns formatted data.
 * Returns null if CMS is unavailable or content is disabled.
 *
 * @param homeContent - Home content already fetched (to avoid duplicate requests)
 * @returns Coffee showcase content or null for fallback
 */
export function getCoffeeShowcaseContent(
  homeContent: any
): CoffeeShowcaseContent | null {
  try {
    return extractCoffeeShowcaseContent(homeContent)
  } catch (error) {
    console.error("[Strapi] Error getting coffee showcase content:", error)
    return null
  }
}
