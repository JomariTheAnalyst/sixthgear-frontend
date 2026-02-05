"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import { X } from "@medusajs/icons"

type CartLimitModalProps = {
  isOpen: boolean
  onClose: () => void
  currentCount: number
  limit: number
}

const CartLimitModal = ({
  isOpen,
  onClose,
  currentCount,
  limit,
}: CartLimitModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ui-fg-muted hover:text-ui-fg-base"
        >
          <X />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-4">
          <Heading level="h2" className="text-xl">
            Cart Limit Reached
          </Heading>

          <Text className="text-ui-fg-subtle">
            You have reached the maximum cart limit of {limit} items. Your cart
            currently has {currentCount} items.
          </Text>

          <Text className="text-ui-fg-subtle">
            Please remove some items from your cart before adding more.
          </Text>

          <Button onClick={onClose} className="w-full mt-2">
            Got it
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CartLimitModal
