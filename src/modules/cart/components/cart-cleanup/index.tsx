"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Cart Cleanup Component
 *
 * Removes shipping methods from cart when user leaves checkout page
 * This prevents shipping fees from persisting in cart total
 */
export default function CartCleanup({ cartId }: { cartId?: string }) {
  const pathname = usePathname()

  useEffect(() => {
    // Only run cleanup if we have a cart and we're NOT on checkout pages
    if (!cartId || pathname?.includes("/checkout")) {
      return
    }

    // Remove shipping methods from cart when leaving checkout
    const cleanupCart = async () => {
      try {
        console.log("[Cart Cleanup] Removing shipping methods from cart...")

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key":
                process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
            body: JSON.stringify({
              shipping_methods: [], // Clear shipping methods
            }),
          }
        )

        if (response.ok) {
          console.log("[Cart Cleanup] ✅ Shipping methods removed")
        }
      } catch (error) {
        console.error("[Cart Cleanup] Failed to cleanup cart:", error)
      }
    }

    // Run cleanup after a short delay to avoid race conditions
    const timer = setTimeout(cleanupCart, 1000)

    return () => clearTimeout(timer)
  }, [cartId, pathname])

  return null
}
