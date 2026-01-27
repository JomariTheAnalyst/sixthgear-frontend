/**
 * Strapi Satisfied Customers Content Fetcher
 *
 * Fetches satisfied-customers section content from Strapi CMS for the homepage.
 */

import { StrapiImage } from "./home"
import { pickText, pickMediaUrl } from "../cms/fallback"

// Type definitions for Satisfied Customers block (Strapi v5 structure)
export interface CustomerItem {
  id: number
  customer_name: string
  customer_image: StrapiImage[] | null
}

export interface SatisfiedCustomersBlock {
  __component: "sections.satisfied-customers-section"
  id: number
  section_title: string
  enabled?: boolean // Add enabled field
  customers: CustomerItem[]
  row2_customers: CustomerItem[]
}

export interface SatisfiedCustomersContent {
  sectionTitle: string
  row1: Array<{
    id: number
    name: string
    imageUrl: string
  }>
  row2: Array<{
    id: number
    name: string
    imageUrl: string
  }>
}

// Hardcoded fallback values
const SATISFIED_CUSTOMERS_FALLBACKS = {
  sectionTitle: "Sixthgear Satisfied Customers",
  row1: [
    {
      id: 1,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/002.jpg",
    },
    {
      id: 2,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/002fg.jpg",
    },
    {
      id: 3,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/003.jpg",
    },
    {
      id: 4,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/004.jpg",
    },
    {
      id: 5,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/004fg.jpg",
    },
    {
      id: 6,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/005.jpg",
    },
    {
      id: 7,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/007.jpg",
    },
    {
      id: 8,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/009.jpg",
    },
    {
      id: 9,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/010fg.jpg",
    },
  ],
  row2: [
    {
      id: 10,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/011fg.jpg",
    },
    {
      id: 11,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/012.jpg",
    },
    {
      id: 12,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/012fg.jpg",
    },
    {
      id: 13,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/013.jpg",
    },
    {
      id: 14,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/014.jpg",
    },
    {
      id: 15,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/015.jpg",
    },
    {
      id: 16,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/016.jpg",
    },
    {
      id: 17,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/018.jpg",
    },
    {
      id: 18,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/019.jpg",
    },
    {
      id: 19,
      name: "Sixth Gear Rider",
      imageUrl: "/images/polaroid-marquee/satisfied-customers/111.jpg",
    },
  ],
}

/**
 * Transform customer items with fallbacks
 */
function transformCustomerItems(
  items: CustomerItem[] | undefined | null,
  fallbackItems: Array<{ id: number; name: string; imageUrl: string }>
): Array<{ id: number; name: string; imageUrl: string }> {
  if (!items || items.length === 0) {
    return fallbackItems
  }

  return items
    .map((item, index) => {
      // Use first image from Multiple Media field
      const firstImage =
        Array.isArray(item.customer_image) && item.customer_image.length > 0
          ? item.customer_image[0]
          : null

      const imageUrl = firstImage ? pickMediaUrl(firstImage, "") : ""

      // Use fallback image if CMS image is missing
      const fallbackItem = fallbackItems[index] || {
        imageUrl: "/images/polaroid-marquee/satisfied-customers/002.jpg",
      }

      return {
        id: item.id,
        name: pickText(
          item.customer_name,
          fallbackItem.name || "Sixth Gear Rider"
        ),
        imageUrl: imageUrl || fallbackItem.imageUrl,
      }
    })
    .filter((item) => item.name && item.imageUrl) // Only include items with both name and image
}

/**
 * Extract satisfied-customers content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted satisfied-customers content or null if not found
 */
export function extractSatisfiedCustomersContent(
  homeContent: any
): SatisfiedCustomersContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractSatisfiedCustomers] No blocks found in homeContent")
    return null
  }

  // Find the satisfied-customers block
  const customersBlock = homeContent.data.blocks.find(
    (block: any): block is SatisfiedCustomersBlock =>
      block.__component === "sections.satisfied-customers-section"
  )

  if (!customersBlock) {
    console.log(
      "[extractSatisfiedCustomers] No satisfied-customers block found"
    )
    return null
  }

  // Check if section is enabled (if enabled field exists and is false, return null to trigger fallback)
  if (customersBlock.enabled === false) {
    console.log(
      "[extractSatisfiedCustomers] Section disabled in CMS (enabled=false), using fallback"
    )
    return null
  }

  console.log("[extractSatisfiedCustomers] Found customers block:", {
    section_title: customersBlock.section_title,
    enabled: customersBlock.enabled,
    row1Count: customersBlock.customers?.length || 0,
    row2Count: customersBlock.row2_customers?.length || 0,
  })

  // Transform both rows with fallbacks
  const row1 = transformCustomerItems(
    customersBlock.customers,
    SATISFIED_CUSTOMERS_FALLBACKS.row1
  )

  const row2 = transformCustomerItems(
    customersBlock.row2_customers,
    SATISFIED_CUSTOMERS_FALLBACKS.row2
  )

  const result: SatisfiedCustomersContent = {
    sectionTitle: pickText(
      customersBlock.section_title,
      SATISFIED_CUSTOMERS_FALLBACKS.sectionTitle
    ),
    row1,
    row2,
  }

  console.log("[extractSatisfiedCustomers] Returning result:", {
    row1Count: row1.length,
    row2Count: row2.length,
  })

  return result
}

/**
 * Get satisfied-customers content with fallbacks
 *
 * Fetches satisfied-customers content from Strapi and returns formatted data.
 * Uses fallbacks: if CMS has items, use them; otherwise use fallback items.
 *
 * @param homeContent - Home content already fetched (to avoid duplicate requests)
 * @returns Satisfied-customers content with fallbacks applied
 */
export function getSatisfiedCustomersWithFallbacks(
  homeContent: any
): SatisfiedCustomersContent {
  try {
    const cmsContent = extractSatisfiedCustomersContent(homeContent)

    if (!cmsContent) {
      console.log("[SatisfiedCustomers] No CMS data, using all fallbacks")
      return SATISFIED_CUSTOMERS_FALLBACKS
    }

    console.log("[SatisfiedCustomers] Applied fallbacks:", {
      usedCmsTitle: !!cmsContent.sectionTitle,
      row1Count: cmsContent.row1.length,
      row2Count: cmsContent.row2.length,
    })

    return cmsContent
  } catch (error) {
    console.error(
      "[SatisfiedCustomers] Error fetching content, using fallbacks:",
      error
    )
    return SATISFIED_CUSTOMERS_FALLBACKS
  }
}
