"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreFilters from "@modules/store/components/store-filters"

const mockBrands = [
  "Gille",
  "Gold Runway",
  "Memory PH",
  "Motohub Philippines",
  "Motul",
  "Dri+",
  "Q815 Clothing",
  "SEC",
]

type StoreLayoutProps = {
  children: React.ReactNode
  sortBy?: SortOptions
  categories?: HttpTypes.StoreProductCategory[]
}

export default function StoreLayout({
  children,
  sortBy,
  categories = [],
}: StoreLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Handle Sort Change with transition
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value as SortOptions
    const params = new URLSearchParams(searchParams)
    params.set("sortBy", newSortBy)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pt-28">
      {/* Top Toolbar */}
      <div className="border-b border-gray-200 sticky top-20 z-30 bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Filter Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-[#F16D34] transition-colors"
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

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300 hidden md:block"></div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 hidden md:inline">
                Sort by:
              </span>
              <select
                value={sortBy || "created_at"}
                onChange={handleChange}
                className="text-sm font-semibold text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer py-0 pl-0 pr-8"
              >
                <option value="created_at">All Products</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="created_at_desc">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 hidden md:inline">
              View as
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "list"
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-400 hover:text-gray-600"
                }`}
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
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "grid"
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-400 hover:text-gray-600"
                }`}
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
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-[1440px] mx-auto w-full flex-1">
        {/* Left Sidebar */}
        <div
          className={`shrink-0 border-r border-gray-100 bg-white transition-all duration-300 ease-in-out overflow-hidden ${
            isSidebarOpen ? "w-[280px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="p-6 md:p-8 space-y-8 sticky top-36 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            {/* Search */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">
                Search
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#F16D34] focus:border-[#F16D34]"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Shop by Brand */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm flex justify-between items-center group cursor-pointer">
                Shop by Brand
                <span className="text-gray-400 group-hover:text-gray-600">
                  -
                </span>
              </h3>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {mockBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedBrand(selectedBrand === brand ? null : brand)
                    }}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrand === brand}
                        readOnly
                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:bg-[#F16D34] checked:border-transparent transition-all"
                      />
                      <svg
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        selectedBrand === brand
                          ? "text-gray-900 font-medium"
                          : "text-gray-600 group-hover:text-gray-900"
                      }`}
                    >
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories - Real data from Medusa */}
            <StoreFilters categories={categories} />

            {/* Size Mock */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">
                Size
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                  <button
                    key={size}
                    className="border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:border-[#F16D34] hover:text-[#F16D34] transition-colors rounded"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 relative">
          {/* Loading overlay */}
          {isPending && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <span className="w-5 h-5 border-2 border-[#F16D34] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
