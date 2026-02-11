"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

const CART_LIMIT = 49

type SelectedItemsContextType = {
  selectedItems: Set<string>
  toggleItem: (itemId: string, isOutOfStock?: boolean) => void
  selectAll: (itemIds: string[]) => void
  deselectAll: () => void
  removeSelectedItems: (itemIds: string[]) => void
  clearAllSelections: () => void // New method to completely clear
  isSelected: (itemId: string) => boolean
  hasSelectedItems: boolean
  selectedCount: number
  cartLimit: number
  isLoading: boolean
}

const SelectedItemsContext = createContext<SelectedItemsContextType | null>(
  null
)

export function SelectedItemsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // First, check sessionStorage (set by cart drawer when going to checkout)
      const sessionStored = sessionStorage.getItem("checkoutSelectedItems")
      if (sessionStored) {
        const parsed = JSON.parse(sessionStored)
        console.log(
          "Loading selected items from sessionStorage:",
          parsed.length
        )

        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedItems(new Set(parsed))
          // Also save to localStorage for persistence
          localStorage.setItem("selectedCartItems", sessionStored)
          console.log("Set selected items from sessionStorage:", parsed.length)
          setIsLoading(false)
          return
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem("selectedCartItems")
      console.log("Loading selected items from localStorage:", stored)

      if (stored) {
        const parsed = JSON.parse(stored)
        console.log("Parsed selected items:", parsed)

        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedItems(new Set(parsed))
          console.log("Set selected items:", parsed.length, "items")
        }
      }
    } catch (e) {
      console.error("Failed to parse selected items from storage", e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever selection changes
  useEffect(() => {
    if (!isLoading) {
      const itemsArray = Array.from(selectedItems)
      localStorage.setItem("selectedCartItems", JSON.stringify(itemsArray))
      console.log("Saved selected items to localStorage:", itemsArray)
    }
  }, [selectedItems, isLoading])

  const toggleItem = (itemId: string, isOutOfStock = false) => {
    // Don't allow selecting out-of-stock items
    if (isOutOfStock) return

    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const selectAll = (itemIds: string[]) => {
    setSelectedItems(new Set(itemIds))
  }

  const deselectAll = () => {
    setSelectedItems(new Set())
  }

  const removeSelectedItems = (itemIds: string[]) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      itemIds.forEach((id) => newSet.delete(id))
      return newSet
    })
  }

  const clearAllSelections = () => {
    setSelectedItems(new Set())
    sessionStorage.removeItem("checkoutSelectedItems")
    localStorage.removeItem("selectedCartItems")
    console.log("[Selected Items] Cleared all selections")
  }

  const isSelected = (itemId: string) => {
    return selectedItems.has(itemId)
  }

  const hasSelectedItems = selectedItems.size > 0
  const selectedCount = selectedItems.size

  return (
    <SelectedItemsContext.Provider
      value={{
        selectedItems,
        toggleItem,
        selectAll,
        deselectAll,
        removeSelectedItems,
        clearAllSelections,
        isSelected,
        hasSelectedItems,
        selectedCount,
        cartLimit: CART_LIMIT,
        isLoading,
      }}
    >
      {children}
    </SelectedItemsContext.Provider>
  )
}

export function useSelectedItems() {
  const context = useContext(SelectedItemsContext)
  if (!context) {
    throw new Error(
      "useSelectedItems must be used within SelectedItemsProvider"
    )
  }
  return context
}
