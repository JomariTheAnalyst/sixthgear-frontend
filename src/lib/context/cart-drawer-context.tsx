"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

type CartDrawerContextType = {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined)

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

  return (
    <CartDrawerContext.Provider value={{ isCartOpen, openCart, closeCart, toggleCart }}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  const context = useContext(CartDrawerContext)
  if (context === undefined) {
    throw new Error("useCartDrawer must be used within a CartDrawerProvider")
  }
  return context
}
