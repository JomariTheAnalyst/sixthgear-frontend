/**
 * Strapi Client Testimonials Content Fetcher
 *
 * Fetches client-testimonials section content from Strapi CMS for the homepage.
 */

import { pickText, pickBool } from "../cms/fallback"

// Type definitions for Client Testimonials block (Strapi v5 structure)
export interface TestimonialItem {
  id: number
  client_name: string
  client_title: string
  testimonials: string
  enable: boolean
}

export interface ClientTestimonialsBlock {
  __component: "sections.client-testimonials-section"
  id: number
  section_title: string
  section_desc: string
  client_testimonials: TestimonialItem[]
  enable: boolean
}

export interface ClientTestimonialsContent {
  sectionTitle: string
  sectionDescription: string
  testimonials: Array<{
    id: number
    name: string
    role: string
    quote: string
    avatar: string
  }>
}

// Hardcoded fallback values
const CLIENT_TESTIMONIALS_FALLBACKS = {
  sectionTitle: "What Clients Say",
  sectionDescription: "Trusted Motorcycle Service, Gear & Rider Experience",
  testimonials: [
    {
      id: 1,
      name: "Jones Charles",
      role: "Big Bike Owner",
      quote:
        "Sixth Gear handled my PMS and accessory installs with care and transparency. Clean work, proper tools, and honest advice. You can tell this shop is run by riders who actually care.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jones",
    },
    {
      id: 2,
      name: "Mike Shinoda",
      role: "Adventure Rider",
      quote:
        "I've had multiple bikes serviced here. From diagnostics to detailing, the quality is consistent. Plus, having good coffee while waiting is a big bonus.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    {
      id: 3,
      name: "Peter Jaksen",
      role: "Touring Enthusiast",
      quote:
        "Fast turnaround without compromising quality. They explained everything clearly and didn't upsell unnecessary work. Highly recommended for premium motorcycles.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
    },
    {
      id: 4,
      name: "Anama Menen",
      role: "Daily Rider",
      quote:
        "From emergency towing to full service, Sixth Gear delivered. Professional team, clean shop, and very approachable staff. This is now my go-to moto shop.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anama",
    },
    {
      id: 5,
      name: "Carlo Reyes",
      role: "Sportbike Rider",
      quote:
        "They installed my exhaust, lights, and accessories perfectly. Wiring was clean and properly routed. Attention to detail here is on another level.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlo",
    },
    {
      id: 6,
      name: "Mark Villanueva",
      role: "Big Bike First-Time Owner",
      quote:
        "As a new big bike owner, I appreciated how patient and informative the team was. They guided me through proper maintenance and safety checks.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
    },
    {
      id: 7,
      name: "Jason Lim",
      role: "Cafe Racer Builder",
      quote:
        "Great balance of technical skill and taste. They helped me with parts selection and installation without rushing the process. Solid workmanship.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jason",
    },
    {
      id: 8,
      name: "Paolo Santos",
      role: "Weekend Rider",
      quote:
        "Dropped by for detailing and ended up staying for coffee and conversation. Friendly atmosphere with serious service capability. Rare combination.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paolo",
    },
    {
      id: 9,
      name: "Kevin Tan",
      role: "Long-Distance Rider",
      quote:
        "I trust Sixth Gear before any long ride. Pre-ride inspections are thorough, and they don't cut corners. Peace of mind every time.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
    },
    {
      id: 10,
      name: "Andrew Cruz",
      role: "Motorcycle Enthusiast",
      quote:
        "Good service, fair pricing, and clear communication. You always know what you're paying for and why. That alone sets them apart.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andrew",
    },
  ],
}

/**
 * Generate avatar URL from name
 */
function generateAvatarUrl(name: string): string {
  const seed = name.split(" ")[0] || "default"
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}

/**
 * Extract client-testimonials content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted client-testimonials content or null if not found/disabled
 */
export function extractClientTestimonialsContent(
  homeContent: any
): ClientTestimonialsContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractClientTestimonials] No blocks found in homeContent")
    return null
  }

  // Find the client-testimonials block
  const testimonialsBlock = homeContent.data.blocks.find(
    (block: any): block is ClientTestimonialsBlock =>
      block.__component === "sections.client-testimonials-section"
  )

  if (!testimonialsBlock) {
    console.log(
      "[extractClientTestimonials] No client-testimonials block found"
    )
    return null
  }

  // Check if section is enabled
  const isSectionEnabled = pickBool(testimonialsBlock.enable, true)
  if (!isSectionEnabled) {
    console.log("[extractClientTestimonials] Section disabled in CMS")
    return null
  }

  console.log("[extractClientTestimonials] Found testimonials block:", {
    section_title: testimonialsBlock.section_title,
    section_desc: testimonialsBlock.section_desc,
    testimonialsCount: testimonialsBlock.client_testimonials?.length || 0,
    enable: testimonialsBlock.enable,
  })

  // If no testimonials in CMS, return null to trigger fallback
  if (
    !testimonialsBlock.client_testimonials ||
    testimonialsBlock.client_testimonials.length === 0
  ) {
    console.log(
      "[extractClientTestimonials] No testimonials in CMS, will use fallbacks"
    )
    return {
      sectionTitle: pickText(
        testimonialsBlock.section_title,
        CLIENT_TESTIMONIALS_FALLBACKS.sectionTitle
      ),
      sectionDescription: pickText(
        testimonialsBlock.section_desc,
        CLIENT_TESTIMONIALS_FALLBACKS.sectionDescription
      ),
      testimonials: [],
    }
  }

  // Filter and transform testimonial items (only enabled ones)
  const testimonials = testimonialsBlock.client_testimonials
    .filter((testimonial) => {
      const isEnabled = pickBool(testimonial.enable, true)
      console.log(
        `[extractClientTestimonials] Testimonial "${testimonial.client_name}":`,
        {
          id: testimonial.id,
          enabled: testimonial.enable,
          isEnabled,
        }
      )
      return isEnabled
    })
    .map((testimonial) => {
      const mappedTestimonial = {
        id: testimonial.id,
        name: pickText(testimonial.client_name, "Anonymous"),
        role: pickText(testimonial.client_title, "Customer"),
        quote: pickText(
          testimonial.testimonials,
          "Great service and experience!"
        ),
        avatar: generateAvatarUrl(testimonial.client_name || "default"),
      }

      console.log(
        `[extractClientTestimonials] Mapped testimonial:`,
        mappedTestimonial
      )

      return mappedTestimonial
    })
    .filter((testimonial) => {
      const isValid = testimonial.name && testimonial.quote
      if (!isValid) {
        console.log(
          `[extractClientTestimonials] Filtering out invalid testimonial (missing name or quote):`,
          testimonial
        )
      }
      return isValid
    })

  console.log("[extractClientTestimonials] Final enabled testimonials:", {
    count: testimonials.length,
  })

  // Transform to frontend format
  const result: ClientTestimonialsContent = {
    sectionTitle: pickText(
      testimonialsBlock.section_title,
      CLIENT_TESTIMONIALS_FALLBACKS.sectionTitle
    ),
    sectionDescription: pickText(
      testimonialsBlock.section_desc,
      CLIENT_TESTIMONIALS_FALLBACKS.sectionDescription
    ),
    testimonials,
  }

  console.log("[extractClientTestimonials] Returning result:", {
    sectionTitle: result.sectionTitle,
    sectionDescription: result.sectionDescription,
    testimonialsCount: testimonials.length,
  })
  return result
}

/**
 * Get client-testimonials content with fallbacks
 *
 * Fetches client-testimonials content from Strapi and returns formatted data.
 * Uses per-testimonial fallbacks: if CMS has testimonials, use them; otherwise use fallback testimonials.
 *
 * @param homeContent - Home content already fetched (to avoid duplicate requests)
 * @returns Client-testimonials content with fallbacks applied
 */
export function getClientTestimonialsWithFallbacks(
  homeContent: any
): ClientTestimonialsContent {
  try {
    const cmsContent = extractClientTestimonialsContent(homeContent)

    if (!cmsContent) {
      console.log("[ClientTestimonials] No CMS data, using all fallbacks")
      return CLIENT_TESTIMONIALS_FALLBACKS
    }

    // If CMS has testimonials (even if empty array), use them; otherwise use fallbacks
    const finalTestimonials =
      cmsContent.testimonials.length > 0
        ? cmsContent.testimonials
        : CLIENT_TESTIMONIALS_FALLBACKS.testimonials

    const result: ClientTestimonialsContent = {
      sectionTitle: cmsContent.sectionTitle,
      sectionDescription: cmsContent.sectionDescription,
      testimonials: finalTestimonials,
    }

    console.log("[ClientTestimonials] Applied fallbacks:", {
      usedCmsTitle: !!cmsContent.sectionTitle,
      usedCmsDescription: !!cmsContent.sectionDescription,
      testimonialsCount: result.testimonials.length,
    })

    return result
  } catch (error) {
    console.error(
      "[ClientTestimonials] Error fetching content, using fallbacks:",
      error
    )
    return CLIENT_TESTIMONIALS_FALLBACKS
  }
}
