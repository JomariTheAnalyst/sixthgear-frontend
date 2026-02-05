"use client"

import { useEffect } from "react"
import { updateCart } from "@lib/data/cart"

export default function ClearPromotionsOnLoad() {
  useEffect(() => {
    // Clear all promotion codes when page loads/refreshes
    const clearPromotions = async () => {
      try {
        await updateCart({ promo_codes: [] })
      } catch (error) {
        console.error("Failed to clear promotions:", error)
      }
    }

    clearPromotions()
  }, [])

  return null
}
