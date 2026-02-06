"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Client component to refresh cart after order completion
 * Single refresh is sufficient as cart cookie is already cleared server-side
 */
export default function CartRefresh() {
  const router = useRouter()

  useEffect(() => {
    // Single refresh to update client-side cache
    // Cart cookie is already cleared server-side in success page
    router.refresh()
  }, [])

  return null
}
