"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"

/**
 * Client component to refresh cart after order completion
 * Single refresh is sufficient as cart cookie is already cleared server-side
 * Also clears selected items from localStorage/sessionStorage
 */
export default function CartRefresh() {
  const router = useRouter()
  const { clearAllSelections } = useSelectedItems()
  const hasRun = useRef(false)

  useEffect(() => {
    // Only run once
    if (hasRun.current) return
    hasRun.current = true

    // Clear selected items from localStorage and sessionStorage
    clearAllSelections()
    sessionStorage.removeItem("checkoutSelectedItems")
    console.log("[Cart Refresh] Cleared selected items after order completion")

    // Single refresh to update client-side cache
    // Cart cookie is already cleared server-side in success page
    router.refresh()
  }, []) // Empty deps - only run once on mount

  return null
}
