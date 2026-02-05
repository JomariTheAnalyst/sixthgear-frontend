"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Client component to force refresh cart after order completion
 * This ensures the cart drawer shows empty immediately
 */
export default function CartRefresh() {
  const router = useRouter()

  useEffect(() => {
    // Force refresh to clear cart from UI
    router.refresh()
  }, [router])

  return null
}
