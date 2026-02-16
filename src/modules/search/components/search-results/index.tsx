"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { meilisearchClient, PRODUCT_INDEX_NAME } from "@lib/meilisearch-config"

interface SearchResultsProps {
  query: string
  onProductClick: (handle: string) => void
}

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string
  description?: string
  categories?: { name: string }[]
}

const SearchResults = ({ query, onProductClick }: SearchResultsProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 1) {
      setProducts([])
      return
    }

    const searchProducts = async () => {
      setLoading(true)
      try {
        const index = meilisearchClient.index(PRODUCT_INDEX_NAME)
        const results = await index.search(query, {
          limit: 10, // Limit to 10 results in modal
        })
        setProducts(results.hits as Product[])
      } catch (error) {
        console.error("Failed to search products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce
    const timer = setTimeout(searchProducts, 200)
    return () => clearTimeout(timer)
  }, [query])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="w-16 h-16 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No products found</p>
        <p className="text-xs mt-1">Try different keywords</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product.handle)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
          >
            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-[#F16D34] transition-colors">
                {product.title}
              </h4>
              {product.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {product.description}
                </p>
              )}
              {product.categories && product.categories.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {product.categories[0].name}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400 group-hover:text-[#F16D34] transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
      {products.length === 10 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Navigate to store page with query
              window.location.href = `/store?query=${encodeURIComponent(query)}`
            }}
            className="w-full text-center text-sm font-medium text-[#F16D34] hover:text-[#d85a28] transition-colors py-2"
          >
            View all results →
          </button>
        </div>
      )}
    </>
  )
}

export default SearchResults
