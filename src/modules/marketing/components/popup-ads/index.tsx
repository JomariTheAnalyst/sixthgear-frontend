"use client"

import { useState, useEffect, useCallback } from "react"
import { MarketingItem, PopupFrequency } from "@/types/marketing"
import Image from "next/image"
import Link from "next/link"

// X icon as inline SVG
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
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

interface PopupAdsProps {
  popups: MarketingItem[]
}

const POPUP_PREFIX = "sg_popup_"

function getStorageKey(popup: MarketingItem): string {
  return `${POPUP_PREFIX}${popup.dismiss_key || popup.id}`
}

function shouldShowPopup(popup: MarketingItem): boolean {
  const key = getStorageKey(popup)
  const frequency = popup.frequency || "once_session"

  if (frequency === "always") {
    return true
  }

  if (frequency === "once_session") {
    // Check sessionStorage
    const shown = sessionStorage.getItem(key)
    return !shown
  }

  if (frequency === "once_day") {
    // Check localStorage with timestamp
    const lastShown = localStorage.getItem(key)
    if (!lastShown) return true

    const lastDate = new Date(parseInt(lastShown))
    const now = new Date()
    // Check if it's a different day
    return (
      lastDate.getDate() !== now.getDate() ||
      lastDate.getMonth() !== now.getMonth() ||
      lastDate.getFullYear() !== now.getFullYear()
    )
  }

  return true
}

function markPopupShown(popup: MarketingItem): void {
  const key = getStorageKey(popup)
  const frequency = popup.frequency || "once_session"

  if (frequency === "once_session") {
    sessionStorage.setItem(key, "true")
  } else if (frequency === "once_day") {
    localStorage.setItem(key, Date.now().toString())
  }
}

export default function PopupAds({ popups }: PopupAdsProps) {
  const [activePopup, setActivePopup] = useState<MarketingItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (popups.length === 0) return

    // Find the first popup that should be shown (highest priority first)
    const sortedPopups = [...popups].sort((a, b) => b.priority - a.priority)
    const popupToShow = sortedPopups.find(shouldShowPopup)

    if (!popupToShow) return

    // Show popup after delay
    const delay = popupToShow.delay_ms || 2000
    const timer = setTimeout(() => {
      setActivePopup(popupToShow)
      markPopupShown(popupToShow)
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 50)
    }, delay)

    return () => clearTimeout(timer)
  }, [popups])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => setActivePopup(null), 300)
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePopup) {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [activePopup, handleClose])

  if (!activePopup) {
    return null
  }

  const imageUrl = activePopup.image_desktop_url || activePopup.image_mobile_url

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Popup Content */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          aria-label="Close popup"
        >
          <XIcon className="text-white" />
        </button>

        {/* Image */}
        {imageUrl && (
          <div className="relative aspect-[4/3]">
            <Image
              src={imageUrl}
              alt={activePopup.title || "Promotional popup"}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="p-6"
          style={{
            backgroundColor: !imageUrl
              ? activePopup.background_color || "#ffffff"
              : undefined,
            color: !imageUrl ? activePopup.text_color || "#1a1a1a" : undefined,
          }}
        >
          {activePopup.title && (
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {activePopup.title}
            </h3>
          )}
          {activePopup.message && (
            <p className="text-gray-600 mb-4">{activePopup.message}</p>
          )}
          {activePopup.cta_text && activePopup.cta_url && (
            <Link
              href={activePopup.cta_url}
              onClick={handleClose}
              className="inline-block w-full text-center px-6 py-3 bg-[#F16D34] text-white font-semibold uppercase tracking-wide hover:bg-[#e05a20] transition-colors rounded-lg"
            >
              {activePopup.cta_text}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
