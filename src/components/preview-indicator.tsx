"use client"

import { useEffect, useState } from "react"

/**
 * Preview Mode Indicator
 *
 * Shows a banner when Draft Mode is enabled.
 * Provides a button to exit preview mode.
 */
export function PreviewIndicator() {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    // Check if we're in preview mode by checking for the draft mode cookie
    const isDraft = document.cookie.includes("__prerender_bypass")
    setIsPreview(isDraft)
  }, [])

  if (!isPreview) {
    return null
  }

  const exitPreview = async () => {
    try {
      await fetch("/api/exit-preview")
      window.location.reload()
    } catch (error) {
      console.error("Failed to exit preview mode:", error)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-orange-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span className="font-semibold">Preview Mode</span>
        <span className="text-sm opacity-90">
          You are viewing draft content
        </span>
      </div>
      <button
        onClick={exitPreview}
        className="px-4 py-1 bg-white text-orange-500 rounded font-medium hover:bg-gray-100 transition-colors"
      >
        Exit Preview
      </button>
    </div>
  )
}
