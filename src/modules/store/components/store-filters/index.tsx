"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition, useState, useEffect } from "react"

type StoreFiltersProps = {
  categories: HttpTypes.StoreProductCategory[]
}

export default function StoreFilters({ categories }: StoreFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for instant UI feedback - synced with URL
  const urlCategory = searchParams.get("category")
  const [optimisticCategory, setOptimisticCategory] = useState<string | null>(
    urlCategory
  )

  // Sync local state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setOptimisticCategory(urlCategory)
  }, [urlCategory])

  const handleCategoryChange = useCallback(
    (categoryHandle: string | null) => {
      // Immediately update local state for instant UI feedback
      const cleanHandle =
        categoryHandle && categoryHandle.startsWith("/")
          ? categoryHandle.slice(1)
          : categoryHandle
      setOptimisticCategory(cleanHandle)

      // Build new URL params
      const params = new URLSearchParams(searchParams.toString())

      if (cleanHandle) {
        params.set("category", cleanHandle)
      } else {
        params.delete("category")
      }

      // Reset to page 1 when changing category
      params.delete("page")

      // Use startTransition to mark the navigation as non-blocking
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router, searchParams, startTransition]
  )

  // Sort categories alphabetically by name
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  // Helper to check if category is selected (uses optimistic state for instant feedback)
  const isCategorySelected = (handle: string) => {
    if (!optimisticCategory) return false
    const cleanHandle = handle.startsWith("/") ? handle.slice(1) : handle
    return optimisticCategory === cleanHandle || optimisticCategory === handle
  }

  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm flex items-center gap-2">
        Categories
        {isPending && (
          <span className="inline-block w-4 h-4 border-2 border-[#F16D34] border-t-transparent rounded-full animate-spin" />
        )}
      </h3>
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {/* All Products option */}
        <label
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleCategoryChange(null)}
        >
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={!optimisticCategory}
              readOnly
              className="peer appearance-none w-5 h-5 border border-gray-300 rounded-sm checked:bg-[#F16D34] checked:border-transparent transition-all"
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
              !optimisticCategory
                ? "text-gray-900 font-medium"
                : "text-gray-600 group-hover:text-gray-900"
            }`}
          >
            All Products
          </span>
        </label>

        {/* All categories from Medusa */}
        {sortedCategories.map((cat) => (
          <label
            key={cat.id}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleCategoryChange(cat.handle)}
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={isCategorySelected(cat.handle)}
                readOnly
                className="peer appearance-none w-5 h-5 border border-gray-300 rounded-sm checked:bg-[#F16D34] checked:border-transparent transition-all"
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
                isCategorySelected(cat.handle)
                  ? "text-gray-900 font-medium"
                  : "text-gray-600 group-hover:text-gray-900"
              }`}
            >
              {cat.name}
            </span>
          </label>
        ))}

        {/* Show message if no categories */}
        {categories.length === 0 && (
          <p className="text-sm text-gray-400 italic">No categories found</p>
        )}
      </div>
    </div>
  )
}
