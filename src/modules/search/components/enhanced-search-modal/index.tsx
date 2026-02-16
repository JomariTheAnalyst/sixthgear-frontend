"use client"

import { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, Search, Clock, TrendingUp, Flame } from "lucide-react"
import { useRouter } from "next/navigation"
import RecentSearches, { addRecentSearch } from "../recent-searches"
import PopularSuggestions from "../popular-suggestions"
import HotDealsProducts from "../hot-deals-products"
import SearchResults from "../search-results"
import AutocompleteSuggestions from "../autocomplete-suggestions"

interface EnhancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const EnhancedSearchModal = ({ isOpen, onClose }: EnhancedSearchModalProps) => {
  const [query, setQuery] = useState("")
  const router = useRouter()

  // Reset query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
    }
  }, [isOpen])

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
  }

  const handleSearchSubmit = () => {
    if (query.trim()) {
      // Save to recent searches
      addRecentSearch(query)
      // Track search
      trackSearch(query)
      // Navigate to store page with query
      router.push(`/store?query=${encodeURIComponent(query.trim())}`)
      // Close modal
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    // Save to recent searches
    addRecentSearch(suggestion)
    // Track search
    trackSearch(suggestion)
  }

  const handleProductClick = (handle: string) => {
    // Track search if there's a query
    if (query.trim()) {
      addRecentSearch(query)
      trackSearch(query)
    }
    // Navigate to product
    router.push(`/products/${handle}`)
    onClose()
  }

  const trackSearch = async (searchQuery: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/search/track`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        }
      )
    } catch (error) {
      console.error("Failed to track search:", error)
    }
  }

  const isSearching = query.trim().length > 0

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                {/* Search Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search for products..."
                      className="flex-1 border-0 focus:ring-0 text-base placeholder-gray-400 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="flex max-h-[60vh]">
                  {/* Left Column: Suggestions */}
                  <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                    {isSearching ? (
                      <>
                        {/* Autocomplete Suggestions */}
                        <div className="border-b border-gray-200">
                          <AutocompleteSuggestions
                            query={query}
                            onSuggestionClick={handleSuggestionClick}
                          />
                        </div>
                        {/* Popular Suggestions */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-medium text-gray-700">
                              Popular Suggestions
                            </h3>
                          </div>
                          <PopularSuggestions
                            query={query}
                            onSuggestionClick={handleSuggestionClick}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <h3 className="text-sm font-medium text-gray-700">
                            Recent Searches
                          </h3>
                        </div>
                        <RecentSearches onSearchClick={handleSuggestionClick} />
                      </div>
                    )}
                  </div>

                  {/* Right Column: Products */}
                  <div className="flex-1 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Search Results
                        </h3>
                        <SearchResults
                          query={query}
                          onProductClick={handleProductClick}
                        />
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <h3 className="text-sm font-medium text-gray-700">
                            Hot Right Now
                          </h3>
                        </div>
                        <HotDealsProducts onProductClick={handleProductClick} />
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EnhancedSearchModal
