import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

/**
 * Preview API Route
 *
 * Enables Next.js Draft Mode for previewing draft content from Strapi CMS.
 * Called by Strapi's "Open preview" button.
 *
 * Query Parameters:
 * - secret: Must match STRAPI_PREVIEW_SECRET
 * - uid: Strapi content type UID (e.g., "api::home.home")
 * - documentId: Strapi document ID
 * - status: "draft" or "published"
 * - locale: Optional locale code
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  console.log("[Preview] Route called with URL:", request.url)
  console.log("[Preview] Search params:", Object.fromEntries(searchParams))

  // Extract query parameters
  const secret = searchParams.get("secret")
  const uid = searchParams.get("uid")
  const documentId = searchParams.get("documentId")
  const status = searchParams.get("status")
  const locale = searchParams.get("locale")

  // Validate secret
  const expectedSecret = process.env.STRAPI_PREVIEW_SECRET

  console.log("[Preview] Secret validation:", {
    received: secret ? "***" + secret.slice(-4) : "null",
    expected: expectedSecret ? "***" + expectedSecret.slice(-4) : "null",
    matches: secret === expectedSecret,
  })

  if (!expectedSecret) {
    console.error("[Preview] STRAPI_PREVIEW_SECRET not configured")
    return new Response("Preview mode is not configured", { status: 500 })
  }

  if (secret !== expectedSecret) {
    console.error("[Preview] Secret mismatch!")
    return new Response("Invalid preview secret", { status: 401 })
  }

  // Validate required parameters
  if (!uid || !documentId) {
    console.error("[Preview] Missing required parameters")
    return new Response("Missing required parameters: uid, documentId", {
      status: 400,
    })
  }

  console.log("[Preview] Enabling draft mode for:", {
    uid,
    documentId,
    status,
    locale,
  })

  // Enable Draft Mode (await in Next.js 15+)
  const draft = await draftMode()
  draft.enable()

  console.log("[Preview] Draft mode enabled successfully")

  // Map content type UID to frontend route
  const previewPath = getPreviewPath(uid, documentId, locale)

  if (!previewPath) {
    console.error("[Preview] No route configured for:", uid)
    return new Response(
      `No preview route configured for content type: ${uid}`,
      {
        status: 404,
      }
    )
  }

  console.log("[Preview] Redirecting to dedicated preview page: /preview")

  // Redirect to the dedicated preview page (not the main site)
  // This ensures the preview is embeddable in Strapi's iframe
  redirect("/preview")
}

/**
 * Map Strapi content type UID to Next.js route
 *
 * @param uid - Strapi content type UID
 * @param documentId - Strapi document ID
 * @param locale - Optional locale code
 * @returns Preview path or null if not configured
 */
function getPreviewPath(
  uid: string,
  documentId: string,
  locale: string | null
): string | null {
  // Default country code (can be overridden by locale)
  const countryCode = locale || "ph"

  // Map content types to their routes
  const contentTypeRoutes: Record<string, string> = {
    "api::home.home": `/${countryCode}`,
    // Add more content types as needed:
    // "api::page.page": `/${countryCode}/pages/${documentId}`,
    // "api::blog-post.blog-post": `/${countryCode}/blog/${documentId}`,
    // "api::product.product": `/${countryCode}/products/${documentId}`,
  }

  return contentTypeRoutes[uid] || null
}
