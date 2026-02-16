"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "oldest"

interface SortDropdownProps {
  currentSort?: SortOption
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
]

export default function SortDropdown({
  currentSort = "relevance",
}: SortDropdownProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams)

    if (sort === "relevance") {
      params.delete("sort")
    } else {
      params.set("sort", sort)
    }

    // Reset to page 1 when sort changes
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`)
  }

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Sort By"

  return (
    <div className="relative inline-block">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
