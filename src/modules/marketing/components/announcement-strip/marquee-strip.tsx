"use client"

import { useState, useEffect } from "react"

interface MarqueeStripProps {
  messages?: string[]
  backgroundColor?: string
  textColor?: string
  speed?: number
}

const DEFAULT_MESSAGES = [
  "🎉 30% OFF on all motorcycle parts this January 2026!",
  "☕ Buy 2 Get 1 FREE on all coffee drinks - Limited time only!",
  "🏍️ FREE PMS check-up for new customers!",
  "🔥 Hot Deals: Premium riding gear up to 50% OFF!",
]

export default function MarqueeStrip({
  messages = DEFAULT_MESSAGES,
  backgroundColor = "#000000",
  textColor = "#FFFFFF",
  speed = 50,
}: MarqueeStripProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("sg_marquee_dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("sg_marquee_dismissed", "true")
    setIsDismissed(true)
  }

  if (isDismissed) {
    return null
  }

  // Duplicate messages for seamless loop
  const allMessages = [...messages, ...messages]

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="relative flex items-center h-10">
        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex whitespace-nowrap animate-marquee"
            style={{
              animationDuration: `${speed}s`,
            }}
          >
            {allMessages.map((message, index) => (
              <span
                key={index}
                className="inline-block px-8 text-sm font-medium"
                style={{ color: textColor }}
              >
                {message}
              </span>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Dismiss announcement"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: textColor }}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
