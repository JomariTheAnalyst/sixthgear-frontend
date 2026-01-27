/**
 * Strapi Client Stories (Rider Stories) Content Fetcher
 *
 * Fetches rider-stories-section content from Strapi CMS for the homepage.
 */

import { StrapiImage } from "./home"
import { pickText, pickMediaUrl, pickBool } from "../cms/fallback"

// Type definitions for Rider Stories block (Strapi v5 structure)
export interface RiderStoryItem {
  id: number
  story_title: string
  story_desc: string
  rider_name: string
  date: string
  image: StrapiImage[] | null
  enable: boolean
}

export interface RiderStoriesBlock {
  __component: "sections.rider-stories-section"
  id: number
  section_title: string
  section_desc: string
  rider_stories: RiderStoryItem[]
  enable: boolean
}

export interface ClientStoriesContent {
  sectionTitle: string
  sectionDescription: string
  stories: Array<{
    id: number
    title: string
    excerpt: string
    author: string
    date: string
    category: string
    image: string
  }>
}

// Hardcoded fallback values
const CLIENT_STORIES_FALLBACKS = {
  sectionTitle: "Rider Stories & Garage Notes",
  sectionDescription:
    "Tips, stories, and insights from the workshop, the road, and the rider lounge",
  stories: [
    {
      id: 1,
      title: "First Long Ride After Engine Rebuild",
      excerpt:
        "After months of waiting, finally took my bike out for a 300km ride. The engine feels brand new thanks to the team at Sixthgear.",
      author: "Marco R.",
      date: "January 10, 2026",
      category: "Rider Story",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    },
    {
      id: 2,
      title: "Why Regular PMS Matters",
      excerpt:
        "A quick guide on preventive maintenance schedules and why sticking to them can save you from costly repairs down the road.",
      author: "Sixthgear Team",
      date: "January 5, 2026",
      category: "Garage Notes",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80",
    },
    {
      id: 3,
      title: "Weekend Ride to Tagaytay",
      excerpt:
        "Joined the Sunday group ride with fellow riders. Great weather, great roads, and even better company at the coffee stop.",
      author: "James L.",
      date: "December 28, 2025",
      category: "Rider Story",
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
    },
  ],
}

/**
 * Format date string to readable format
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

/**
 * Extract rider-stories content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted rider-stories content or null if not found/disabled
 */
export function extractClientStoriesContent(
  homeContent: any
): ClientStoriesContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractClientStories] No blocks found in homeContent")
    return null
  }

  // Find the rider-stories block
  const storiesBlock = homeContent.data.blocks.find(
    (block: any): block is RiderStoriesBlock =>
      block.__component === "sections.rider-stories-section"
  )

  if (!storiesBlock) {
    console.log("[extractClientStories] No rider-stories block found")
    return null
  }

  // Check if section is enabled
  const isSectionEnabled = pickBool(storiesBlock.enable, true)
  if (!isSectionEnabled) {
    console.log("[extractClientStories] Section disabled in CMS")
    return null
  }

  console.log("[extractClientStories] Found stories block:", {
    section_title: storiesBlock.section_title,
    section_desc: storiesBlock.section_desc,
    storiesCount: storiesBlock.rider_stories?.length || 0,
    enable: storiesBlock.enable,
  })

  // If no stories in CMS, return null to trigger fallback
  if (!storiesBlock.rider_stories || storiesBlock.rider_stories.length === 0) {
    console.log("[extractClientStories] No stories in CMS, will use fallbacks")
    return {
      sectionTitle: pickText(
        storiesBlock.section_title,
        CLIENT_STORIES_FALLBACKS.sectionTitle
      ),
      sectionDescription: pickText(
        storiesBlock.section_desc,
        CLIENT_STORIES_FALLBACKS.sectionDescription
      ),
      stories: [],
    }
  }

  // Filter and transform story items (only enabled ones)
  const stories = storiesBlock.rider_stories
    .filter((story) => {
      const isEnabled = pickBool(story.enable, true)
      console.log(`[extractClientStories] Story "${story.story_title}":`, {
        id: story.id,
        enabled: story.enable,
        isEnabled,
        hasImage: !!story.image,
      })
      return isEnabled
    })
    .map((story) => {
      // Use first image from Multiple Media field
      const firstImage =
        Array.isArray(story.image) && story.image.length > 0
          ? story.image[0]
          : null

      const imageUrl = firstImage
        ? pickMediaUrl(
            firstImage,
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
          )
        : "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"

      const mappedStory = {
        id: story.id,
        title: pickText(story.story_title, "Untitled Story"),
        excerpt: pickText(story.story_desc, "No description available"),
        author: pickText(story.rider_name, "Anonymous Rider"),
        date: formatDate(story.date || new Date().toISOString()),
        category: "Rider Story", // Default category
        image: imageUrl,
      }

      console.log(`[extractClientStories] Mapped story:`, mappedStory)

      return mappedStory
    })
    .filter((story) => {
      const isValid = story.title && story.excerpt
      if (!isValid) {
        console.log(
          `[extractClientStories] Filtering out invalid story (missing title or excerpt):`,
          story
        )
      }
      return isValid
    })

  console.log("[extractClientStories] Final enabled stories:", {
    count: stories.length,
  })

  // Transform to frontend format
  const result: ClientStoriesContent = {
    sectionTitle: pickText(
      storiesBlock.section_title,
      CLIENT_STORIES_FALLBACKS.sectionTitle
    ),
    sectionDescription: pickText(
      storiesBlock.section_desc,
      CLIENT_STORIES_FALLBACKS.sectionDescription
    ),
    stories,
  }

  console.log("[extractClientStories] Returning result:", {
    sectionTitle: result.sectionTitle,
    sectionDescription: result.sectionDescription,
    storiesCount: stories.length,
  })
  return result
}

/**
 * Get client-stories content with fallbacks
 *
 * Fetches client-stories content from Strapi and returns formatted data.
 * Uses per-story fallbacks: if CMS has stories, use them; otherwise use fallback stories.
 *
 * @param homeContent - Home content already fetched (to avoid duplicate requests)
 * @returns Client-stories content with fallbacks applied
 */
export function getClientStoriesWithFallbacks(
  homeContent: any
): ClientStoriesContent {
  try {
    const cmsContent = extractClientStoriesContent(homeContent)

    if (!cmsContent) {
      console.log("[ClientStories] No CMS data, using all fallbacks")
      return CLIENT_STORIES_FALLBACKS
    }

    // If CMS has stories (even if empty array), use them; otherwise use fallbacks
    const finalStories =
      cmsContent.stories.length > 0
        ? cmsContent.stories
        : CLIENT_STORIES_FALLBACKS.stories

    const result: ClientStoriesContent = {
      sectionTitle: cmsContent.sectionTitle,
      sectionDescription: cmsContent.sectionDescription,
      stories: finalStories,
    }

    console.log("[ClientStories] Applied fallbacks:", {
      usedCmsTitle: !!cmsContent.sectionTitle,
      usedCmsDescription: !!cmsContent.sectionDescription,
      storiesCount: result.stories.length,
    })

    return result
  } catch (error) {
    console.error(
      "[ClientStories] Error fetching content, using fallbacks:",
      error
    )
    return CLIENT_STORIES_FALLBACKS
  }
}
