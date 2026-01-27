/**
 * Strapi Space and Experience Content Fetcher
 *
 * Fetches space-and-experience section content from Strapi CMS for the homepage.
 */

import { StrapiImage } from "./home"
import { pickText, pickMediaUrl, pickBool } from "../cms/fallback"

// Type definitions for Space and Experience block (Strapi v5 structure)
export interface ExperienceItem {
  id: number
  experience_title: string
  experience_desc: string
  experience_image: StrapiImage[] | null
  enable: boolean
}

export interface SpaceAndExperienceBlock {
  __component: "sections.our-space-and-experience-section"
  id: number
  section_title: string
  section_description: string
  experience: ExperienceItem[]
  enable: boolean
}

export interface SpaceAndExperienceContent {
  sectionTitle: string
  sectionDescription: string
  items: Array<{
    id: number
    title: string
    description: string
    imageUrl: string
    isEnabled: boolean
  }>
  isSectionEnabled: boolean
}

// Hardcoded fallback values
const SPACE_AND_EXPERIENCE_FALLBACKS = {
  sectionTitle: "Our Space & Experiences",
  sectionDescription: "Great Coffee, Good Rides, Better Conversations",
  items: [
    {
      id: 1,
      title: "Signature Coffee & Brews",
      description:
        "Carefully crafted coffee using quality beans, brewed to fuel riders, creatives, and everyday coffee lovers.",
      imageUrl: "/images/homepage/projects/coffee.jpg",
      isEnabled: true,
    },
    {
      id: 2,
      title: "Rider Lounge & Hangout",
      description:
        "A relaxed café and lounge where riders unwind, connect, and share stories between rides and wrench sessions.",
      imageUrl: "/images/homepage/projects/lounge.jpg",
      isEnabled: true,
    },
    {
      id: 3,
      title: "Community & Meetups",
      description:
        "A welcoming space for rider meetups, small events, and casual gatherings built around coffee and motorcycle culture.",
      imageUrl: "/images/homepage/projects/community.jpg",
      isEnabled: true,
    },
  ],
}

/**
 * Extract space-and-experience content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted space-and-experience content or null if not found/disabled
 */
export function extractSpaceAndExperienceContent(
  homeContent: any
): SpaceAndExperienceContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractSpaceAndExperience] No blocks found in homeContent")
    return null
  }

  // Find the space-and-experience block
  const experienceBlock = homeContent.data.blocks.find(
    (block: any): block is SpaceAndExperienceBlock =>
      block.__component === "sections.our-space-and-experience-section"
  )

  if (!experienceBlock) {
    console.log(
      "[extractSpaceAndExperience] No space-and-experience block found"
    )
    return null
  }

  // Check if section is enabled
  const isSectionEnabled = pickBool(experienceBlock.enable, true)
  if (!isSectionEnabled) {
    console.log("[extractSpaceAndExperience] Section disabled in CMS")
    return null
  }

  console.log("[extractSpaceAndExperience] Found experience block:", {
    section_title: experienceBlock.section_title,
    itemsCount: experienceBlock.experience?.length || 0,
    rawExperience: experienceBlock.experience,
  })

  // Filter and transform experience items (only enabled ones)
  const items =
    experienceBlock.experience
      ?.filter((item) => {
        const isEnabled = pickBool(item.enable, true)
        console.log(
          `[extractSpaceAndExperience] Item ${item.experience_title}:`,
          {
            enabled: isEnabled,
            hasImage: !!item.experience_image,
            imageCount: item.experience_image?.length || 0,
          }
        )
        return isEnabled
      })
      .map((item, index) => {
        // Use first image from Multiple Media field
        const firstImage =
          Array.isArray(item.experience_image) &&
          item.experience_image.length > 0
            ? item.experience_image[0]
            : null

        const imageUrl = firstImage ? pickMediaUrl(firstImage, "") : ""

        // Use fallback image if CMS image is missing
        const fallbackItem = SPACE_AND_EXPERIENCE_FALLBACKS.items[index] || {
          imageUrl: "/images/homepage/projects/default.jpg",
        }

        console.log(
          `[extractSpaceAndExperience] Mapping item ${item.experience_title}:`,
          {
            id: item.id,
            title: item.experience_title,
            imageUrl: imageUrl || fallbackItem.imageUrl,
          }
        )

        return {
          id: item.id,
          title: pickText(item.experience_title, "Experience"),
          description: pickText(item.experience_desc, ""),
          imageUrl: imageUrl || fallbackItem.imageUrl,
          isEnabled: true,
        }
      })
      .filter((item) => {
        const isValid = item.title && item.description
        if (!isValid) {
          console.log(
            `[extractSpaceAndExperience] Filtering out invalid item:`,
            item
          )
        }
        return isValid
      }) || []

  // Transform to frontend format
  const result: SpaceAndExperienceContent = {
    sectionTitle: pickText(
      experienceBlock.section_title,
      SPACE_AND_EXPERIENCE_FALLBACKS.sectionTitle
    ),
    sectionDescription: pickText(
      experienceBlock.section_description,
      SPACE_AND_EXPERIENCE_FALLBACKS.sectionDescription
    ),
    items,
    isSectionEnabled: true,
  }

  console.log("[extractSpaceAndExperience] Returning result:", {
    itemsCount: items.length,
    items,
  })
  return result
}

/**
 * Get space-and-experience content with fallbacks
 *
 * Fetches space-and-experience content from Strapi and returns formatted data.
 * Uses fallbacks: if CMS has items, use them; otherwise use fallback items.
 *
 * @param homeContent - Home content already fetched (to avoid duplicate requests)
 * @returns Space-and-experience content with fallbacks applied
 */
export function getSpaceAndExperienceWithFallbacks(
  homeContent: any
): SpaceAndExperienceContent {
  try {
    const cmsContent = extractSpaceAndExperienceContent(homeContent)

    if (!cmsContent) {
      console.log("[SpaceAndExperience] No CMS data, using all fallbacks")
      return {
        ...SPACE_AND_EXPERIENCE_FALLBACKS,
        isSectionEnabled: true,
      }
    }

    // If CMS has items (even if empty array), use them; otherwise use fallbacks
    const finalItems =
      cmsContent.items.length > 0
        ? cmsContent.items
        : SPACE_AND_EXPERIENCE_FALLBACKS.items

    const result: SpaceAndExperienceContent = {
      sectionTitle: cmsContent.sectionTitle,
      sectionDescription: cmsContent.sectionDescription,
      items: finalItems,
      isSectionEnabled: cmsContent.isSectionEnabled,
    }

    console.log("[SpaceAndExperience] Applied fallbacks:", {
      usedCmsTitle: !!cmsContent.sectionTitle,
      itemsCount: result.items.length,
    })

    return result
  } catch (error) {
    console.error(
      "[SpaceAndExperience] Error fetching content, using fallbacks:",
      error
    )
    return {
      ...SPACE_AND_EXPERIENCE_FALLBACKS,
      isSectionEnabled: true,
    }
  }
}
