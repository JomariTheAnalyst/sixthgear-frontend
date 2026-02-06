"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Radio, RadioGroup } from "@headlessui/react"
import Input from "@modules/common/components/input"
import CountrySelect from "../country-select"
import MedusaRadio from "@modules/common/components/radio"

interface BillingAddressSectionProps {
  cart: HttpTypes.StoreCart
  shippingAddress: any
  onBillingAddressChange: (data: any) => void
}

/**
 * Billing Address Section Component
 *
 * Allows user to use shipping address or provide different billing address
 * Collapsible form that shows only when "Different address" is selected
 */
const BillingAddressSection = ({
  cart,
  shippingAddress,
  onBillingAddressChange,
}: BillingAddressSectionProps) => {
  const [useSameAddress, setUseSameAddress] = useState(true)
  const [billingData, setBillingData] = useState<Record<string, any>>({
    first_name: "",
    last_name: "",
    address_1: "",
    company: "",
    postal_code: "",
    city: "",
    country_code: cart?.region?.countries?.[0]?.iso_2 || "",
    province: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle address type change
  const handleAddressTypeChange = (value: string) => {
    const isSame = value === "same"
    setUseSameAddress(isSame)

    if (isSame) {
      // Use shipping address
      onBillingAddressChange(shippingAddress)
    } else {
      // Use billing address
      onBillingAddressChange(billingData)
    }
  }

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const newData = { ...billingData, [name]: value }
    setBillingData(newData)
    onBillingAddressChange(newData)

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Billing address
        </h3>
      </div>

      {/* Radio Options - Only Selected Has Outline */}
      <RadioGroup
        value={useSameAddress ? "same" : "different"}
        onChange={handleAddressTypeChange}
        className="space-y-0"
      >
        {/* Same as Shipping */}
        <Radio value="same" className="w-full">
          {({ checked }) => (
            <div
              className={`cursor-pointer transition-all ${
                checked
                  ? "border-2 border-gray-900 bg-gray-50 rounded-lg"
                  : "border border-gray-300 rounded-t-lg"
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    checked ? "border-gray-900 bg-gray-900" : "border-gray-400"
                  }`}
                >
                  {checked && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-base font-medium text-gray-900">
                  Same as shipping address
                </span>
              </div>
            </div>
          )}
        </Radio>

        {/* Different Address */}
        <Radio value="different" className="w-full">
          {({ checked }) => (
            <div
              className={`cursor-pointer transition-all ${
                checked
                  ? "border-2 border-gray-900 bg-gray-50 rounded-lg mt-4"
                  : "border border-gray-300 border-t-0 rounded-b-lg"
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    checked ? "border-gray-900 bg-gray-900" : "border-gray-400"
                  }`}
                >
                  {checked && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-base font-medium text-gray-900">
                  Use a different billing address
                </span>
              </div>
              {/* Billing Address Form - Smooth Dropdown */}
              {checked && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300 ease-out">
                  <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        label="First name"
                        name="first_name"
                        autoComplete="given-name"
                        value={billingData.first_name}
                        onChange={handleChange}
                        required
                        errors={
                          errors.first_name
                            ? { first_name: errors.first_name }
                            : undefined
                        }
                      />
                      <Input
                        label="Last name"
                        name="last_name"
                        autoComplete="family-name"
                        value={billingData.last_name}
                        onChange={handleChange}
                        required
                        errors={
                          errors.last_name
                            ? { last_name: errors.last_name }
                            : undefined
                        }
                      />
                    </div>

                    {/* Address */}
                    <Input
                      label="Address"
                      name="address_1"
                      autoComplete="address-line1"
                      value={billingData.address_1}
                      onChange={handleChange}
                      required
                      errors={
                        errors.address_1
                          ? { address_1: errors.address_1 }
                          : undefined
                      }
                    />

                    {/* Company */}
                    <Input
                      label="Company (optional)"
                      name="company"
                      autoComplete="organization"
                      value={billingData.company}
                      onChange={handleChange}
                    />

                    {/* City and Postal Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        label="City"
                        name="city"
                        autoComplete="address-level2"
                        value={billingData.city}
                        onChange={handleChange}
                        required
                        errors={errors.city ? { city: errors.city } : undefined}
                      />
                      <Input
                        label="Postal code"
                        name="postal_code"
                        autoComplete="postal-code"
                        value={billingData.postal_code}
                        onChange={handleChange}
                        required
                        errors={
                          errors.postal_code
                            ? { postal_code: errors.postal_code }
                            : undefined
                        }
                      />
                    </div>

                    {/* Country and Province */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <CountrySelect
                        name="country_code"
                        autoComplete="country"
                        region={cart?.region}
                        value={billingData.country_code}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="State / Province"
                        name="province"
                        autoComplete="address-level1"
                        value={billingData.province}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Phone */}
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={billingData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Radio>
      </RadioGroup>
    </div>
  )
}

export default BillingAddressSection
