"use client"

import { useState, useEffect } from "react"
import { MarketingItem } from "@/types/marketing"

interface AnnouncementStripProps {
  item: MarketingItem | null
}

const DISMISS_PREFIX = "sg_strip_dismissed_"

// X icon as inline SVG
function XIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      style={style}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function AnnouncementStrip({ item }: AnnouncementStripProps) {
  const [isDismissed, setIsDismissed] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!item) {
      setIsDismissed(true)
      return
    }

    const dismissKey = `${DISMISS_PREFIX}${item.id}`
    const dismissed = localStorage.getItem(dismissKey)

    if (dismissed) {
      setIsDismissed(true)
    } else {
      setIsDismissed(false)
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [item])

  const handleDismiss = () => {
    if (!item) return

    const dismissKey = `${DISMISS_PREFIX}${item.id}`
    localStorage.setItem(dismissKey, "true")
    setIsVisible(false)
    setTimeout(() => setIsDismissed(true), 300)
  }

  if (!item || isDismissed) {
    return null
  }

  const bgColor = item.background_color || "#F16D34"
  const textColor = item.text_color || "#FFFFFF"

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-4">
        <p
          className="text-sm font-medium text-center flex-1"
          style={{ color: textColor }}
        >
          {item.message}
          {item.cta_text && item.cta_url && (
            <a
              href={item.cta_url}
              className="ml-2 underline underline-offset-2 hover:no-underline font-semibold"
              style={{ color: textColor }}
            >
              {item.cta_text}
            </a>
          )}
        </p>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-black/10 transition-colors flex-shrink-0"
          aria-label="Dismiss announcement"
        >
          <XIcon style={{ color: textColor }} />
        </button>
      </div>
    </div>
  )
}
