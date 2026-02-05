"use client"

import { useState, useEffect } from "react"
import { CheckCircleSolid, Truck } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Radio, RadioGroup } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import MedusaRadio from "@modules/common/components/radio"

interface DeliverySectionProps {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[]
  onComplete: (shippingMethodId: string) => void
  isComplete: boolean
  onEdit: () => void
  isEnabled: boolean
}

/**
 * Delivery Section Component
 *
 * Shows shipping method options with prices and estimated delivery
 * Auto-expands when shipping address is complete
 */
const DeliverySection = ({
  cart,
  availableShippingMethods,
  onComplete,
  isComplete,
  onEdit,
  isEnabled,
}: DeliverySectionProps) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(
    cart.shipping_methods?.[0]?.shipping_option_id || null
  )
  const [calculatedPrices, setCalculatedPrices] = useState<
    Record<string, number>
  >({})
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter shipping methods (exclude pickup for now)
  const shippingMethods =
    availableShippingMethods?.filter(
      (sm) => !sm.service_zone_id || sm.service_zone_id !== "pickup"
    ) || []

  // Calculate prices for calculated shipping methods
  useEffect(() => {
    if (!shippingMethods.length) return

    setIsLoadingPrices(true)

    const calculatedMethods = shippingMethods.filter(
      (sm) => sm.price_type === "calculated"
    )

    if (calculatedMethods.length === 0) {
      setIsLoadingPrices(false)
      return
    }

    Promise.allSettled(
      calculatedMethods.map((sm) =>
        calculatePriceForShippingOption(sm.id, cart.id)
      )
    ).then((results) => {
      const pricesMap: Record<string, number> = {}
      results
        .filter((r) => r.status === "fulfilled")
        .forEach((p: any) => {
          pricesMap[p.value?.id || ""] = p.value?.amount || 0
        })
      setCalculatedPrices(pricesMap)
      setIsLoadingPrices(false)
    })
  }, [shippingMethods, cart.id])

  // Handle method selection
  const handleMethodSelect = async (methodId: string) => {
    setSelectedMethodId(methodId)
  }

  // Handle continue
  const handleContinue = async () => {
    if (!selectedMethodId) return

    setIsSubmitting(true)
    try {
      await onComplete(selectedMethodId)
    } catch (error) {
      console.error("Failed to set shipping method:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get selected method details
  const selectedMethod = shippingMethods.find((m) => m.id === selectedMethodId)

  // Get price for a method
  const getMethodPrice = (method: HttpTypes.StoreCartShippingOption) => {
    if (method.price_type === "flat") {
      return method.amount || 0
    }
    return calculatedPrices[method.id] || 0
  }

  // Collapsed view when complete
  if (isComplete) {
    const price = selectedMethod ? getMethodPrice(selectedMethod) : 0

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                <CheckCircleSolid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delivery Method
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedMethod?.name} -{" "}
                  {price === 0
                    ? "Free"
                    : convertToLocale({
                        amount: price,
                        currency_code: cart.currency_code,
                      })}
                </p>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="text-sm font-medium text-[#F16D34] hover:text-[#d55a24] transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Disabled view (shipping address not complete)
  if (!isEnabled) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden opacity-60">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-base font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-400">
                Delivery Method
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">
                Complete shipping address first
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Expanded form view
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#F16D34] text-white flex items-center justify-center text-base font-bold">
            3
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Delivery Method</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Choose how you want to receive your order
            </p>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="space-y-3 mb-6">
          <RadioGroup value={selectedMethodId} onChange={handleMethodSelect}>
            {shippingMethods.map((method) => {
              const price = getMethodPrice(method)
              const isDisabled =
                method.price_type === "calculated" &&
                !isLoadingPrices &&
                typeof calculatedPrices[method.id] !== "number"

              return (
                <Radio
                  key={method.id}
                  value={method.id}
                  disabled={isDisabled}
                  className={({ checked }) =>
                    `flex items-center justify-between cursor-pointer p-4 border rounded-lg transition-all ${
                      checked
                        ? "border-[#F16D34] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`
                  }
                >
                  {({ checked }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <MedusaRadio checked={checked} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {method.name}
                          </p>
                          {method.name.toLowerCase().includes("express") && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Estimated delivery: 1-2 business days
                            </p>
                          )}
                          {method.name.toLowerCase().includes("standard") && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Estimated delivery: 3-5 business days
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {isLoadingPrices &&
                        method.price_type === "calculated" ? (
                          <svg
                            className="animate-spin h-5 w-5 text-gray-400"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : price === 0 ? (
                          "Free"
                        ) : (
                          convertToLocale({
                            amount: price,
                            currency_code: cart.currency_code,
                          })
                        )}
                      </span>
                    </>
                  )}
                </Radio>
              )
            })}
          </RadioGroup>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedMethodId || isSubmitting}
          className="w-full h-12 bg-gray-900 hover:bg-[#F16D34] text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Updating...
            </>
          ) : (
            "Continue to Payment"
          )}
        </button>
      </div>
    </div>
  )
}

export default DeliverySection
