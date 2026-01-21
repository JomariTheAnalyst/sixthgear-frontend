"use client"

import { MarketingItem } from "../../../../types/marketing"
import Image from "next/image"
import Link from "next/link"

interface BannerSlotProps {
  banners: MarketingItem[]
  placement: string
  className?: string
  showAll?: boolean // If true, show all banners for this placement; otherwise show highest priority
}

export default function BannerSlot({
  banners,
  placement,
  className = "",
  showAll = false,
}: BannerSlotProps) {
  // Filter banners by placement
  const matchingBanners = banners
    .filter((b) => b.placement === placement)
    .sort((a, b) => b.priority - a.priority)

  if (matchingBanners.length === 0) {
    return null
  }

  const bannersToShow = showAll ? matchingBanners : [matchingBanners[0]]

  return (
    <div className={`banner-slot ${className}`}>
      {bannersToShow.map((banner) => (
        <BannerItem key={banner.id} banner={banner} />
      ))}
    </div>
  )
}

function BannerItem({ banner }: { banner: MarketingItem }) {
  const imageUrl = banner.image_desktop_url || banner.image_mobile_url

  const content = (
    <div className="relative w-full overflow-hidden rounded-lg group">
      {imageUrl ? (
        <div className="relative aspect-[3/1] md:aspect-[4/1]">
          <Image
            src={imageUrl}
            alt={banner.title || "Promotional banner"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100vw"
          />
          {/* Overlay with text if no image covers full banner */}
          {(banner.title || banner.message) && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="p-6 md:p-10 max-w-xl">
                {banner.title && (
                  <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                    {banner.title}
                  </h3>
                )}
                {banner.message && (
                  <p className="text-sm md:text-base text-white/90 mb-4">
                    {banner.message}
                  </p>
                )}
                {banner.cta_text && (
                  <span className="inline-block px-6 py-2.5 bg-[#F16D34] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#e05a20] transition-colors">
                    {banner.cta_text}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Text-only banner
        <div
          className="p-6 md:p-10"
          style={{
            backgroundColor: banner.background_color || "#1a1a1a",
            color: banner.text_color || "#ffffff",
          }}
        >
          {banner.title && (
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              {banner.title}
            </h3>
          )}
          {banner.message && (
            <p className="text-sm md:text-base opacity-90 mb-4">
              {banner.message}
            </p>
          )}
          {banner.cta_text && (
            <span className="inline-block px-6 py-2.5 bg-[#F16D34] text-white text-sm font-semibold uppercase tracking-wide">
              {banner.cta_text}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (banner.cta_url) {
    return (
      <Link href={banner.cta_url} className="block">
        {content}
      </Link>
    )
  }

  return content
}

// Export a server component wrapper for easy use
export function BannerSlotServer({
  banners,
  placement,
  className,
  showAll,
}: BannerSlotProps) {
  return (
    <BannerSlot
      banners={banners}
      placement={placement}
      className={className}
      showAll={showAll}
    />
  )
}
