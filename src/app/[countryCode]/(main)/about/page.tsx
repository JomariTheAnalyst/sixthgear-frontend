import { Metadata } from "next"
import { draftMode } from "next/headers"
import AboutTemplate from "@modules/about/templates"
import { fetchAboutPageContent } from "@lib/strapi/about-page"
import {
  getHeroWithFallbacks,
  getIntroWithFallbacks,
  getWhatWeOfferWithFallbacks,
  getCeoQuoteWithFallbacks,
} from "@lib/strapi/about-page-with-fallbacks"

// Dynamic revalidation - DISABLED for debugging
// Set to 0 to always fetch fresh data
export const revalidate = 0
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Sixth Gear Moto Supply Café + Lounge - Built by riders, for riders. Premium motorcycle service hub with professional workshop expertise and a relaxed café experience.",
}

export default async function AboutPage() {
  // Check if draft mode is enabled
  const draft = await draftMode()
  const isDraftMode = draft.isEnabled

  console.log("[AboutPage] ========================================")
  console.log("[AboutPage] Draft mode:", isDraftMode ? "ENABLED" : "DISABLED")
  console.log("[AboutPage] Timestamp:", new Date().toISOString())

  // Disable caching in draft mode
  if (isDraftMode) {
    console.log("[AboutPage] Disabling cache for draft mode")
  }

  // Fetch About page content from Strapi CMS with field-level fallbacks
  // Draft mode is automatically handled by fetchStrapi client
  const aboutContent = await fetchAboutPageContent()

  console.log("[AboutPage] Fetch result:", {
    hasContent: !!aboutContent,
    hasData: !!aboutContent?.data,
    hasBlocks: !!aboutContent?.data?.blocks,
    blocksCount: aboutContent?.data?.blocks?.length || 0,
  })

  const heroContent = await getHeroWithFallbacks(aboutContent)
  const introContent = await getIntroWithFallbacks(aboutContent)
  const whatWeOfferContent = await getWhatWeOfferWithFallbacks(aboutContent)
  const ceoQuoteContent = await getCeoQuoteWithFallbacks(aboutContent)

  // Debug logging
  console.log("[AboutPage] Hero content:", {
    title: heroContent.title,
    subtitle: heroContent.subtitle,
    hasImage: !!heroContent.backgroundImage,
  })
  console.log("[AboutPage] Intro content:", introContent ? "Present" : "null")
  console.log(
    "[AboutPage] What We Offer:",
    whatWeOfferContent ? `${whatWeOfferContent.cards.length} cards` : "null"
  )
  console.log("[AboutPage] CEO Quote:", ceoQuoteContent ? "Present" : "null")
  console.log("[AboutPage] ========================================")

  return (
    <AboutTemplate
      heroContent={heroContent}
      introContent={introContent}
      whatWeOfferContent={whatWeOfferContent}
      ceoQuoteContent={ceoQuoteContent}
    />
  )
}
