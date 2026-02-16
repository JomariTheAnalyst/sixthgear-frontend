"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import SortDropdown from "../sort-dropdown"
import ActiveFilters from "../active-filters"

interface Brand {
  id: string
  name: string
  handle: string
}

interface MeilisearchFiltersProps {
  categories: HttpTypes.StoreProductCategory[]
  brands?: Brand[]
}

// Common product tags
const AVAILABLE_TAGS = [
  { value: "Best Seller", label: "Best Seller" },
  { value: "Hot Deals", label: "Hot Deals" },
  { value: "New Arrival", label: "New Arrival" },
  { value: "Featured", label: "Featured" },
]

export default function MeilisearchFilters({
  categories,
  brands = [],
}: MeilisearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current filters from URL
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 100000,
  ])

  // Initialize from URL params
  useEffect(() => {
    const cats =
      searchParams.get("categories")?.split(",").filter(Boolean) || []
    const brandsList =
      searchParams.get("brands")?.split(",").filter(Boolean) || []
    const tagsList = searchParams.get("tags")?.split(",").filter(Boolean) || []
    const minPriceParam = parseInt(searchParams.get("minPrice") || "0")
    const maxPriceParam = parseInt(searchParams.get("maxPrice") || "100000")

    setSelectedCategories(cats)
    setSelectedBrands(brandsList)
    setSelectedTags(tagsList)
    setPriceRange([minPriceParam, maxPriceParam])
    setTempPriceRange([minPriceParam, maxPriceParam])
  }, [searchParams])

  const updateFilters = (
    newCategories: string[],
    newBrands: string[],
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

    // Update brands
    if (newBrands.length > 0) {
      params.set("brands", newBrands.join(","))
    } else {
      params.delete("brands")
    }

    // Update tags
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","))
    } else {
      params.delete("tags")
    }

    // Update price range
    if (newPriceRange[0] !== 0 || newPriceRange[1] !== 100000) {
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

  const toggleCategory = (categoryHandle: string) => {
    const newCategories = selectedCategories.includes(categoryHandle)
      ? selectedCategories.filter((c) => c !== categoryHandle)
      : [...selectedCategories, categoryHandle]
    setSelectedCategories(newCategories)
    updateFilters(newCategories, selectedBrands, selectedTags, priceRange)
  }

  const toggleBrand = (brandId: string) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((b) => b !== brandId)
      : [...selectedBrands, brandId]
    setSelectedBrands(newBrands)
    updateFilters(selectedCategories, newBrands, selectedTags, priceRange)
  }

  const toggleTag = (tagValue: string) => {
    const newTags = selectedTags.includes(tagValue)
      ? selectedTags.filter((t) => t !== tagValue)
      : [...selectedTags, tagValue]
    setSelectedTags(newTags)
    updateFilters(selectedCategories, selectedBrands, newTags, priceRange)
  }

  const applyPriceFilter = () => {
    setPriceRange(tempPriceRange)
    updateFilters(
      selectedCategories,
      selectedBrands,
      selectedTags,
      tempPriceRange
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedTags([])
    setPriceRange([0, 100000])
    setTempPriceRange([0, 100000])
    const params = new URLSearchParams(searchParams)
    params.delete("categories")
    params.delete("brands")
    params.delete("tags")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("sort")
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedTags.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100000

  const categoryOptions = categories.map((cat) => ({
    value: cat.handle,
    label: cat.name,
  }))

  const brandOptions = brands.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }))

  const currentSort = (searchParams.get("sort") as any) || "relevance"

  return (
    <div className="space-y-6">
      {/* Sort Dropdown */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
          Sort By
        </h3>
        <SortDropdown currentSort={currentSort} />
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <ActiveFilters
          categories={categoryOptions}
          brands={brandOptions}
          tags={AVAILABLE_TAGS}
        />
      )}

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
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.handle)}
                  onChange={() => toggleCategory(category.handle)}
                  className="w-4 h-4 text-[#F16D34] border-gray-300 rounded focus:ring-[#F16D34]"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
            Brands
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => toggleBrand(brand.id)}
                  className="w-4 h-4 text-[#F16D34] border-gray-300 rounded focus:ring-[#F16D34]"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {brand.name}
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
                value={tempPriceRange[0]}
                onChange={(e) =>
                  setTempPriceRange([
                    parseInt(e.target.value) || 0,
                    tempPriceRange[1],
                  ])
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F16D34] focus:border-transparent"
                placeholder="0"
              />
            </div>
            <span className="text-gray-400 mt-6">-</span>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={tempPriceRange[1]}
                onChange={(e) =>
                  setTempPriceRange([
                    tempPriceRange[0],
                    parseInt(e.target.value) || 100000,
                  ])
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F16D34] focus:border-transparent"
                placeholder="100000"
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full py-2 text-sm font-medium text-white bg-[#F16D34] rounded-lg hover:bg-[#d85a28] transition-colors"
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="pb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          Tags
        </h3>
        <div className="space-y-3">
          {AVAILABLE_TAGS.map((tag) => (
            <label
              key={tag.value}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.value)}
                onChange={() => toggleTag(tag.value)}
                className="w-4 h-4 text-[#F16D34] border-gray-300 rounded focus:ring-[#F16D34]"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {tag.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
