/**
 * Strapi Our Team Content Fetcher
 *
 * Fetches our-team section content from Strapi CMS for the homepage.
 */

import { pickText, pickBool } from "../cms/fallback"

// Type definitions for Our Team block (Strapi v5 structure)
export interface TeamMemberItem {
  id: number
  team_name: string
  job_title: string
  job_subtitle: string
  team_description: string
  team_image: any[] | null
  facebook_links?: string
  instagram_link?: string
  tiktok_link?: string
}

export interface OurTeamBlock {
  __component: "sections.our-team-section"
  id: number
  section_title: string
  section_description: string
  our_team: TeamMemberItem[]
  enable: boolean
}

export interface OurTeamContent {
  sectionTitle: string
  sectionDescription: string
  teamMembers: Array<{
    id: number
    name: string
    role: string
    title: string
    description: string
    image: string
    socialLinks: {
      facebook?: string
      instagram?: string
      tiktok?: string
    }
  }>
}

// Hardcoded fallback values
const OUR_TEAM_FALLBACKS: OurTeamContent = {
  sectionTitle: "Our Team",
  sectionDescription:
    "Riders, Technicians, and Professionals Who Care About Your Bike",
  teamMembers: [
    {
      id: 1,
      name: "MARTIE",
      role: "Lead Technician",
      title: "Workshop Head",
      description:
        "Experienced motorcycle technician specializing in diagnostics, repairs, and performance upgrades for big bikes and premium motorcycles.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
      socialLinks: {},
    },
    {
      id: 2,
      name: "JAMES",
      role: "Senior Mechanic",
      title: "Service & Installation Specialist",
      description:
        "Focused on PMS, mechanical repairs, and proper installation of accessories, electronics, and safety upgrades.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
      socialLinks: {},
    },
    {
      id: 3,
      name: "MARVIN",
      role: "Service Advisor",
      title: "Rider Support & Coordination",
      description:
        "Your point of contact for service consultations, job updates, and ensuring a smooth workshop experience from start to finish.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
      socialLinks: {},
    },
  ],
}

/**
 * Resolve image URL to absolute URL
 */
function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // If already absolute URL, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // If relative URL, prefix with STRAPI_URL
  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
  return `${strapiUrl}${url.startsWith("/") ? "" : "/"}${url}`
}

/**
 * Extract our-team content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted our-team content or null if not found/disabled
 */
export function extractOurTeamContent(homeContent: any): OurTeamContent | null {
  if (!homeContent?.data?.blocks) {
    return null
  }

  // Find the our-team block
  const teamBlock = homeContent.data.blocks.find(
    (block: any): block is OurTeamBlock =>
      block.__component === "sections.our-team-section"
  )

  if (!teamBlock) {
    return null
  }

  // Check if section is enabled
  const isSectionEnabled = pickBool(teamBlock.enable, true)
  if (!isSectionEnabled) {
    return null
  }

  // If no team members in CMS, return null to trigger fallback
  if (!teamBlock.our_team || teamBlock.our_team.length === 0) {
    return {
      sectionTitle: pickText(
        teamBlock.section_title,
        OUR_TEAM_FALLBACKS.sectionTitle
      ),
      sectionDescription: pickText(
        teamBlock.section_description,
        OUR_TEAM_FALLBACKS.sectionDescription
      ),
      teamMembers: [],
    }
  }

  // Filter and transform team member items
  const teamMembers = teamBlock.our_team
    .map((member) => {
      // Get first image from team_image array
      const firstImage =
        Array.isArray(member.team_image) && member.team_image.length > 0
          ? member.team_image[0]
          : null

      const imageUrl = firstImage?.url
        ? resolveImageUrl(firstImage.url)
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face"

      return {
        id: member.id,
        name: pickText(member.team_name, "Team Member"),
        role: pickText(member.job_title, "Staff"),
        title: pickText(member.job_subtitle, ""),
        description: pickText(member.team_description, ""),
        image: imageUrl,
        socialLinks: {
          facebook: member.facebook_links || undefined,
          instagram: member.instagram_link || undefined,
          tiktok: member.tiktok_link || undefined,
        },
      }
    })
    .filter((member) => member.name && member.role)

  // Transform to frontend format
  return {
    sectionTitle: pickText(
      teamBlock.section_title,
      OUR_TEAM_FALLBACKS.sectionTitle
    ),
    sectionDescription: pickText(
      teamBlock.section_description,
      OUR_TEAM_FALLBACKS.sectionDescription
    ),
    teamMembers,
  }
}

/**
 * Get our-team content with fallbacks
 *
 * @param homeContent - Home content already fetched
 * @returns Our-team content with fallbacks applied
 */
export function getOurTeamWithFallbacks(homeContent: any): OurTeamContent {
  try {
    const cmsContent = extractOurTeamContent(homeContent)

    if (!cmsContent) {
      console.log("[OurTeam] No CMS data, using all fallbacks")
      return OUR_TEAM_FALLBACKS
    }

    // If CMS has team members, use them; otherwise use fallbacks
    const finalTeamMembers =
      cmsContent.teamMembers.length > 0
        ? cmsContent.teamMembers
        : OUR_TEAM_FALLBACKS.teamMembers

    const result: OurTeamContent = {
      sectionTitle: cmsContent.sectionTitle,
      sectionDescription: cmsContent.sectionDescription,
      teamMembers: finalTeamMembers,
    }

    console.log("[OurTeam] Applied fallbacks:", {
      usedCmsTitle: !!cmsContent.sectionTitle,
      usedCmsDescription: !!cmsContent.sectionDescription,
      teamMembersCount: result.teamMembers.length,
    })

    return result
  } catch (error) {
    console.error("[OurTeam] Error fetching content, using fallbacks:", error)
    return OUR_TEAM_FALLBACKS
  }
}
