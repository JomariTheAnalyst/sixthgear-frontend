"use client"

import { useState, useEffect } from "react"
import { Clock, X } from "lucide-react"

interface RecentSearchesProps {
  onSearchClick: (query: string) => void
}

const RECENT_SEARCHES_KEY = "sixthgear_recent_searches"
const MAX_RECENT_SEARCHES = 8

export const getRecentSearches = (): string[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const addRecentSearch = (query: string) => {
  if (typeof window === "undefined") return

  const normalized = query.trim().toLowerCase()
  if (normalized.length < 2) return

  try {
    const recent = getRecentSearches()
    // Remove if already exists
    const filtered = recent.filter((q) => q !== normalized)
    // Add to beginning
    const updated = [normalized, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Failed to save recent search:", error)
  }
}

export const clearRecentSearches = () => {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch (error) {
    console.error("Failed to clear recent searches:", error)
  }
}

const RecentSearches = ({ onSearchClick }: RecentSearchesProps) => {
  const [searches, setSearches] = useState<string[]>([])

  useEffect(() => {
    setSearches(getRecentSearches())
  }, [])

  const handleClear = () => {
    clearRecentSearches()
    setSearches([])
  }

  const handleRemove = (query: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = searches.filter((q) => q !== query)
    setSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent searches</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-1">
        {searches.map((query) => (
          <button
            key={query}
            onClick={() => onSearchClick(query)}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{query}</span>
            </div>
            <button
              onClick={(e) => handleRemove(query, e)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </button>
        ))}
      </div>
      {searches.length > 0 && (
        <button
          onClick={handleClear}
          className="mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

export default RecentSearches
