/**
 * CMS Fallback Utilities
 *
 * Provides field-level fallback logic for Strapi CMS integration.
 * Allows partial overrides: use CMS value when present, otherwise use hardcoded fallback.
 */

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337"

/**
 * Pick text value with fallback
 * Uses CMS value only when it's a non-empty string
 *
 * @param cmsValue - Value from CMS
 * @param fallbackValue - Hardcoded fallback value
 * @returns CMS value if non-empty, otherwise fallback
 */
export function pickText(
  cmsValue: string | null | undefined,
  fallbackValue: string
): string {
  if (typeof cmsValue === "string" && cmsValue.trim().length > 0) {
    return cmsValue.trim()
  }
  return fallbackValue
}

/**
 * Pick media URL with fallback
 * Uses CMS media URL if present, otherwise fallback URL
 * Handles both absolute and relative URLs from Strapi
 *
 * @param cmsMedia - Media object from CMS (with url property)
 * @param fallbackUrl - Hardcoded fallback URL
 * @returns Absolute media URL or fallback
 */
export function pickMediaUrl(
  cmsMedia: { url?: string } | null | undefined,
  fallbackUrl: string
): string {
  if (cmsMedia && typeof cmsMedia.url === "string" && cmsMedia.url.length > 0) {
    return makeAbsoluteUrl(cmsMedia.url)
  }
  return fallbackUrl
}

/**
 * Pick array with fallback
 * Uses CMS array only when it has items
 *
 * @param cmsArray - Array from CMS
 * @param fallbackArray - Hardcoded fallback array
 * @returns CMS array if non-empty, otherwise fallback
 */
export function pickArray<T>(
  cmsArray: T[] | null | undefined,
  fallbackArray: T[]
): T[] {
  if (Array.isArray(cmsArray) && cmsArray.length > 0) {
    return cmsArray
  }
  return fallbackArray
}

/**
 * Pick boolean with fallback
 * Uses CMS boolean value when explicitly set (true or false)
 * Only falls back when value is null or undefined
 *
 * @param cmsBool - Boolean from CMS
 * @param fallbackBool - Hardcoded fallback boolean
 * @returns CMS boolean if defined, otherwise fallback
 */
export function pickBool(
  cmsBool: boolean | null | undefined,
  fallbackBool: boolean
): boolean {
  if (typeof cmsBool === "boolean") {
    return cmsBool
  }
  return fallbackBool
}

/**
 * Convert Strapi URL to absolute URL
 * Handles both relative and absolute URLs
 *
 * @param pathOrUrl - URL or path from Strapi
 * @returns Absolute URL
 */
export function makeAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return ""

  // Already absolute
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl
  }

  // Relative path - prepend Strapi URL
  const baseUrl = STRAPI_URL.endsWith("/")
    ? STRAPI_URL.slice(0, -1)
    : STRAPI_URL
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`

  return `${baseUrl}${path}`
}

/**
 * Pick number with fallback
 * Uses CMS number when it's a valid number
 *
 * @param cmsNumber - Number from CMS
 * @param fallbackNumber - Hardcoded fallback number
 * @returns CMS number if valid, otherwise fallback
 */
export function pickNumber(
  cmsNumber: number | null | undefined,
  fallbackNumber: number
): number {
  if (typeof cmsNumber === "number" && !isNaN(cmsNumber)) {
    return cmsNumber
  }
  return fallbackNumber
}

/**
 * Pick object with fallback
 * Uses CMS object when it exists and is not empty
 *
 * @param cmsObject - Object from CMS
 * @param fallbackObject - Hardcoded fallback object
 * @returns CMS object if non-empty, otherwise fallback
 */
export function pickObject<T extends Record<string, any>>(
  cmsObject: T | null | undefined,
  fallbackObject: T
): T {
  if (
    cmsObject &&
    typeof cmsObject === "object" &&
    Object.keys(cmsObject).length > 0
  ) {
    return cmsObject
  }
  return fallbackObject
}
