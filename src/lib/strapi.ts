/**
 * Strapi CMS Fetch Utility
 *
 * Provides authenticated fetch wrapper for Strapi API calls
 * with error handling and type safety.
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || ""

interface StrapiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

/**
 * Fetch data from Strapi API with authentication
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
    // Build URL with query params
    const url = new URL(path, STRAPI_URL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    // Make authenticated request
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
        ...fetchOptions.headers,
      },
    })

    if (!response.ok) {
      console.warn(
        `[Strapi] Failed to fetch ${path}: ${response.status} ${response.statusText}`
      )
      return null
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`[Strapi] Error fetching ${path}:`, error)
    return null
  }
}

/**
 * Check if Strapi is configured and reachable
 */
export function isStrapiConfigured(): boolean {
  return Boolean(STRAPI_URL && STRAPI_TOKEN)
}
