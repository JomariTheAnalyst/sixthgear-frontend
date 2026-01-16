"use client"

import { createContext, useContext, ReactNode } from "react"
import { MarketingResponse, MarketingItem } from "@/types/marketing"
import AnnouncementStrip from "../components/announcement-strip"
import PopupAds from "../components/popup-ads"

interface MarketingContextValue {
  strip: MarketingItem | null
  banners: MarketingItem[]
  popups: MarketingItem[]
}

const MarketingContext = createContext<MarketingContextValue>({
  strip: null,
  banners: [],
  popups: [],
})

export function useMarketing() {
  return useContext(MarketingContext)
}

interface MarketingProviderProps {
  children: ReactNode
  marketing: MarketingResponse
  showPopups?: boolean // Only show popups on specific pages (e.g., homepage)
}

export function MarketingProvider({
  children,
  marketing,
  showPopups = false,
}: MarketingProviderProps) {
  return (
    <MarketingContext.Provider value={marketing}>
      {/* Announcement Strip - Always rendered if available */}
      <AnnouncementStrip item={marketing.strip} />

      {/* Main Content */}
      {children}

      {/* Popup Ads - Only on specified pages */}
      {showPopups && <PopupAds popups={marketing.popups} />}
    </MarketingContext.Provider>
  )
}

// Export hook to get banners for a specific placement
export function useBanners(placement?: string): MarketingItem[] {
  const { banners } = useMarketing()

  if (!placement) return banners

  return banners.filter((b) => b.placement === placement)
}
