"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import { HttpTypes } from "@medusajs/types"

/**
 * Wishlist Data Layer
 * Server actions for managing customer wishlists
 */

export type WishlistItem = {
  id: string
  wishlist_id: string
  variant_id: string
  product_id: string | null
  created_at: string
  updated_at: string
}

export type Wishlist = {
  id: string
  customer_id: string
  created_at: string
  updated_at: string
  items: WishlistItem[]
}

/**
 * Get customer's wishlist
 * Returns null if not authenticated
 */
export async function getWishlist(): Promise<Wishlist | null> {
  const headers = {
    ...(await getAuthHeaders()),
    "x-publishable-api-key":
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist`,
      {
        method: "GET",
        headers,
        credentials: "include",
        next: {
          tags: ["wishlist"],
        },
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        return null // Not authenticated
      }
      throw new Error(`Failed to fetch wishlist: ${response.statusText}`)
    }

    const data = await response.json()
    return data.wishlist
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return null
  }
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(
  variantId: string,
  productId?: string
): Promise<{ success: boolean; message: string; item?: WishlistItem }> {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
    "x-publishable-api-key":
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist/items`,
      {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          variant_id: variantId,
          product_id: productId,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to add item to wishlist",
      }
    }

    // Revalidate wishlist cache
    return {
      success: true,
      message: data.message,
      item: data.item,
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return {
      success: false,
      message: "An error occurred while adding to wishlist",
    }
  }
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(
  itemId: string
): Promise<{ success: boolean; message: string }> {
  const headers = {
    ...(await getAuthHeaders()),
    "x-publishable-api-key":
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist/items/${itemId}`,
      {
        method: "DELETE",
        headers,
        credentials: "include",
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to remove item from wishlist",
      }
    }

    return {
      success: true,
      message: data.message,
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return {
      success: false,
      message: "An error occurred while removing from wishlist",
    }
  }
}

/**
 * Clear entire wishlist
 */
export async function clearWishlist(): Promise<{
  success: boolean
  message: string
  removed_count?: number
}> {
  const headers = {
    ...(await getAuthHeaders()),
    "x-publishable-api-key":
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/wishlist/clear`,
      {
        method: "DELETE",
        headers,
        credentials: "include",
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to clear wishlist",
      }
    }

    return {
      success: true,
      message: data.message,
      removed_count: data.removed_count,
    }
  } catch (error) {
    console.error("Error clearing wishlist:", error)
    return {
      success: false,
      message: "An error occurred while clearing wishlist",
    }
  }
}

/**
 * Check if a variant is in the wishlist
 */
export async function isInWishlist(variantId: string): Promise<boolean> {
  try {
    const wishlist = await getWishlist()
    if (!wishlist) return false

    return wishlist.items.some((item) => item.variant_id === variantId)
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return false
  }
}

/**
 * Get wishlist item count
 */
export async function getWishlistCount(): Promise<number> {
  const wishlist = await getWishlist()
  return wishlist?.items?.length || 0
}
