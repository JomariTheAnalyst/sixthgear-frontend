"use client"

import { useState, useTransition, useEffect } from "react"
import { addToWishlist, removeFromWishlist } from "@lib/data/wishlist"
import { useRouter } from "next/navigation"

type WishlistButtonProps = {
  variantId: string
  productId?: string
  isInWishlist?: boolean
  itemId?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export default function WishlistButton({
  variantId,
  productId,
  isInWishlist: initialIsInWishlist = false,
  itemId: initialItemId,
  size = "md",
  showLabel = false,
  className = "",
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialIsInWishlist)
  const [itemId, setItemId] = useState(initialItemId)
  const [isPending, startTransition] = useTransition()
  const [isAnimating, setIsAnimating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  // Check if item is in wishlist on mount
  useEffect(() => {
    async function checkWishlist() {
      try {
        // Fetch wishlist directly from client side
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist`,
          {
            credentials: "include",
            headers: {
              "x-publishable-api-key":
                process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const inList = data.wishlist?.items?.some(
            (item: any) => item.variant_id === variantId
          )
          setInWishlist(!!inList)

          // Also set itemId if found
          if (inList) {
            const item = data.wishlist.items.find(
              (i: any) => i.variant_id === variantId
            )
            if (item) {
              setItemId(item.id)
            }
          }
        }
      } catch (err) {
        console.error("Error checking wishlist:", err)
      } finally {
        setIsChecking(false)
      }
    }

    if (!initialIsInWishlist && !initialItemId) {
      checkWishlist()
    } else {
      setIsChecking(false)
    }
  }, [variantId, initialIsInWishlist, initialItemId])

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isPending || isChecking) return

    console.log("🔵 Wishlist button clicked", {
      variantId,
      productId,
      inWishlist,
      itemId,
    })

    setError(null)

    startTransition(async () => {
      try {
        if (inWishlist) {
          // Remove from wishlist
          // We need to fetch the wishlist to get the item ID
          console.log("🔴 Removing from wishlist")

          // If we don't have itemId, we need to find it
          if (!itemId) {
            const wishlist = await fetch(
              `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist`,
              {
                credentials: "include",
                headers: {
                  "x-publishable-api-key":
                    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
                },
              }
            ).then((r) => r.json())

            const item = wishlist.wishlist?.items?.find(
              (i: any) => i.variant_id === variantId
            )

            if (item) {
              const result = await removeFromWishlist(item.id)
              if (result.success) {
                setInWishlist(false)
                setItemId(undefined)
                router.refresh()
              } else {
                setError(result.message)
              }
            }
          } else {
            const result = await removeFromWishlist(itemId)
            if (result.success) {
              setInWishlist(false)
              setItemId(undefined)
              router.refresh()
            } else {
              setError(result.message)
            }
          }
        } else {
          // Add to wishlist with animation
          console.log("🟢 Adding to wishlist:", { variantId, productId })
          setIsAnimating(true)

          const result = await addToWishlist(variantId, productId)
          console.log("🟢 Add result:", result)

          if (result.success) {
            setInWishlist(true)
            setItemId(result.item?.id)
            // Animation completes after 600ms
            setTimeout(() => setIsAnimating(false), 600)
            router.refresh()
            console.log("✅ Added to wishlist successfully")
          } else {
            setIsAnimating(false)
            setError(result.message)
            console.error("❌ Add failed:", result.message)

            if (
              result.message.includes("log in") ||
              result.message.includes("Authentication")
            ) {
              // Redirect to login
              console.log("🔐 Redirecting to login")
              router.push("/login?redirect=/products")
            }
          }
        }
      } catch (err) {
        console.error("❌ Wishlist error:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
        setIsAnimating(false)
      }
    })
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full
          bg-white
          transition-all
          duration-200
          hover:scale-110
          ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
          group
          relative
          overflow-hidden
          shadow-sm
          hover:shadow-md
        `}
        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {/* Fill animation from bottom */}
        <div
          className={`
            absolute
            inset-0
            bg-gray-900
            transition-all
            duration-500
            ease-out
            ${
              inWishlist
                ? "translate-y-0"
                : "translate-y-full group-hover:translate-y-0"
            }
          `}
        />

        {/* Heart icon */}
        <svg
          className={`
            ${iconSizes[size]}
            relative
            z-10
            transition-all
            duration-300
            ${
              inWishlist
                ? "text-white fill-white scale-100"
                : "text-gray-400 group-hover:text-white"
            }
            ${isAnimating ? "animate-bounce" : ""}
          `}
          fill={inWishlist ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>

        {showLabel && (
          <span
            className={`
              ml-2
              text-sm
              font-medium
              relative
              z-10
              transition-colors
              ${
                inWishlist
                  ? "text-white"
                  : "text-gray-700 group-hover:text-white"
              }
            `}
          >
            {inWishlist ? "Saved" : "Save"}
          </span>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-600 whitespace-nowrap bg-white px-2 py-1 rounded shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  )
}
