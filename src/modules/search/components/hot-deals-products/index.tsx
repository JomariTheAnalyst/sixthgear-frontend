"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { meilisearchClient, PRODUCT_INDEX_NAME } from "@lib/meilisearch-config"

interface HotDealsProductsProps {
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

const HotDealsProducts = ({ onProductClick }: HotDealsProductsProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        const index = meilisearchClient.index(PRODUCT_INDEX_NAME)

        // First, let's try to get all products to see what's available
        const allResults = await index.search("", {
          limit: 100,
        })

        console.log("All products in index:", allResults.hits.length)
        console.log("Sample product:", allResults.hits[0])

        // Now filter for Hot Deals
        const results = await index.search("", {
          filter: 'tags.value = "Hot Deals"',
          limit: 12,
        })

        console.log("Hot Deals products found:", results.hits.length)
        console.log("Hot Deals products:", results.hits)

        setProducts(results.hits as Product[])
      } catch (error) {
        console.error("Failed to fetch hot deals:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchHotDeals()
  }, [])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      return () => container.removeEventListener("scroll", checkScrollButtons)
    }
  }, [products])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="flex gap-3 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 animate-pulse bg-gray-100 rounded-lg h-48"
            />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No hot deals available</p>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product.handle)}
            className="flex-shrink-0 w-40 flex flex-col gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group/item"
          >
            <div className="relative w-full aspect-square bg-gray-100 rounded overflow-hidden">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover group-hover/item:scale-105 transition-transform duration-200"
                  sizes="160px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
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
            <div>
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover/item:text-[#F16D34] transition-colors">
                {product.title}
              </h4>
              {product.categories && product.categories.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {product.categories[0].name}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default HotDealsProducts
