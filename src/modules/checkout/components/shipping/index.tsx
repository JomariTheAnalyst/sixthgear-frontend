"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Always open by default - no need to click edit
  const isOpen = true

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => !sm.service_zone_id || sm.service_zone_id !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone_id === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-sm ${
              (cart.shipping_methods?.length ?? 0) > 0
                ? "bg-green-500 text-white"
                : cart.shipping_address
                ? "bg-[#F16D34] text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {(cart.shipping_methods?.length ?? 0) > 0 ? (
              <CheckCircleSolid className="w-6 h-6" />
            ) : (
              "2"
            )}
          </div>
          <div>
            <Heading
              level="h2"
              className={clx("text-xl font-bold", {
                "text-gray-400": !cart.shipping_address,
                "text-gray-900": cart.shipping_address,
              })}
            >
              Shipping Method
            </Heading>
            <p className="text-sm text-gray-500 mt-0.5">
              Choose how you want to receive your order
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div data-testid="delivery-options-container" className="space-y-3">
          {hasPickupOptions && (
            <RadioGroup
              value={showPickupOptions}
              onChange={(value) => {
                const id = _pickupMethods.find(
                  (option) => !option.insufficient_inventory
                )?.id

                if (id) {
                  handleSetShippingMethod(id, "pickup")
                }
              }}
            >
              <Radio
                value={PICKUP_OPTION_ON}
                data-testid="delivery-option-radio"
                className={clx(
                  "flex items-center justify-between cursor-pointer p-4 border rounded-lg transition-all",
                  {
                    "border-[#F16D34] bg-orange-50":
                      showPickupOptions === PICKUP_OPTION_ON,
                    "border-gray-200 hover:border-gray-300":
                      showPickupOptions !== PICKUP_OPTION_ON,
                  }
                )}
              >
                <div className="flex items-center gap-3">
                  <MedusaRadio
                    checked={showPickupOptions === PICKUP_OPTION_ON}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Pick up your order
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Free
                </span>
              </Radio>
            </RadioGroup>
          )}

          <RadioGroup
            value={shippingMethodId}
            onChange={(v) => {
              if (v) {
                return handleSetShippingMethod(v, "shipping")
              }
            }}
            className="space-y-3"
          >
            {_shippingMethods?.map((option) => {
              const isDisabled =
                option.price_type === "calculated" &&
                !isLoadingPrices &&
                typeof calculatedPricesMap[option.id] !== "number"

              return (
                <Radio
                  key={option.id}
                  value={option.id}
                  data-testid="delivery-option-radio"
                  disabled={isDisabled}
                  className={clx(
                    "flex items-center justify-between cursor-pointer p-4 border rounded-lg transition-all",
                    {
                      "border-[#F16D34] bg-orange-50":
                        option.id === shippingMethodId,
                      "border-gray-200 hover:border-gray-300":
                        option.id !== shippingMethodId,
                      "opacity-50 cursor-not-allowed": isDisabled,
                    }
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MedusaRadio checked={option.id === shippingMethodId} />
                    <span className="text-sm font-medium text-gray-900">
                      {option.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {option.price_type === "flat" ? (
                      convertToLocale({
                        amount: option.amount!,
                        currency_code: cart?.currency_code,
                      })
                    ) : calculatedPricesMap[option.id] ? (
                      convertToLocale({
                        amount: calculatedPricesMap[option.id],
                        currency_code: cart?.currency_code,
                      })
                    ) : isLoadingPrices ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "-"
                    )}
                  </span>
                </Radio>
              )
            })}
          </RadioGroup>
        </div>

        {showPickupOptions === PICKUP_OPTION_ON && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-2">
              Choose a store near you
            </p>
            <RadioGroup
              value={shippingMethodId}
              onChange={(v) => {
                if (v) {
                  return handleSetShippingMethod(v, "pickup")
                }
              }}
              className="space-y-3"
            >
              {_pickupMethods?.map((option) => {
                return (
                  <Radio
                    key={option.id}
                    value={option.id}
                    disabled={option.insufficient_inventory}
                    data-testid="delivery-option-radio"
                    className={clx(
                      "flex items-center justify-between cursor-pointer p-4 border rounded-lg transition-all",
                      {
                        "border-[#F16D34] bg-orange-50":
                          option.id === shippingMethodId,
                        "border-gray-200 hover:border-gray-300":
                          option.id !== shippingMethodId,
                        "opacity-50 cursor-not-allowed":
                          option.insufficient_inventory,
                      }
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <MedusaRadio checked={option.id === shippingMethodId} />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          {option.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {option.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {convertToLocale({
                        amount: option.amount!,
                        currency_code: cart?.currency_code,
                      })}
                    </span>
                  </Radio>
                )
              })}
            </RadioGroup>
          </div>
        )}

        <div className="pt-4">
          <ErrorMessage
            error={error}
            data-testid="delivery-option-error-message"
          />
          <Button
            size="large"
            className="w-full h-12 bg-gray-900 hover:bg-[#F16D34] text-white font-semibold rounded-lg transition-colors shadow-sm"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!cart.shipping_methods?.[0]}
            data-testid="submit-delivery-option-button"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Shipping
