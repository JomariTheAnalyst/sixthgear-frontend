"use client"

import { HttpTypes } from "@medusajs/types"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const { openCart } = useCartDrawer()
  const pathname = usePathname()
  
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const itemRef = useRef<number>(totalItems || 0)

  // Auto-open drawer when items are added (not on cart page)
  useEffect(() => {
    if (itemRef.current !== totalItems && totalItems > itemRef.current && !pathname.includes("/cart")) {
      openCart()
    }
    itemRef.current = totalItems
  }, [totalItems, pathname, openCart])

  return (
    <div className="h-full z-50 flex items-center">
      <button
        onClick={openCart}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
        data-testid="nav-cart-link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>
    </div>
  )
}

export default CartDropdown
