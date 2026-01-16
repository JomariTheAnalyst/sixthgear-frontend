/**
 * Marketing Types for Sixthgear
 * Admin-managed announcement strips, banners, and popups
 */

export type MarketingItemType = "strip" | "banner" | "popup"
export type MarketingStatus = "draft" | "published"
export type DeviceTarget = "all" | "mobile" | "desktop"
export type PopupFrequency = "once_session" | "once_day" | "always"

export interface MarketingItem {
  id: string
  type: MarketingItemType
  status: MarketingStatus
  title: string
  message: string
  cta_text?: string
  cta_url?: string
  image_desktop_url?: string
  image_mobile_url?: string
  background_color?: string
  text_color?: string
  enabled: boolean
  priority: number
  start_at?: string
  end_at?: string
  pages: string[] // e.g., ["/", "/shop", "/products/*"]
  device: DeviceTarget
  // Banner specific
  placement?: string // e.g., "home_top", "shop_sidebar"
  // Popup specific
  delay_ms?: number
  frequency?: PopupFrequency
  dismiss_key?: string
  created_at: string
  updated_at: string
}

export interface MarketingResponse {
  strip: MarketingItem | null
  banners: MarketingItem[]
  popups: MarketingItem[]
}

export interface MarketingFetchParams {
  path: string
  device?: "mobile" | "desktop"
  country?: string
  preview_token?: string
}
