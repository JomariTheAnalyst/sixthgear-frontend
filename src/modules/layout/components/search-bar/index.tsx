"use client"

import { useState } from "react"
import EnhancedSearchModal from "@modules/search/components/enhanced-search-modal"

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <div className="relative w-full max-w-[200px] lg:max-w-[420px]">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center group"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400 group-hover:text-[#F16D34] transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <div className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-500 text-left text-sm transition-all duration-200 hover:border-[#F16D34] hover:shadow-sm cursor-pointer group-hover:bg-gray-50">
            <span className="hidden lg:inline">
              Search helmets, gloves, jackets...
            </span>
            <span className="lg:hidden">Search products...</span>
          </div>
        </button>
      </div>

      <EnhancedSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}

export default SearchBar
