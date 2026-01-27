/**
 * Strapi CTA Banner Content Fetcher
 *
 * Fetches CTA banner content from Strapi CMS for the homepage.
 */

import { StrapiImage } from "./home"
import { pickText, pickMediaUrl, pickBool } from "../cms/fallback"

// Type definitions for CTA Banner block (Strapi v5 structure)
export interface CTABannerBlock {
  __component: "sections.cta-banner-layout"
  id: number
  title: string
  title_desc: string
  background_image: StrapiImage | null
  opening_hours: string
  tiktok_link?: string
  facebook_link?: string
  instagram_link?: string
  enable: boolean
}

export interface CTABannerContent {
  title: string
  description: string
  backgroundImage: string
  openingHours: string
  socialLinks: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
  isEnabled: boolean
}

// Hardcoded fallback values
const CTA_BANNER_FALLBACKS: CTABannerContent = {
  title: "VISIT US\nTODAY",
  description:
    "Your one-stop destination for premium motorcycle gear, parts, and great coffee",
  backgroundImage: "/images/cta-placeholder.jpg",
  openingHours: "Open Monday - Friday | 9:00 AM - 8:00 PM",
  socialLinks: {
    facebook: "https://www.facebook.com/camille.sixthgear",
    instagram: "https://www.instagram.com/sixthgear_moto_supply/",
    tiktok: "https://www.tiktok.com/@sixthgear.moto.su",
  },
  isEnabled: true,
}

/**
 * Extract CTA banner content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted CTA banner content or null if not found/disabled
 */
export function extractCTABannerContent(
  homeContent: any
): CTABannerContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractCTABanner] No blocks found in homeContent")
    return null
  }

  // Find the CTA banner block
  const ctaBlock = homeContent.data.blocks.find(
    (block: any): block is CTABannerBlock =>
      block.__component === "sections.cta-banner-layout"
  )

  if (!ctaBlock) {
    console.log("[extractCTABanner] No CTA banner block found")
    return null
  }

  // Check if section is enabled
  const isEnabled = pickBool(ctaBlock.enable, true)
  if (!isEnabled) {
    console.log("[extractCTABanner] CTA banner disabled in CMS")
    return null
  }

  console.log("[extractCTABanner] Found CTA banner block:", {
    title: ctaBlock.title,
    hasBackgroundImage: !!ctaBlock.background_image,
  })

  // Get background image URL
  const backgroundImageUrl = ctaBlock.background_image
    ? pickMediaUrl(
        ctaBlock.background_image,
        CTA_BANNER_FALLBACKS.backgroundImage
      )
    : CTA_BANNER_FALLBACKS.backgroundImage

  // Transform to frontend format
  const result: CTABannerContent = {
    title: pickText(ctaBlock.title, CTA_BANNER_FALLBACKS.title),
    description: pickText(
      ctaBlock.title_desc,
      CTA_BANNER_FALLBACKS.description
    ),
    backgroundImage: backgroundImageUrl,
    openingHours: pickText(
      ctaBlock.opening_hours,
      CTA_BANNER_FALLBACKS.openingHours
    ),
    socialLinks: {
      facebook: ctaBlock.facebook_link || undefined,
      instagram: ctaBlock.instagram_link || undefined,
      tiktok: ctaBlock.tiktok_link || undefined,
    },
    isEnabled: true,
  }

  console.log("[extractCTABanner] Returning result:", {
    hasTitle: !!result.title,
    hasBackgroundImage: !!result.backgroundImage,
    socialLinksCount: Object.values(result.socialLinks).filter(Boolean).length,
  })

  return result
}

/**
 * Get CTA banner content with fallbacks
 *
 * @param homeContent - Home content already fetched
 * @returns CTA banner content with fallbacks applied
 */
export function getCTABannerWithFallbacks(homeContent: any): CTABannerContent {
  try {
    const cmsContent = extractCTABannerContent(homeContent)

    if (!cmsContent) {
      console.log("[CTABanner] No CMS data, using all fallbacks")
      return CTA_BANNER_FALLBACKS
    }

    console.log("[CTABanner] Using CMS content")
    return cmsContent
  } catch (error) {
    console.error("[CTABanner] Error fetching content, using fallbacks:", error)
    return CTA_BANNER_FALLBACKS
  }
}
