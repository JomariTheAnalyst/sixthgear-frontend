"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

interface SearchHitProps {
  hit: any
  onClose: () => void
}

const SearchHit = ({ hit, onClose }: SearchHitProps) => {
  const router = useRouter()

  const handleClick = () => {
    // Navigate to product page
    router.push(`/products/${hit.handle}`)
    onClose()
  }

  // Get thumbnail URL
  const thumbnailUrl = hit.thumbnail || "/placeholder-product.png"

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
    >
      {/* Product Image */}
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {hit.thumbnail ? (
          <Image
            src={thumbnailUrl}
            alt={hit.title || "Product"}
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

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-[#F16D34] transition-colors">
          {hit.title || "Untitled Product"}
        </h3>
        {hit.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
            {hit.description}
          </p>
        )}
        {hit.categories && hit.categories.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">
              {hit.categories[0].name}
            </span>
          </div>
        )}
      </div>

      {/* Arrow Icon */}
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
  )
}

export default SearchHit
