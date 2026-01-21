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

  const isOpen = searchParams.get("step") === "address"

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
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              !isOpen && cart?.shipping_address
                ? "bg-green-500 text-white"
                : "bg-gray-900 text-white"
            }`}
          >
            {!isOpen && cart?.shipping_address ? (
              <CheckCircleSolid className="w-5 h-5" />
            ) : (
              "1"
            )}
          </div>
          <Heading level="h2" className="text-lg font-semibold text-gray-900">
            Contact & Shipping Information
          </Heading>
        </div>
        {!isOpen && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="text-sm font-medium text-[#F16D34] hover:text-[#d55a24] transition-colors"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>

      {isOpen ? (
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
              className="w-full h-12 bg-gray-900 hover:bg-[#F16D34] text-white font-semibold rounded-lg transition-colors"
              data-testid="submit-address-button"
            >
              Continue to Shipping
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          {cart && cart.shipping_address ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div data-testid="shipping-address-summary">
                <Text className="text-sm font-medium text-gray-900 mb-2">
                  Shipping Address
                </Text>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    {cart.shipping_address.first_name}{" "}
                    {cart.shipping_address.last_name}
                  </p>
                  <p>
                    {cart.shipping_address.address_1}{" "}
                    {cart.shipping_address.address_2}
                  </p>
                  <p>
                    {cart.shipping_address.postal_code},{" "}
                    {cart.shipping_address.city}
                  </p>
                  <p>{cart.shipping_address.country_code?.toUpperCase()}</p>
                </div>
              </div>

              <div data-testid="shipping-contact-summary">
                <Text className="text-sm font-medium text-gray-900 mb-2">
                  Contact
                </Text>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{cart.shipping_address.phone}</p>
                  <p>{cart.email}</p>
                </div>
              </div>

              <div data-testid="billing-address-summary">
                <Text className="text-sm font-medium text-gray-900 mb-2">
                  Billing Address
                </Text>
                {sameAsBilling ? (
                  <p className="text-sm text-gray-600">
                    Same as shipping address
                  </p>
                ) : (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {cart.billing_address?.first_name}{" "}
                      {cart.billing_address?.last_name}
                    </p>
                    <p>
                      {cart.billing_address?.address_1}{" "}
                      {cart.billing_address?.address_2}
                    </p>
                    <p>
                      {cart.billing_address?.postal_code},{" "}
                      {cart.billing_address?.city}
                    </p>
                    <p>{cart.billing_address?.country_code?.toUpperCase()}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses
