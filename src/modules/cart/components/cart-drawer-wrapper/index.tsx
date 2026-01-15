"use client"

import { ReactNode } from "react"
import { HttpTypes } from "@medusajs/types"
import { CartDrawerProvider } from "@lib/context/cart-drawer-context"
import CartDrawer from "@modules/cart/components/cart-drawer"

type CartDrawerWrapperProps = {
  children: ReactNode
  cart: HttpTypes.StoreCart | null
}

export default function CartDrawerWrapper({ children, cart }: CartDrawerWrapperProps) {
  return (
    <CartDrawerProvider>
      {children}
      <CartDrawer cart={cart} />
    </CartDrawerProvider>
  )
}
