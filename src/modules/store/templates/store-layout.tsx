"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import MeilisearchFilters from "@modules/store/components/meilisearch-filters"

interface Brand {
  id: string
  name: string
  handle: string
}

type StoreLayoutProps = {
  children: React.ReactNode
  sortBy?: SortOptions
  categories?: HttpTypes.StoreProductCategory[]
  brands?: Brand[]
  searchQuery?: string
}

export default function StoreLayout({
  children,
  sortBy,
  categories = [],
  brands = [],
  searchQuery,
}: StoreLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileDrawerOpen])

  // Close drawer on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMobileDrawerOpen])

  // Auto-close mobile drawer when URL changes (filter applied)
  useEffect(() => {
    setIsMobileDrawerOpen(false)
  }, [searchParams])

  // Clear search
  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("query")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pt-28">
      {/* Top Toolbar */}
      <div className="border-b border-gray-200 sticky top-20 z-30 bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Clear Search Button (if search is active) */}
            {searchQuery && (
              <>
                <button
                  onClick={handleClearSearch}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#F16D34] transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Clear search
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
              </>
            )}

            {/* Filter Toggle - Desktop toggles sidebar, Mobile opens drawer */}
            <button
              onClick={() => {
                // Mobile: open drawer
                if (window.innerWidth < 768) {
                  setIsMobileDrawerOpen(true)
                } else {
                  // Desktop: toggle sidebar
                  setIsSidebarOpen(!isSidebarOpen)
                }
              }}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-[#F16D34] transition-colors"
              aria-label="Toggle filters"
            >
              <span className="text-lg">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
              </span>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
            Filters
          </h2>
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Close filters"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100%-73px)] custom-scrollbar">
          <MeilisearchFilters categories={categories} brands={brands} />
        </div>
      </div>

      <div className="flex max-w-[1440px] mx-auto w-full flex-1">
        {/* Desktop Left Sidebar - Hidden on mobile */}
        <div
          className={`hidden md:block shrink-0 border-r border-gray-100 bg-white transition-all duration-300 ease-in-out overflow-hidden ${
            isSidebarOpen ? "w-[280px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="p-6 md:p-8 space-y-8 sticky top-36 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <MeilisearchFilters categories={categories} brands={brands} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 relative">{children}</div>
      </div>
    </div>
  )
}
