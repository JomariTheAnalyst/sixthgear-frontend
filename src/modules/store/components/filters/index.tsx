"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FiltersProps {
  categories: FilterOption[]
  tags: FilterOption[]
  minPrice?: number
  maxPrice?: number
}

export default function Filters({
  categories,
  tags,
  minPrice = 0,
  maxPrice = 100000,
}: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current filters from URL
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Initialize from URL params
  useEffect(() => {
    const cats =
      searchParams.get("categories")?.split(",").filter(Boolean) || []
    const tagsList = searchParams.get("tags")?.split(",").filter(Boolean) || []
    const minPriceParam = parseInt(
      searchParams.get("minPrice") || String(minPrice)
    )
    const maxPriceParam = parseInt(
      searchParams.get("maxPrice") || String(maxPrice)
    )

    setSelectedCategories(cats)
    setSelectedTags(tagsList)
    setPriceRange([minPriceParam, maxPriceParam])
  }, [searchParams, minPrice, maxPrice])

  const updateFilters = (
    newCategories: string[],
    newTags: string[],
    newPriceRange: [number, number]
  ) => {
    const params = new URLSearchParams(searchParams)

    // Update categories
    if (newCategories.length > 0) {
      params.set("categories", newCategories.join(","))
    } else {
      params.delete("categories")
    }

    // Update tags
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","))
    } else {
      params.delete("tags")
    }

    // Update price range
    if (newPriceRange[0] !== minPrice || newPriceRange[1] !== maxPrice) {
      params.set("minPrice", String(newPriceRange[0]))
      params.set("maxPrice", String(newPriceRange[1]))
    } else {
      params.delete("minPrice")
      params.delete("maxPrice")
    }

    // Reset to page 1 when filters change
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    updateFilters(newCategories, selectedTags, priceRange)
  }

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(newTags)
    updateFilters(selectedCategories, newTags, priceRange)
  }

  const applyPriceFilter = () => {
    updateFilters(selectedCategories, selectedTags, priceRange)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedTags([])
    setPriceRange([minPrice, maxPrice])
    router.push(pathname)
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTags.length > 0 ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
            Categories
          </h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => toggleCategory(category.value)}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {category.label}
                  {category.count !== undefined && (
                    <span className="ml-2 text-gray-400">
                      ({category.count})
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          Price Range
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <span className="text-gray-400 mt-6">-</span>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value) || maxPrice,
                  ])
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder={String(maxPrice)}
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <div className="pb-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
            Tags
          </h3>
          <div className="space-y-3">
            {tags.map((tag) => (
              <label
                key={tag.value}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.value)}
                  onChange={() => toggleTag(tag.value)}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {tag.label}
                  {tag.count !== undefined && (
                    <span className="ml-2 text-gray-400">({tag.count})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-4">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2"
        >
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {selectedCategories.length + selectedTags.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
