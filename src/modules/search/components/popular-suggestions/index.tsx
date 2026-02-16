"use client"

import { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"

interface PopularSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
}

interface Suggestion {
  query: string
  count: number
}

const PopularSuggestions = ({
  query,
  onSuggestionClick,
}: PopularSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 1) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const url = `${
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
        }/store/search/suggestions?q=${encodeURIComponent(query)}&limit=8`

        console.log("Fetching suggestions from:", url)

        const response = await fetch(url)

        console.log("Suggestions response status:", response.status)

        if (!response.ok) {
          console.error("Suggestions API error:", response.statusText)
          setSuggestions([])
          return
        }

        const data = await response.json()
        console.log("Suggestions data:", data)

        setSuggestions(data.suggestions || [])
      } catch (error) {
        console.error("Failed to fetch suggestions:", error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce
    const timer = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(timer)
  }, [query])

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-400">
        <p className="text-sm">Loading suggestions...</p>
      </div>
    )
  }

  if (suggestions.length === 0 && !loading) {
    return (
      <div className="text-center py-4 text-gray-400">
        <p className="text-sm">No suggestions yet</p>
        <p className="text-xs mt-1">
          Search and click products to build suggestions
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.query}
          onClick={() => onSuggestionClick(suggestion.query)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TrendingUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate">
              {suggestion.query}
            </span>
          </div>
          <span className="text-xs text-gray-400">{suggestion.count}</span>
        </button>
      ))}
    </div>
  )
}

export default PopularSuggestions
