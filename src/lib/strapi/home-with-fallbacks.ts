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
  title: "We Offer Complete Diagnostics for Your Motorcycle",
  description:
    "Sixth Gear Moto Supply Café + Lounge is a rider-built motorcycle hub combining professional workshop service, premium accessories, riding gear, detailing, performance upgrades, and a relaxed café experience powered by First Gear Coffee.",
  highlights: [
    "Motorcycle Service and Advanced Diagnostics",
    "Parts Accessories Luggage and Communications",
    "Helmets Riding Gear and Apparel",
    "Café Lounge and Rider Community",
  ],
  primaryCta: {
    text: "More About Us",
    link: "/about",
  },
  imageTop: "/images/homepage/about/about_bg.png",
  imageBottom: "/images/homepage/about/about-small.png",
  videoUrl: null,
}

const COFFEE_FALLBACKS = {
  mainHeadingLine1: "Sixthgear",
  highlightedWord: " fuels more than rides.",
  mainHeadingLine2: "We serve coffee too.",
  descriptionText:
    "More than a pit stop it's where riders refuel, relax, and reconnect. Handcrafted brews served with passion, right here at Sixthgear.",
  buttonText: "View Full Menu",
  buttonLink: "/menu",
  coffeeItems: [
    {
      id: 1,
      name: "Iced Hazelnut Latte",
      description:
        "Smooth espresso blended with creamy hazelnut and chilled milk.",
      image: "/images/firstgear-coffee/hazelnut.png",
    },
    {
      id: 2,
      name: "Cold Brew Delight",
      description: "Slow-steeped coffee with a bold aroma and silky finish.",
      image: "/images/firstgear-coffee/coldbrew.png",
    },
    {
      id: 3,
      name: "Mocha Fusion",
      description:
        "Rich chocolate, fresh espresso, and whipped cream perfection.",
      image: "/images/firstgear-coffee/mochafusion.png",
    },
  ],
}

const SERVICES_FALLBACKS = {
  sectionTitle: "Motorcycle Services",
  sectionDescription: "Bike Repair & Maintenance Services",
  services: [
    {
      id: 1,
      title: "Service & Preventive Maintenance",
      description:
        "Scheduled servicing, PMS, and inspections to keep your motorcycle reliable, safe, and ready for daily rides or long journeys.",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    },
    {
      id: 2,
      title: "Repairs & Diagnostics",
      description:
        "Accurate troubleshooting and professional repairs using proper tools, experience, and diagnostics for dependable motorcycle performance.",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    },
    {
      id: 3,
      title: "Accessories & Custom Installation",
      description:
        "Professional installation of accessories, electronics, protection, and touring upgrades, ensuring correct fitment, safety, and clean integration.",
      image:
        "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80",
    },
    {
      id: 4,
      title: "Wheels, Drivetrain & Handling",
      description:
        "Tyres, chains, sprockets, and handling components serviced and aligned for stability, control, and confident riding.",
      image:
        "https://images.unsplash.com/photo-1571293521801-fd3dbf02a4f2?w=800&q=80",
    },
    {
      id: 5,
      title: "Detailing, Care & Protection",
      description:
        "Thorough cleaning, detailing, and protective treatments to restore, preserve, and enhance your motorcycle's appearance and condition.",
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
    },
    {
      id: 6,
      title: "Performance & Upgrade Services",
      description:
        "Carefully selected performance upgrades and tuning support to improve power delivery, efficiency, and overall riding experience.",
      image:
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    },
    {
      id: 7,
      title: "Roadside Assistance & Recovery",
      description:
        "Emergency motorcycle towing, rescue, and recovery services to get you and your bike to safety when needed.",
      image:
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
    },
    {
      id: 8,
      title: "Rider Support & Convenience",
      description:
        "Consultation, inspections, and after-service support designed to help riders make informed decisions and ride with confidence.",
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
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
            link: service.card_link || null, // Map card_link from Strapi
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
