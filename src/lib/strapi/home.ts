/**
 * Strapi Home Page Content Fetcher
 *
 * Fetches dynamic content for the home page from Strapi CMS,
 * including hero section data.
 */

import { fetchStrapi } from "../strapi"

// Type definitions for Strapi Home content
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
}

export interface HomeContent {
  data: {
    id: number
    attributes: {
      blocks: Array<HeroBlock | any>
      createdAt: string
      updatedAt: string
      publishedAt: string
    }
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
}

/**
 * Fetch home page content from Strapi
 *
 * @returns Home content with hero block or null if unavailable
 */
export async function fetchHomeContent(): Promise<HomeContent | null> {
  return fetchStrapi<HomeContent>("/api/home", {
    params: {
      "populate[blocks]": "*",
    },
    next: {
      revalidate: 60, // ISR: revalidate every 60 seconds
    },
  })
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
  if (!homeContent?.data?.attributes?.blocks) {
    return null
  }

  // Find the hero block that is enabled
  const heroBlock = homeContent.data.attributes.blocks.find(
    (block): block is HeroBlock =>
      block.__component === "sections.hero" && block.enabled === true
  )

  if (!heroBlock) {
    return null
  }

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
