"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react"
import CartLimitModal from "@modules/cart/components/cart-limit-modal"

type CartLimitModalContextType = {
  showCartLimitModal: (currentCount: number, limit: number) => void
}

const CartLimitModalContext = createContext<
  CartLimitModalContextType | undefined
>(undefined)

export function CartLimitModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentCount, setCurrentCount] = useState(0)
  const [limit, setLimit] = useState(49)

  const showCartLimitModal = useCallback((count: number, maxLimit: number) => {
    setCurrentCount(count)
    setLimit(maxLimit)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <CartLimitModalContext.Provider value={{ showCartLimitModal }}>
      {children}
      <CartLimitModal
        isOpen={isOpen}
        onClose={closeModal}
        currentCount={currentCount}
        limit={limit}
      />
    </CartLimitModalContext.Provider>
  )
}

export function useCartLimitModal() {
  const context = useContext(CartLimitModalContext)
  if (context === undefined) {
    throw new Error(
      "useCartLimitModal must be used within a CartLimitModalProvider"
    )
  }
  return context
}
