"use client"

import { useState, useEffect } from "react"
import { meilisearchClient, PRODUCT_INDEX_NAME } from "@lib/meilisearch-config"
import { Search, Tag, Folder } from "lucide-react"

interface AutocompleteSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
}

interface Suggestion {
  type: "product" | "category" | "tag"
  text: string
  icon: React.ReactNode
}

export default function AutocompleteSuggestions({
  query,
  onSuggestionClick,
}: AutocompleteSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)

      try {
        const index = meilisearchClient.index(PRODUCT_INDEX_NAME)

        // Search for products, categories, and tags
        const results = await index.search(query, {
          limit: 10,
          attributesToRetrieve: ["title", "categories", "tags"],
        })

        const suggestionSet = new Set<string>()
        const newSuggestions: Suggestion[] = []

        // Add product titles
        results.hits.forEach((hit: any) => {
          if (hit.title && !suggestionSet.has(hit.title.toLowerCase())) {
            suggestionSet.add(hit.title.toLowerCase())
            newSuggestions.push({
              type: "product",
              text: hit.title,
              icon: <Search className="w-4 h-4 text-gray-400" />,
            })
          }
        })

        // Extract unique categories
        const categories = new Set<string>()
        results.hits.forEach((hit: any) => {
          if (hit.categories && Array.isArray(hit.categories)) {
            hit.categories.forEach((cat: any) => {
              if (cat.name && !suggestionSet.has(cat.name.toLowerCase())) {
                categories.add(cat.name)
              }
            })
          }
        })

        // Add category suggestions
        Array.from(categories)
          .slice(0, 3)
          .forEach((category) => {
            suggestionSet.add(category.toLowerCase())
            newSuggestions.push({
              type: "category",
              text: category,
              icon: <Folder className="w-4 h-4 text-blue-500" />,
            })
          })

        // Extract unique tags
        const tags = new Set<string>()
        results.hits.forEach((hit: any) => {
          if (hit.tags && Array.isArray(hit.tags)) {
            hit.tags.forEach((tag: any) => {
              const tagValue = typeof tag === "string" ? tag : tag.value
              if (tagValue && !suggestionSet.has(tagValue.toLowerCase())) {
                tags.add(tagValue)
              }
            })
          }
        })

        // Add tag suggestions
        Array.from(tags)
          .slice(0, 2)
          .forEach((tag) => {
            suggestionSet.add(tag.toLowerCase())
            newSuggestions.push({
              type: "tag",
              text: tag,
              icon: <Tag className="w-4 h-4 text-green-500" />,
            })
          })

        // Limit to 8 suggestions total
        setSuggestions(newSuggestions.slice(0, 8))
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce the search
    const timeoutId = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(timeoutId)
  }, [query])

  if (!query || query.length < 2) {
    return null
  }

  if (loading) {
    return (
      <div className="py-2">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span>Searching...</span>
        </div>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className="py-2">
        <div className="px-3 py-2 text-sm text-gray-500">
          No suggestions found
        </div>
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="text-xs font-medium text-gray-500 px-3 mb-2">
        Suggestions
      </div>
      <div className="space-y-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.type}-${index}`}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left group"
          >
            <span className="flex-shrink-0">{suggestion.icon}</span>
            <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
              {suggestion.text}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {suggestion.type}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
