/**
 * Strapi CMS Fetch Utility
 *
 * Provides authenticated fetch wrapper for Strapi API calls
 * with STRICT separation between published (public) and draft (preview) content.
 *
 * CRITICAL: Draft content must ONLY be visible in preview mode.
 * Public site must ALWAYS show published content only.
 */

import { draftMode } from "next/headers"

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || ""

interface StrapiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

/**
 * Fetch data from Strapi API with authentication and Draft Mode support
 *
 * STRICT MODE SEPARATION:
 * - Normal mode (public): ONLY published content, with caching
 * - Preview mode (draft): Draft content, no caching
 *
 * @param path - API endpoint path (e.g., "/api/home")
 * @param options - Fetch options including query params
 * @returns Parsed JSON response
 */
export async function fetchStrapi<T = any>(
  path: string,
  options: StrapiRequestOptions = {}
): Promise<T | null> {
  const { params, ...fetchOptions } = options

  try {
    // Check if Draft Mode is enabled
    // This is the ONLY way preview mode should be activated
    let isDraftMode = false
    try {
      const draft = await draftMode()
      isDraftMode = draft.isEnabled
    } catch (error) {
      // If draftMode() fails, assume normal mode (published only)
      console.warn(
        "[Strapi] Draft Mode check failed, defaulting to published mode"
      )
      isDraftMode = false
    }

    // Build URL with query params
    const url = new URL(path, STRAPI_URL)

    // Add existing params
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    // CRITICAL: Strict separation of draft vs published content
    // Strapi v5 behavior:
    // - No status param OR status=published: Returns ONLY published content
    // - status=draft: Returns draft version (may include unpublished changes)
    //
    // We MUST explicitly set status=published for public site to ensure
    // draft content NEVER leaks into normal browsing.
    if (isDraftMode) {
      // PREVIEW MODE: Request draft content
      url.searchParams.set("status", "draft")
      console.log("[Strapi] 🔍 PREVIEW MODE - Fetching draft content")
      console.log("[Strapi] Draft Mode enabled at:", new Date().toISOString())
    } else {
      // PUBLIC MODE: Request published content ONLY
      // This ensures draft changes are NEVER visible on public site
      url.searchParams.set("status", "published")
      console.log("[Strapi] 🌐 PUBLIC MODE - Fetching published content only")
    }

    console.log("[Strapi] Request URL:", url.toString())

    // Determine caching strategy based on mode
    // CRITICAL: No caching in preview mode to always show latest draft
    const cacheOptions = isDraftMode
      ? { cache: "no-store" as const } // Preview: Always fresh
      : { next: { revalidate: 60 } } // Public: ISR with 60s cache

    // Make authenticated request
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      ...cacheOptions,
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
        ...fetchOptions.headers,
      },
    })

    if (!response.ok) {
      console.error(
        `[Strapi] ❌ Failed to fetch ${path}: ${response.status} ${response.statusText}`
      )
      const errorText = await response.text()
      console.error(`[Strapi] Error response:`, errorText)
      return null
    }

    const data = await response.json()

    // Debug logging to verify correct content is returned
    if (data?.data) {
      const publishedAt = data.data.publishedAt
      const isPublished = publishedAt !== null

      console.log("[Strapi] ✅ Response received:", {
        mode: isDraftMode ? "PREVIEW" : "PUBLIC",
        isPublished,
        publishedAt,
        blocksCount: data.data.blocks?.length || 0,
      })

      // Log the actual hero title for debugging
      if (data.data.blocks) {
        const heroBlock = data.data.blocks.find(
          (b: any) => b.__component === "sections.hero"
        )
        if (heroBlock) {
          console.log(
            `[Strapi] Hero title: "${heroBlock.title}" (${
              isDraftMode ? "DRAFT" : "PUBLISHED"
            })`
          )
        }
      }

      // SAFETY CHECK: Warn if draft content appears in public mode
      if (!isDraftMode && !isPublished) {
        console.error(
          "[Strapi] ⚠️ WARNING: Draft content returned in PUBLIC mode! This should not happen."
        )
        console.error(
          "[Strapi] Check if status=published parameter is being respected by Strapi."
        )
      }
    }

    return data as T
  } catch (error) {
    console.error(`[Strapi] ❌ Error fetching ${path}:`, error)
    return null
  }
}

/**
 * Check if Strapi is configured and reachable
 */
export function isStrapiConfigured(): boolean {
  return Boolean(STRAPI_URL && STRAPI_TOKEN)
}

/**
 * Check if Draft Mode is currently enabled
 * This is a synchronous helper for client-side checks
 */
export function isDraftModeEnabled(): boolean {
  try {
    // Note: This will throw in client components
    // Only use in server components or API routes
    const { isEnabled } = draftMode()
    return isEnabled
  } catch {
    return false
  }
}
