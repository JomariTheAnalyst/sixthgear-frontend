"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Always open by default - no need to click edit
  const isOpen = true

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-sm ${
              cart?.shipping_address
                ? "bg-green-500 text-white"
                : "bg-[#F16D34] text-white"
            }`}
          >
            {cart?.shipping_address ? (
              <CheckCircleSolid className="w-6 h-6" />
            ) : (
              "1"
            )}
          </div>
          <div>
            <Heading level="h2" className="text-xl font-bold text-gray-900">
              Contact & Shipping
            </Heading>
            <p className="text-sm text-gray-500 mt-0.5">
              Where should we send your order?
            </p>
          </div>
        </div>
      </div>

      <form action={formAction}>
        <div className="space-y-6">
          <ShippingAddress
            customer={customer}
            checked={sameAsBilling}
            onChange={toggleSameAsBilling}
            cart={cart}
          />

          {!sameAsBilling && (
            <div className="pt-6 border-t border-gray-200">
              <Heading
                level="h3"
                className="text-base font-semibold text-gray-900 mb-4"
              >
                Billing Address
              </Heading>
              <BillingAddress cart={cart} />
            </div>
          )}

          <SubmitButton
            className="w-full h-12 bg-gray-900 hover:bg-[#F16D34] text-white font-semibold rounded-lg transition-colors shadow-sm"
            data-testid="submit-address-button"
          >
            Continue to Shipping
          </SubmitButton>
          <ErrorMessage error={message} data-testid="address-error-message" />
        </div>
      </form>
    </div>
  )
}

export default Addresses
