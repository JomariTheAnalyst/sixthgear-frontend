/**
 * Strapi Home Page Content with Field-Level Fallbacks
 *
 * Implements Option A: Partial override behavior where CMS values are used when present,
 * otherwise hardcoded fallbacks are used. This allows editors to override only specific fields.
 */

import { fetchHomeContent, HeroContent, HomeContent } from "./home"
import { AboutContent } from "./about"
import { CoffeeShowcaseContent } from "./coffee"
import { MotoServicesContent } from "./services"
import {
  pickText,
  pickMediaUrl,
  pickArray,
  pickBool,
  makeAbsoluteUrl,
} from "../cms/fallback"

// ============================================================================
// HARDCODED FALLBACKS (Default Values)
// ============================================================================

const HERO_FALLBACKS = {
  trustBadge: "Trusted by 500+ Riders",
  title: "Best Bike\nRepair & Service",
  description:
    "Professional servicing, repairs, detailing & performance upgrades. Trusted by riders for precision and care.",
  primaryCta: {
    text: "More About Us",
    link: "/about",
  },
  secondaryCta: {
    text: "View Services",
    link: "/services",
  },
  backgroundImage: "/images/homepage/banner-img.png",
  enabled: true,
}

const ABOUT_FALLBACKS = {
  kicker: "About Us",
  title: "Your Trusted Motorcycle Partner",
  description:
    "We provide professional motorcycle services with a passion for excellence. Our experienced team ensures your ride is always in top condition.",
  highlights: [
    "Expert Technicians",
    "Quality Parts",
    "Fast Service",
    "Competitive Pricing",
  ],
  primaryCta: {
    text: "Learn More",
    link: "/about",
  },
  imageTop: "/images/about/workshop.jpg",
  imageBottom: "/images/about/team.jpg",
  videoUrl: null,
}

const COFFEE_FALLBACKS = {
  mainHeadingLine1: "Fuel Your Ride",
  highlightedWord: "with",
  mainHeadingLine2: "Premium Coffee",
  descriptionText:
    "Take a break and enjoy our selection of premium coffee while we service your bike.",
  buttonText: "View Menu",
  buttonLink: "/coffee",
  coffeeItems: [
    {
      id: 1,
      name: "Espresso",
      description: "Rich and bold, perfect for a quick energy boost",
      image: "/images/coffee/espresso.jpg",
    },
    {
      id: 2,
      name: "Cappuccino",
      description: "Smooth and creamy, a classic favorite",
      image: "/images/coffee/cappuccino.jpg",
    },
    {
      id: 3,
      name: "Americano",
      description: "Strong and smooth, for the long ride ahead",
      image: "/images/coffee/americano.jpg",
    },
  ],
}

const SERVICES_FALLBACKS = {
  sectionTitle: "Our Services",
  sectionDescription:
    "Professional motorcycle services to keep you riding safely and smoothly",
  services: [
    {
      id: 1,
      title: "General Maintenance",
      description: "Regular servicing to keep your bike in top condition",
      image: "/images/services/maintenance.jpg",
    },
    {
      id: 2,
      title: "Repairs & Diagnostics",
      description: "Expert repairs and problem diagnosis",
      image: "/images/services/repairs.jpg",
    },
    {
      id: 3,
      title: "Performance Upgrades",
      description: "Enhance your bike's performance and style",
      image: "/images/services/upgrades.jpg",
    },
    {
      id: 4,
      title: "Detailing & Cleaning",
      description: "Professional cleaning and detailing services",
      image: "/images/services/detailing.jpg",
    },
  ],
}

// ============================================================================
// HERO SECTION WITH FALLBACKS
// ============================================================================

export async function getHeroWithFallbacks(): Promise<HeroContent> {
  try {
    const homeContent = await fetchHomeContent()

    if (!homeContent?.data?.blocks) {
      console.log("[Hero] No CMS data, using all fallbacks")
      return HERO_FALLBACKS
    }

    // Find hero block
    const heroBlock = homeContent.data.blocks.find(
      (block: any) => block.__component === "sections.hero"
    )

    if (!heroBlock) {
      console.log("[Hero] No hero block found, using all fallbacks")
      return HERO_FALLBACKS
    }

    // Check if section is enabled (respect false, fallback only if undefined/null)
    const enabled = pickBool(heroBlock.enabled, HERO_FALLBACKS.enabled)
    if (!enabled) {
      console.log("[Hero] Section disabled in CMS, using fallbacks")
      return HERO_FALLBACKS
    }

    // Apply field-level fallbacks
    const result: HeroContent = {
      trustBadge: pickText(heroBlock.trust_badge, HERO_FALLBACKS.trustBadge),
      title: pickText(heroBlock.title, HERO_FALLBACKS.title),
      description: pickText(heroBlock.description, HERO_FALLBACKS.description),
      primaryCta: {
        text: pickText(
          heroBlock.primary_cta_text,
          HERO_FALLBACKS.primaryCta.text
        ),
        link: pickText(
          heroBlock.primary_cta_link,
          HERO_FALLBACKS.primaryCta.link
        ),
      },
      secondaryCta: {
        text: pickText(
          heroBlock.secondary_cta_text,
          HERO_FALLBACKS.secondaryCta.text
        ),
        link: pickText(
          heroBlock.secondary_cta_link,
          HERO_FALLBACKS.secondaryCta.link
        ),
      },
      backgroundImage: pickMediaUrl(
        heroBlock.hero_bg,
        HERO_FALLBACKS.backgroundImage
      ),
    }

    console.log("[Hero] Applied fallbacks:", {
      usedCmsTitle: heroBlock.title ? true : false,
      usedCmsImage: heroBlock.hero_bg ? true : false,
    })

    return result
  } catch (error) {
    console.error("[Hero] Error fetching content, using fallbacks:", error)
    return HERO_FALLBACKS
  }
}

// ============================================================================
// ABOUT SECTION WITH FALLBACKS
// ============================================================================

export async function getAboutWithFallbacks(
  homeContent?: HomeContent | null
): Promise<AboutContent> {
  try {
    const content = homeContent || (await fetchHomeContent())

    if (!content?.data?.blocks) {
      console.log("[About] No CMS data, using all fallbacks")
      return ABOUT_FALLBACKS
    }

    // Find about block
    const aboutBlock = content.data.blocks.find(
      (block: any) => block.__component === "sections.about-overview"
    )

    if (!aboutBlock) {
      console.log("[About] No about block found, using all fallbacks")
      return ABOUT_FALLBACKS
    }

    // Check if section is enabled
    const enabled = pickBool(aboutBlock.enabled, true)
    if (!enabled) {
      console.log("[About] Section disabled in CMS, using fallbacks")
      return ABOUT_FALLBACKS
    }

    // Apply field-level fallbacks
    const cmsHighlights =
      aboutBlock.highlights?.map((h: any) => h.text).filter(Boolean) || []

    const result: AboutContent = {
      kicker: pickText(aboutBlock.kicker, ABOUT_FALLBACKS.kicker),
      title: pickText(
        aboutBlock.Title || aboutBlock.title,
        ABOUT_FALLBACKS.title
      ),
      description: pickText(
        aboutBlock.description,
        ABOUT_FALLBACKS.description
      ),
      highlights: pickArray(cmsHighlights, ABOUT_FALLBACKS.highlights),
      primaryCta: {
        text: pickText(
          aboutBlock.primary_cta_text,
          ABOUT_FALLBACKS.primaryCta.text
        ),
        link: pickText(
          aboutBlock.primary_cta_link,
          ABOUT_FALLBACKS.primaryCta.link
        ),
      },
      imageTop: pickMediaUrl(aboutBlock.image_top, ABOUT_FALLBACKS.imageTop),
      imageBottom: pickMediaUrl(
        aboutBlock.image_bottom,
        ABOUT_FALLBACKS.imageBottom
      ),
      videoUrl: aboutBlock.video_url || ABOUT_FALLBACKS.videoUrl,
    }

    console.log("[About] Applied fallbacks:", {
      usedCmsTitle: aboutBlock.Title || aboutBlock.title ? true : false,
      highlightsCount: result.highlights.length,
    })

    return result
  } catch (error) {
    console.error("[About] Error fetching content, using fallbacks:", error)
    return ABOUT_FALLBACKS
  }
}

// ============================================================================
// COFFEE SHOWCASE WITH FALLBACKS
// ============================================================================

export async function getCoffeeWithFallbacks(
  homeContent?: HomeContent | null
): Promise<CoffeeShowcaseContent> {
  try {
    const content = homeContent || (await fetchHomeContent())

    if (!content?.data?.blocks) {
      console.log("[Coffee] No CMS data, using all fallbacks")
      return COFFEE_FALLBACKS
    }

    // Find coffee block
    const coffeeBlock = content.data.blocks.find(
      (block: any) => block.__component === "sections.coffee-showcase"
    )

    if (!coffeeBlock) {
      console.log("[Coffee] No coffee block found, using all fallbacks")
      return COFFEE_FALLBACKS
    }

    // Check if section is enabled
    const enabled = pickBool(coffeeBlock.enabled, true)
    if (!enabled) {
      console.log("[Coffee] Section disabled in CMS, using fallbacks")
      return COFFEE_FALLBACKS
    }

    // Transform CMS coffee items with per-item fallbacks
    const cmsCoffeeItems =
      coffeeBlock.coffees
        ?.map((item: any, index: number) => {
          const fallbackItem = COFFEE_FALLBACKS.coffeeItems[index] || {
            id: item.id,
            name: "Coffee",
            description: "Delicious coffee",
            image: null,
          }

          return {
            id: item.id,
            name: pickText(item.coffee_name, fallbackItem.name),
            description: pickText(
              item.coffee_description,
              fallbackItem.description
            ),
            image: pickMediaUrl(item.coffee_image, fallbackItem.image),
          }
        })
        .filter(Boolean) || []

    // Apply field-level fallbacks
    const result: CoffeeShowcaseContent = {
      mainHeadingLine1: pickText(
        coffeeBlock.heading_line_1,
        COFFEE_FALLBACKS.mainHeadingLine1
      ),
      highlightedWord: pickText(
        coffeeBlock.heading_highlight,
        COFFEE_FALLBACKS.highlightedWord
      ),
      mainHeadingLine2: pickText(
        coffeeBlock.heading_line_2,
        COFFEE_FALLBACKS.mainHeadingLine2
      ),
      descriptionText: pickText(
        coffeeBlock.footer_text,
        COFFEE_FALLBACKS.descriptionText
      ),
      buttonText: pickText(coffeeBlock.cta_text, COFFEE_FALLBACKS.buttonText),
      buttonLink: pickText(coffeeBlock.cta_link, COFFEE_FALLBACKS.buttonLink),
      coffeeItems: pickArray(cmsCoffeeItems, COFFEE_FALLBACKS.coffeeItems),
    }

    console.log("[Coffee] Applied fallbacks:", {
      usedCmsHeading: coffeeBlock.heading_line_1 ? true : false,
      itemsCount: result.coffeeItems.length,
    })

    return result
  } catch (error) {
    console.error("[Coffee] Error fetching content, using fallbacks:", error)
    return COFFEE_FALLBACKS
  }
}

// ============================================================================
// MOTO SERVICES WITH FALLBACKS
// ============================================================================

export async function getServicesWithFallbacks(
  homeContent?: HomeContent | null
): Promise<MotoServicesContent> {
  try {
    const content = homeContent || (await fetchHomeContent())

    if (!content?.data?.blocks) {
      console.log("[Services] No CMS data, using all fallbacks")
      return SERVICES_FALLBACKS
    }

    // Find services block
    const servicesBlock = content.data.blocks.find(
      (block: any) => block.__component === "sections.moto-services"
    )

    if (!servicesBlock) {
      console.log("[Services] No services block found, using all fallbacks")
      return SERVICES_FALLBACKS
    }

    // Check if section is enabled
    const enabled = pickBool(servicesBlock.enabled, true)
    if (!enabled) {
      console.log("[Services] Section disabled in CMS, using fallbacks")
      return SERVICES_FALLBACKS
    }

    // Transform CMS service items with per-item fallbacks
    const cmsServices =
      servicesBlock.services
        ?.filter((service: any) => service.enabled !== false)
        .map((service: any, index: number) => {
          const fallbackService = SERVICES_FALLBACKS.services[index] || {
            id: service.id,
            title: "Service",
            description: "Professional service",
            image: null,
          }

          return {
            id: service.id,
            title: pickText(service.services_name, fallbackService.title),
            description: pickText(
              service.services_description,
              fallbackService.description
            ),
            image: pickMediaUrl(service.services_image, fallbackService.image),
          }
        })
        .filter(Boolean) || []

    // Apply field-level fallbacks
    const result: MotoServicesContent = {
      sectionTitle: pickText(
        servicesBlock.section_title,
        SERVICES_FALLBACKS.sectionTitle
      ),
      sectionDescription: pickText(
        servicesBlock.section_description,
        SERVICES_FALLBACKS.sectionDescription
      ),
      services: pickArray(cmsServices, SERVICES_FALLBACKS.services),
    }

    console.log("[Services] Applied fallbacks:", {
      usedCmsTitle: servicesBlock.section_title ? true : false,
      servicesCount: result.services.length,
    })

    return result
  } catch (error) {
    console.error("[Services] Error fetching content, using fallbacks:", error)
    return SERVICES_FALLBACKS
  }
}
