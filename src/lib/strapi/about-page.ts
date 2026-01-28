/**
 * Strapi About Page Content Fetcher
 *
 * Fetches dynamic content for the About Us page from Strapi CMS.
 * Follows the same pattern as home.ts
 */

import { fetchStrapi } from "../strapi"
import { StrapiImage } from "./home"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FirstSectionBlock {
  __component: "about-sections.first-section"
  id: number
  badgeText: string
  title: string
  subtitle: string
  background_image: StrapiImage | null
  overlayStrength: number
  is_active: boolean
}

export interface SecondSectionBlock {
  __component: "about-sections.second-section"
  id: number
  image: StrapiImage | null
  badgeText: string
  badgePosition: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  heading: string
  highlightedText: string
  bodyText: any[] // Rich text blocks
  is_active: boolean
}

export interface OfferingCard {
  id: number
  title: string
  description: string
  background_image: StrapiImage | null
  link_url: string
  is_active: boolean
}

export interface WhatWeOfferBlock {
  __component: "about-sections.what-we-offer-section"
  id: number
  section_name: string
  heading: string
  offering_card: OfferingCard[]
  is_active: boolean
}

export interface CeoQuoteBlock {
  __component: "about-sections.ceo-quote-sections"
  id: number
  quoteText: string
  highlightedPhrase: string
  ceoName: string
  ceoTitle: string
  ceoPhoto: StrapiImage | null
  is_active: boolean
}

export interface AboutPageContent {
  data: {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    blocks: Array<
      FirstSectionBlock | SecondSectionBlock | WhatWeOfferBlock | CeoQuoteBlock
    >
  }
}

// ============================================================================
// CONTENT INTERFACES (Frontend Format)
// ============================================================================

export interface HeroSectionContent {
  badgeText: string
  title: string
  subtitle: string
  backgroundImage: string | null
  overlayStrength: number
}

export interface IntroSectionContent {
  image: string | null
  badgeText: string
  badgePosition: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  heading: string
  highlightedText: string
  bodyText: any[] // Rich text blocks
}

export interface OfferingCardContent {
  id: number
  title: string
  description: string
  backgroundImage: string | null
  linkUrl: string
}

export interface WhatWeOfferContent {
  sectionName: string
  heading: string
  cards: OfferingCardContent[]
}

export interface CeoQuoteContent {
  quoteText: string
  highlightedPhrase: string
  ceoName: string
  ceoTitle: string
  ceoPhoto: string | null
}

// ============================================================================
// FETCH FUNCTION
// ============================================================================

/**
 * Fetch About page content from Strapi
 *
 * Draft mode is automatically handled by the fetchStrapi client.
 * No need to pass status parameter - it's determined by draftMode().
 *
 * @returns About page content or null if unavailable
 */
export async function fetchAboutPageContent(): Promise<AboutPageContent | null> {
  console.log(`[About] ========================================`)
  console.log(`[About] Fetching content from Strapi`)
  console.log(
    `[About] Strapi URL: ${process.env.STRAPI_URL || "http://localhost:1337"}`
  )
  console.log(`[About] Has Token: ${!!process.env.STRAPI_TOKEN}`)

  // Try both possible API endpoints (about-us is the actual Strapi UID)
  const endpoints = ["/api/about-us", "/api/about"]

  for (const endpoint of endpoints) {
    console.log(`[About] Trying endpoint: ${endpoint}`)
    try {
      const result = await fetchStrapi<AboutPageContent>(endpoint, {
        params: {
          populate: {
            blocks: {
              on: {
                "about-sections.first-section": {
                  populate: ["background_image"],
                },
                "about-sections.second-section": {
                  populate: ["image"],
                },
                "about-sections.what-we-offer-section": {
                  populate: {
                    offering_card: {
                      populate: ["background_image"],
                    },
                  },
                },
                "about-sections.ceo-quote-sections": {
                  populate: ["ceoPhoto"],
                },
              },
            },
          },
        },
      })

      if (result) {
        console.log(`[About] ✅ Successfully fetched from ${endpoint}`)
        console.log(`[About] Data structure:`, {
          hasData: !!result.data,
          hasBlocks: !!result.data?.blocks,
          blocksCount: result.data?.blocks?.length || 0,
          blockTypes: result.data?.blocks?.map((s: any) => s.__component) || [],
        })

        // Log each block's is_active status
        if (result.data?.blocks) {
          result.data.blocks.forEach((block: any, index: number) => {
            console.log(`[About] Block ${index}:`, {
              component: block.__component,
              is_active: block.is_active,
              hasTitle: !!block.title,
              hasHeading: !!block.heading,
              hasImage: !!(
                block.background_image ||
                block.image ||
                block.ceoPhoto
              ),
              offeringCardsCount: block.offering_card?.length || 0,
            })
          })
        }

        return result
      } else {
        console.log(`[About] ❌ No data returned from ${endpoint}`)
      }
    } catch (error) {
      console.error(`[About] ❌ Error fetching from ${endpoint}:`, error)
    }
  }

  console.log("[About] ❌ All endpoints failed - using fallbacks")
  console.log(`[About] ========================================`)
  return null
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Resolve Strapi image URL to absolute URL
 */
function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
  return `${strapiUrl}${url.startsWith("/") ? "" : "/"}${url}`
}

/**
 * Clamp overlay strength to safe range (0-100)
 */
function clampOverlayStrength(value: number | null | undefined): number {
  if (typeof value !== "number" || isNaN(value)) return 50
  return Math.max(0, Math.min(100, value))
}

// ============================================================================
// EXTRACTION FUNCTIONS
// ============================================================================

/**
 * Extract Hero (First Section) content
 */
export function extractHeroSection(
  aboutContent: AboutPageContent | null
): HeroSectionContent | null {
  if (!aboutContent?.data?.blocks) {
    console.log("[About Hero] No blocks found")
    return null
  }

  const heroBlock = aboutContent.data.blocks.find(
    (section): section is FirstSectionBlock =>
      section.__component === "about-sections.first-section" &&
      section.is_active === true
  )

  if (!heroBlock) {
    console.log("[About Hero] No active hero section found")
    return null
  }

  const backgroundImageUrl = heroBlock.background_image?.url || null
  const resolvedBackgroundImage = resolveImageUrl(backgroundImageUrl)

  return {
    badgeText: heroBlock.badgeText,
    title: heroBlock.title,
    subtitle: heroBlock.subtitle,
    backgroundImage: resolvedBackgroundImage,
    overlayStrength: clampOverlayStrength(heroBlock.overlayStrength),
  }
}

/**
 * Extract Intro (Second Section) content
 */
export function extractIntroSection(
  aboutContent: AboutPageContent | null
): IntroSectionContent | null {
  if (!aboutContent?.data?.blocks) {
    console.log("[About Intro] No blocks found")
    return null
  }

  const introBlock = aboutContent.data.blocks.find(
    (section): section is SecondSectionBlock =>
      section.__component === "about-sections.second-section" &&
      section.is_active === true
  )

  if (!introBlock) {
    console.log("[About Intro] No active intro section found")
    return null
  }

  const imageUrl = introBlock.image?.url || null
  const resolvedImage = resolveImageUrl(imageUrl)

  return {
    image: resolvedImage,
    badgeText: introBlock.badgeText,
    badgePosition: introBlock.badgePosition,
    heading: introBlock.heading,
    highlightedText: introBlock.highlightedText,
    bodyText: introBlock.bodyText || [],
  }
}

/**
 * Extract What We Offer section content
 */
export function extractWhatWeOfferSection(
  aboutContent: AboutPageContent | null
): WhatWeOfferContent | null {
  if (!aboutContent?.data?.blocks) {
    console.log("[About What We Offer] No blocks found")
    return null
  }

  const offerBlock = aboutContent.data.blocks.find(
    (section): section is WhatWeOfferBlock =>
      section.__component === "about-sections.what-we-offer-section" &&
      section.is_active === true
  )

  if (!offerBlock) {
    console.log("[About What We Offer] No active section found")
    return null
  }

  // Filter and map active cards
  const cards: OfferingCardContent[] = (offerBlock.offering_card || [])
    .filter((card) => card.is_active !== false)
    .map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      backgroundImage: resolveImageUrl(card.background_image?.url),
      linkUrl: card.link_url || "",
    }))

  return {
    sectionName: offerBlock.section_name,
    heading: offerBlock.heading,
    cards,
  }
}

/**
 * Extract CEO Quote section content
 */
export function extractCeoQuoteSection(
  aboutContent: AboutPageContent | null
): CeoQuoteContent | null {
  if (!aboutContent?.data?.blocks) {
    console.log("[About CEO Quote] No blocks found")
    return null
  }

  const quoteBlock = aboutContent.data.blocks.find(
    (section): section is CeoQuoteBlock =>
      section.__component === "about-sections.ceo-quote-sections" &&
      section.is_active === true
  )

  if (!quoteBlock) {
    console.log("[About CEO Quote] No active section found")
    return null
  }

  const ceoPhotoUrl = quoteBlock.ceoPhoto?.url || null
  const resolvedCeoPhoto = resolveImageUrl(ceoPhotoUrl)

  return {
    quoteText: quoteBlock.quoteText,
    highlightedPhrase: quoteBlock.highlightedPhrase,
    ceoName: quoteBlock.ceoName,
    ceoTitle: quoteBlock.ceoTitle,
    ceoPhoto: resolvedCeoPhoto,
  }
}

// ============================================================================
// MAIN GETTER FUNCTIONS
// ============================================================================

/**
 * Get Hero section content with error handling
 */
export async function getHeroSection(): Promise<HeroSectionContent | null> {
  try {
    const aboutContent = await fetchAboutPageContent()
    return extractHeroSection(aboutContent)
  } catch (error) {
    console.error("[About Hero] Error getting content:", error)
    return null
  }
}

/**
 * Get Intro section content with error handling
 */
export async function getIntroSection(): Promise<IntroSectionContent | null> {
  try {
    const aboutContent = await fetchAboutPageContent()
    return extractIntroSection(aboutContent)
  } catch (error) {
    console.error("[About Intro] Error getting content:", error)
    return null
  }
}

/**
 * Get What We Offer section content with error handling
 */
export async function getWhatWeOfferSection(): Promise<WhatWeOfferContent | null> {
  try {
    const aboutContent = await fetchAboutPageContent()
    return extractWhatWeOfferSection(aboutContent)
  } catch (error) {
    console.error("[About What We Offer] Error getting content:", error)
    return null
  }
}

/**
 * Get CEO Quote section content with error handling
 */
export async function getCeoQuoteSection(): Promise<CeoQuoteContent | null> {
  try {
    const aboutContent = await fetchAboutPageContent()
    return extractCeoQuoteSection(aboutContent)
  } catch (error) {
    console.error("[About CEO Quote] Error getting content:", error)
    return null
  }
}
