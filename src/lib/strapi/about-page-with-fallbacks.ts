/**
 * Strapi About Page Content with Field-Level Fallbacks
 *
 * Implements the same fallback pattern as home-with-fallbacks.ts
 */

import {
  fetchAboutPageContent,
  HeroSectionContent,
  IntroSectionContent,
  WhatWeOfferContent,
  CeoQuoteContent,
  AboutPageContent,
} from "./about-page"
import {
  pickText,
  pickMediaUrl,
  pickArray,
  pickBool,
  pickNumber,
} from "../cms/fallback"

// ============================================================================
// HARDCODED FALLBACKS (Default Values)
// ============================================================================

const HERO_FALLBACKS: HeroSectionContent = {
  badgeText: "Built by Riders, For Riders",
  title: "About Us",
  subtitle: "We Offer Complete Diagnostics and Care for Your Motorcycle",
  backgroundImage: "/images/sixthgearleftsideimg.jpg",
  overlayStrength: 60,
}

const INTRO_FALLBACKS: IntroSectionContent = {
  image: "/images/sixthgear-workshop.jpg",
  badgeText: "100%\nRider Focused",
  badgePosition: "bottom-right",
  heading: "More Than a Shop,\nA Rider's Space",
  highlightedText: "A Rider's Space",
  bodyText: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "Sixth Gear Moto Supply Café + Lounge",
          bold: true,
        },
        {
          type: "text",
          text: " is built by riders, for riders. We are a premium motorcycle service hub that combines professional workshop expertise with a relaxed café and lounge experience, powered by First Gear Coffee.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "From routine PMS to advanced diagnostics, repairs, and performance upgrades, our workshop is equipped to handle big bikes and premium motorcycles with precision, care, and attention to detail. We believe proper maintenance is not just about fixing issues, but about ensuring safety, reliability, and riding confidence.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "Beyond servicing, Sixth Gear offers a curated selection of quality motorcycle accessories, riding gear, helmets, and performance parts. We also provide professional bike wash, detailing, and cosmetic restoration to keep your motorcycle looking and performing at its best.",
        },
      ],
    },
  ],
}

const WHAT_WE_OFFER_FALLBACKS: WhatWeOfferContent = {
  sectionName: "What We Offer",
  heading: "Complete Care for\nYour Ride",
  cards: [
    {
      id: 1,
      title: "Motorcycle Service & Diagnostics",
      description:
        "PMS, repairs, detailing, and performance upgrades for big bikes and premium motorcycles.",
      backgroundImage:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      linkUrl: "/services",
    },
    {
      id: 2,
      title: "Parts, Accessories & Luggage",
      description:
        "Helmets, riding gear, bags, communications, parts, and accessories from trusted brands.",
      backgroundImage:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
      linkUrl: "/store",
    },
    {
      id: 3,
      title: "Rider Apparel & Gear",
      description:
        "Protective riding gear and lifestyle apparel designed for comfort, safety, and style.",
      backgroundImage:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
      linkUrl: "/store",
    },
    {
      id: 4,
      title: "Café & Rider Lounge",
      description:
        "Relax, connect, and refuel with First Gear Coffee in a space built for riders.",
      backgroundImage:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      linkUrl: "/menu",
    },
  ],
}

const CEO_QUOTE_FALLBACKS: CeoQuoteContent = {
  quoteText:
    "More than a shop, Sixth Gear is a rider's space. A place to wrench, ride, refuel, and connect. Whether you're here for service, upgrades, or simply good coffee and conversation, you're always welcome at Sixth Gear.",
  highlightedPhrase: "rider's space",
  ceoName: "Cap. Gregory Nick Sevilla",
  ceoTitle: "CEO & Founder, Sixthgear Motosupply",
  ceoPhoto: "/images/ceo/capgreg.jpg",
}

// ============================================================================
// HERO SECTION WITH FALLBACKS
// ============================================================================

export async function getHeroWithFallbacks(
  aboutContent?: AboutPageContent | null
): Promise<HeroSectionContent> {
  try {
    const content = aboutContent || (await fetchAboutPageContent())

    if (!content?.data?.blocks) {
      console.log("[About Hero] No CMS data, using all fallbacks")
      return HERO_FALLBACKS
    }

    const heroBlock = content.data.blocks.find(
      (section: any) => section.__component === "about-sections.first-section"
    )

    if (!heroBlock) {
      console.log("[About Hero] No hero block found, using all fallbacks")
      return HERO_FALLBACKS
    }

    const isActive = pickBool(heroBlock.is_active, true)
    if (!isActive) {
      console.log("[About Hero] Section disabled in CMS, using fallbacks")
      return HERO_FALLBACKS
    }

    // Clamp overlay strength to 0-100
    const overlayStrength = pickNumber(
      heroBlock.overlayStrength,
      HERO_FALLBACKS.overlayStrength
    )
    const clampedOverlay = Math.max(0, Math.min(100, overlayStrength))

    const result: HeroSectionContent = {
      badgeText: pickText(heroBlock.badgeText, HERO_FALLBACKS.badgeText),
      title: pickText(heroBlock.title, HERO_FALLBACKS.title),
      subtitle: pickText(heroBlock.subtitle, HERO_FALLBACKS.subtitle),
      backgroundImage: pickMediaUrl(
        heroBlock.background_image,
        HERO_FALLBACKS.backgroundImage
      ),
      overlayStrength: clampedOverlay,
    }

    console.log("[About Hero] Applied fallbacks:", {
      usedCmsTitle: heroBlock.title ? true : false,
      usedCmsImage: heroBlock.background_image ? true : false,
      overlayStrength: clampedOverlay,
    })

    return result
  } catch (error) {
    console.error(
      "[About Hero] Error fetching content, using fallbacks:",
      error
    )
    return HERO_FALLBACKS
  }
}

// ============================================================================
// INTRO SECTION WITH FALLBACKS
// ============================================================================

export async function getIntroWithFallbacks(
  aboutContent?: AboutPageContent | null
): Promise<IntroSectionContent | null> {
  try {
    const content = aboutContent || (await fetchAboutPageContent())

    if (!content?.data?.blocks) {
      console.log("[About Intro] No CMS data, using all fallbacks")
      return INTRO_FALLBACKS
    }

    const introBlock = content.data.blocks.find(
      (section: any) => section.__component === "about-sections.second-section"
    )

    if (!introBlock) {
      console.log("[About Intro] No intro block found, using all fallbacks")
      return INTRO_FALLBACKS
    }

    // If is_active=false, use fallback content (don't hide section)
    const isActive = pickBool(introBlock.is_active, true)
    if (!isActive) {
      console.log("[About Intro] Section disabled in CMS, using fallbacks")
      return INTRO_FALLBACKS
    }

    const result: IntroSectionContent = {
      image: pickMediaUrl(introBlock.image, INTRO_FALLBACKS.image),
      badgeText: pickText(introBlock.badgeText, INTRO_FALLBACKS.badgeText),
      badgePosition: introBlock.badgePosition || INTRO_FALLBACKS.badgePosition,
      heading: pickText(introBlock.heading, INTRO_FALLBACKS.heading),
      highlightedText: pickText(
        introBlock.highlightedText,
        INTRO_FALLBACKS.highlightedText
      ),
      bodyText: pickArray(introBlock.bodyText, INTRO_FALLBACKS.bodyText),
    }

    console.log("[About Intro] Applied fallbacks:", {
      usedCmsHeading: introBlock.heading ? true : false,
      usedCmsImage: introBlock.image ? true : false,
      badgePosition: result.badgePosition,
    })

    return result
  } catch (error) {
    console.error(
      "[About Intro] Error fetching content, using fallbacks:",
      error
    )
    return INTRO_FALLBACKS
  }
}

// ============================================================================
// WHAT WE OFFER SECTION WITH FALLBACKS
// ============================================================================

export async function getWhatWeOfferWithFallbacks(
  aboutContent?: AboutPageContent | null
): Promise<WhatWeOfferContent | null> {
  try {
    const content = aboutContent || (await fetchAboutPageContent())

    if (!content?.data?.blocks) {
      console.log("[About What We Offer] No CMS data, using all fallbacks")
      return WHAT_WE_OFFER_FALLBACKS
    }

    const offerBlock = content.data.blocks.find(
      (section: any) =>
        section.__component === "about-sections.what-we-offer-section"
    )

    if (!offerBlock) {
      console.log(
        "[About What We Offer] No offer block found, using all fallbacks"
      )
      return WHAT_WE_OFFER_FALLBACKS
    }

    const isActive = pickBool(offerBlock.is_active, true)
    if (!isActive) {
      console.log(
        "[About What We Offer] Section disabled in CMS, using fallbacks"
      )
      return WHAT_WE_OFFER_FALLBACKS
    }

    // Transform CMS cards with per-card fallbacks
    const cmsCards =
      offerBlock.offering_card
        ?.filter((card: any) => card.is_active !== false)
        .map((card: any, index: number) => {
          const fallbackCard = WHAT_WE_OFFER_FALLBACKS.cards[index] || {
            id: card.id,
            title: "Service",
            description: "Professional service",
            backgroundImage: null,
            linkUrl: "",
          }

          return {
            id: card.id,
            title: pickText(card.title, fallbackCard.title),
            description: pickText(card.description, fallbackCard.description),
            backgroundImage: pickMediaUrl(
              card.background_image,
              fallbackCard.backgroundImage
            ),
            linkUrl: pickText(card.link_url, fallbackCard.linkUrl),
          }
        })
        .filter(Boolean) || []

    const result: WhatWeOfferContent = {
      sectionName: pickText(
        offerBlock.section_name,
        WHAT_WE_OFFER_FALLBACKS.sectionName
      ),
      heading: pickText(offerBlock.heading, WHAT_WE_OFFER_FALLBACKS.heading),
      cards: pickArray(cmsCards, WHAT_WE_OFFER_FALLBACKS.cards),
    }

    console.log("[About What We Offer] Applied fallbacks:", {
      usedCmsHeading: offerBlock.heading ? true : false,
      cardsCount: result.cards.length,
    })

    return result
  } catch (error) {
    console.error(
      "[About What We Offer] Error fetching content, using fallbacks:",
      error
    )
    return WHAT_WE_OFFER_FALLBACKS
  }
}

// ============================================================================
// CEO QUOTE SECTION WITH FALLBACKS
// ============================================================================

export async function getCeoQuoteWithFallbacks(
  aboutContent?: AboutPageContent | null
): Promise<CeoQuoteContent | null> {
  try {
    const content = aboutContent || (await fetchAboutPageContent())

    if (!content?.data?.blocks) {
      console.log("[About CEO Quote] No CMS data, using all fallbacks")
      return CEO_QUOTE_FALLBACKS
    }

    const quoteBlock = content.data.blocks.find(
      (section: any) =>
        section.__component === "about-sections.ceo-quote-sections"
    )

    if (!quoteBlock) {
      console.log("[About CEO Quote] No quote block found, using all fallbacks")
      return CEO_QUOTE_FALLBACKS
    }

    const isActive = pickBool(quoteBlock.is_active, true)
    if (!isActive) {
      console.log("[About CEO Quote] Section disabled in CMS, using fallbacks")
      return CEO_QUOTE_FALLBACKS
    }

    const result: CeoQuoteContent = {
      quoteText: pickText(quoteBlock.quoteText, CEO_QUOTE_FALLBACKS.quoteText),
      highlightedPhrase: pickText(
        quoteBlock.highlightedPhrase,
        CEO_QUOTE_FALLBACKS.highlightedPhrase
      ),
      ceoName: pickText(quoteBlock.ceoName, CEO_QUOTE_FALLBACKS.ceoName),
      ceoTitle: pickText(quoteBlock.ceoTitle, CEO_QUOTE_FALLBACKS.ceoTitle),
      ceoPhoto: pickMediaUrl(quoteBlock.ceoPhoto, CEO_QUOTE_FALLBACKS.ceoPhoto),
    }

    console.log("[About CEO Quote] Applied fallbacks:", {
      usedCmsQuote: quoteBlock.quoteText ? true : false,
      usedCmsPhoto: quoteBlock.ceoPhoto ? true : false,
    })

    return result
  } catch (error) {
    console.error(
      "[About CEO Quote] Error fetching content, using fallbacks:",
      error
    )
    return CEO_QUOTE_FALLBACKS
  }
}
