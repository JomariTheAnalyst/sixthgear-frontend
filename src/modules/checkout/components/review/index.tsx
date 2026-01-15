"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              !isOpen ? "bg-gray-300 text-gray-500" : "bg-gray-900 text-white"
            }`}
          >
            4
          </div>
          <Heading
            level="h2"
            className={clx("text-lg font-semibold", {
              "text-gray-400": !isOpen,
              "text-gray-900": isOpen,
            })}
          >
            Review & Place Order
          </Heading>
        </div>
      </div>

      {isOpen && previousStepsCompleted && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Text className="text-sm text-gray-600 leading-relaxed">
              By clicking the Place Order button, you confirm that you have
              read, understand and accept our Terms of Use, Terms of Sale and
              Returns Policy and acknowledge that you have read Sixthgear&apos;s
              Privacy Policy.
            </Text>
          </div>

          <PaymentButton
            cart={cart}
            data-testid="submit-order-button"
            className="w-full h-14 bg-[#F16D34] hover:bg-[#d55a24] text-white font-bold uppercase tracking-wider rounded-lg transition-colors"
          />
        </div>
      )}
    </div>
  )
}

export default Review
