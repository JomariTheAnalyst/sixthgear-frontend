"use client"

import Link from "next/link"

// Eye icon as inline SVG
function EyeIcon({ className }: { className?: string }) {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

// X icon as inline SVG
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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

interface PreviewBannerProps {
  isPreview: boolean
}

export default function PreviewBanner({ isPreview }: PreviewBannerProps) {
  if (!isPreview) return null

  return (
    <div className="fixed bottom-4 left-4 z-[300] bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
      <EyeIcon className="flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold">Preview Mode</p>
        <p className="text-xs opacity-80">You&apos;re viewing draft content</p>
      </div>
      <Link
        href="/api/exit-preview"
        className="p-1.5 hover:bg-white/20 rounded transition-colors"
        title="Exit preview"
      >
        <XIcon />
      </Link>
    </div>
  )
}
