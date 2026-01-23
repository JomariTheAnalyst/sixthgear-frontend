import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ph"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

/**
 * Safely fetches regions from Medusa backend.
 * Returns null on any error to prevent middleware crashes.
 */
async function getRegionMap(
  cacheId: string
): Promise<Map<string, HttpTypes.StoreRegion> | null> {
  try {
    const { regionMap, regionMapUpdated } = regionMapCache

    // Validate required env vars
    if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
      console.warn(
        "Middleware: Missing MEDUSA_BACKEND_URL or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"
      )
      return null
    }

    // Return cached regions if still valid (within 1 hour)
    if (regionMap.size > 0 && regionMapUpdated > Date.now() - 3600 * 1000) {
      return regionMap
    }

    // Fetch regions from Medusa with timeout protection
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
      signal: controller.signal,
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(
        `Middleware: Failed to fetch regions, status ${response.status}`
      )
      return null
    }

    const data = await response.json()
    const regions = data?.regions

    if (!regions || !Array.isArray(regions) || regions.length === 0) {
      console.warn("Middleware: No regions returned from backend")
      return null
    }

    // Build region map from countries
    regionMapCache.regionMap.clear()
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        if (c.iso_2) {
          regionMapCache.regionMap.set(c.iso_2.toLowerCase(), region)
        }
      })
    })

    regionMapCache.regionMapUpdated = Date.now()

    return regionMapCache.regionMap
  } catch (error) {
    // Catch all errors: network, timeout, parsing, etc.
    console.warn(
      "Middleware: Error fetching regions:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return null
  }
}

/**
 * Determines the country code to use for the request.
 * Returns null if unable to determine.
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
): Promise<string | null> {
  try {
    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    // Priority: URL > Vercel IP > Default > First available
    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      return urlCountryCode
    }

    if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      return vercelCountryCode
    }

    if (DEFAULT_REGION && regionMap.has(DEFAULT_REGION.toLowerCase())) {
      return DEFAULT_REGION.toLowerCase()
    }

    // Fallback to first available region
    const firstRegion = regionMap.keys().next().value
    return firstRegion || null
  } catch (error) {
    console.warn("Middleware: Error determining country code")
    return null
  }
}

/**
 * Fail-safe middleware for region-based routing.
 * NEVER throws - always returns a valid response.
 */
export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // Skip static assets and API routes
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/api/") ||
      pathname.includes(".")
    ) {
      return NextResponse.next()
    }

    // Check if URL already has a country code (e.g., /ph, /us)
    const urlSegments = pathname.split("/").filter(Boolean)
    const potentialCountryCode = urlSegments[0]?.toLowerCase()

    // If it looks like a country code (2 chars), assume it's valid and continue
    if (potentialCountryCode && potentialCountryCode.length === 2) {
      const response = NextResponse.next()

      // Set cache ID cookie if missing
      const cacheIdCookie = request.cookies.get("_medusa_cache_id")
      if (!cacheIdCookie) {
        const cacheId = crypto.randomUUID()
        response.cookies.set("_medusa_cache_id", cacheId, {
          maxAge: 60 * 60 * 24,
          httpOnly: true,
          sameSite: "lax",
        })
      }

      // Add CSP headers to allow iframe embedding from Strapi
      const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
      // Extract domain from Strapi URL for CSP
      const strapiDomain = strapiUrl.replace(/^https?:\/\//, "").split("/")[0]
      response.headers.set(
        "Content-Security-Policy",
        `frame-ancestors 'self' https://${strapiDomain} http://localhost:1337`
      )
      response.headers.set(
        "X-Frame-Options",
        "ALLOW-FROM https://${strapiDomain}"
      )

      return response
    }

    // Attempt to fetch regions and determine country code
    const cacheIdCookie = request.cookies.get("_medusa_cache_id")
    const cacheId = cacheIdCookie?.value || crypto.randomUUID()

    const regionMap = await getRegionMap(cacheId)

    // If backend is down or regions unavailable, allow through without redirect
    if (!regionMap || regionMap.size === 0) {
      console.warn(
        "Middleware: Unable to fetch regions, allowing request through"
      )
      return NextResponse.next()
    }

    const countryCode = await getCountryCode(request, regionMap)

    // If we can't determine a country code, allow through
    if (!countryCode) {
      console.warn(
        "Middleware: Unable to determine country code, allowing request through"
      )
      return NextResponse.next()
    }

    // Redirect to country-prefixed URL
    const redirectPath = pathname === "/" ? "" : pathname
    const queryString = request.nextUrl.search || ""
    const redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`

    const response = NextResponse.redirect(redirectUrl, 307)

    // Set cache ID cookie
    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
      })
    }

    // Add CSP headers to allow iframe embedding from Strapi
    const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
    // Extract domain from Strapi URL for CSP
    const strapiDomain = strapiUrl.replace(/^https?:\/\//, "").split("/")[0]
    response.headers.set(
      "Content-Security-Policy",
      `frame-ancestors 'self' https://${strapiDomain} http://localhost:1337`
    )
    response.headers.set(
      "X-Frame-Options",
      "ALLOW-FROM https://${strapiDomain}"
    )

    return response
  } catch (error) {
    // Ultimate fail-safe: log and allow request through
    console.warn(
      "Middleware: Unexpected error, allowing request through:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (meta files)
     * - Files with extensions (e.g., .png, .jpg, .svg, .css, .js)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
}
