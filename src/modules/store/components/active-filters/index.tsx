"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface ActiveFiltersProps {
  categories?: { value: string; label: string }[]
  brands?: { value: string; label: string }[]
  tags?: { value: string; label: string }[]
}

export default function ActiveFilters({
  categories = [],
  brands = [],
  tags = [],
}: ActiveFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedCategories =
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  const selectedBrands =
    searchParams.get("brands")?.split(",").filter(Boolean) || []
  const selectedTags =
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")

  const removeFilter = (
    type: "category" | "brand" | "tag" | "price",
    value?: string
  ) => {
    const params = new URLSearchParams(searchParams)

    if (type === "category" && value) {
      const newCategories = selectedCategories.filter((c) => c !== value)
      if (newCategories.length > 0) {
        params.set("categories", newCategories.join(","))
      } else {
        params.delete("categories")
      }
    } else if (type === "brand" && value) {
      const newBrands = selectedBrands.filter((b) => b !== value)
      if (newBrands.length > 0) {
        params.set("brands", newBrands.join(","))
      } else {
        params.delete("brands")
      }
    } else if (type === "tag" && value) {
      const newTags = selectedTags.filter((t) => t !== value)
      if (newTags.length > 0) {
        params.set("tags", newTags.join(","))
      } else {
        params.delete("tags")
      }
    } else if (type === "price") {
      params.delete("minPrice")
      params.delete("maxPrice")
    }

    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("categories")
    params.delete("brands")
    params.delete("tags")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedTags.length > 0 ||
    minPrice ||
    maxPrice

  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-gray-700">Active Filters:</span>

      {/* Category Chips */}
      {selectedCategories.map((catValue) => {
        const category = categories.find((c) => c.value === catValue)
        return (
          <button
            key={catValue}
            onClick={() => removeFilter("category", catValue)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            <span>{category?.label || catValue}</span>
            <svg
              className="w-4 h-4"
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
        )
      })}

      {/* Brand Chips */}
      {selectedBrands.map((brandValue) => {
        const brand = brands.find((b) => b.value === brandValue)
        return (
          <button
            key={brandValue}
            onClick={() => removeFilter("brand", brandValue)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            <span>{brand?.label || brandValue}</span>
            <svg
              className="w-4 h-4"
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
        )
      })}

      {/* Tag Chips */}
      {selectedTags.map((tagValue) => {
        const tag = tags.find((t) => t.value === tagValue)
        return (
          <button
            key={tagValue}
            onClick={() => removeFilter("tag", tagValue)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            <span>{tag?.label || tagValue}</span>
            <svg
              className="w-4 h-4"
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
        )
      })}

      {/* Price Chip */}
      {(minPrice || maxPrice) && (
        <button
          onClick={() => removeFilter("price")}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
        >
          <span>
            ₱{minPrice || "0"} - ₱{maxPrice || "∞"}
          </span>
          <svg
            className="w-4 h-4"
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
      )}

      {/* Clear All Button */}
      <button
        onClick={clearAll}
        className="ml-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
      >
        Clear All
      </button>
    </div>
  )
}
