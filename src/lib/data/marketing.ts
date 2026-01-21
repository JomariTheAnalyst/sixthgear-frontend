"use server"

import { cookies, draftMode } from "next/headers"
import { MarketingResponse, MarketingFetchParams } from "../../types/marketing"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * Fetch marketing content for a specific page
 * Returns strip, banners, and popups filtered by path, device, and schedule
 */
export async function getMarketingContent(
  params: MarketingFetchParams
): Promise<MarketingResponse> {
  try {
    const searchParams = new URLSearchParams({
      path: params.path,
      device: params.device || "desktop",
      country: params.country || "PH",
    })

    if (params.preview_token) {
      searchParams.set("preview_token", params.preview_token)
    }

    // Check if in draft mode - if so, don't cache
    const draft = await draftMode()
    const cacheOptions = draft.isEnabled
      ? { cache: "no-store" as const }
      : { next: { revalidate: 60 } }

    const response = await fetch(
      `${BACKEND_URL}/store/marketing?${searchParams.toString()}`,
      cacheOptions
    )

    if (!response.ok) {
      console.error("[Marketing] Failed to fetch:", response.status)
      return { strip: null, banners: [], popups: [] }
    }

    const data = await response.json()
    return data as MarketingResponse
  } catch (error) {
    console.error("[Marketing] Error fetching content:", error)
    return { strip: null, banners: [], popups: [] }
  }
}

/**
 * Get marketing content for a path
 * Automatically includes preview token if in draft mode
 */
export async function getMarketingForPath(
  path: string
): Promise<MarketingResponse> {
  // Check for preview token in cookies
  const cookieStore = await cookies()
  const previewToken = cookieStore.get("marketing_preview_token")?.value

  return getMarketingContent({
    path,
    device: "desktop",
    country: "PH",
    preview_token: previewToken,
  })
}
