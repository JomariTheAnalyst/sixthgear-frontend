"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type SelectedItemsContextType = {
  selectedItems: Set<string>
  toggleItem: (itemId: string) => void
  selectAll: (itemIds: string[]) => void
  deselectAll: () => void
  isSelected: (itemId: string) => boolean
  hasSelectedItems: boolean
  selectedCount: number
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

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("selectedCartItems")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSelectedItems(new Set(parsed))
      } catch (e) {
        console.error("Failed to parse selected items from localStorage", e)
      }
    }
  }, [])

  // Save to localStorage whenever selection changes
  useEffect(() => {
    localStorage.setItem(
      "selectedCartItems",
      JSON.stringify(Array.from(selectedItems))
    )
  }, [selectedItems])

  const toggleItem = (itemId: string) => {
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
        isSelected,
        hasSelectedItems,
        selectedCount,
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
