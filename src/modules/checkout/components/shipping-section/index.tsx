"use client"

import { useState, useEffect } from "react"
import { CheckCircleSolid, MapPin } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import CountrySelect from "../country-select"
import AddressSelect from "../address-select"
import { mapKeys } from "lodash"

interface ShippingSectionProps {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  onComplete: (data: any) => void
  isComplete: boolean
  onEdit: () => void
}

/**
 * Shipping Section Component
 *
 * Collects shipping address information
 * Shows saved addresses for logged-in users
 * Collapses when complete with edit button
 */
const ShippingSection = ({
  cart,
  customer,
  onComplete,
  isComplete,
  onEdit,
}: ShippingSectionProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    first_name: cart?.shipping_address?.first_name || "",
    last_name: cart?.shipping_address?.last_name || "",
    address_1: cart?.shipping_address?.address_1 || "",
    company: cart?.shipping_address?.company || "",
    postal_code: cart?.shipping_address?.postal_code || "",
    city: cart?.shipping_address?.city || "",
    country_code:
      cart?.shipping_address?.country_code ||
      cart?.region?.countries?.[0]?.iso_2 ||
      "",
    province: cart?.shipping_address?.province || "",
    phone: cart?.shipping_address?.phone || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get countries in region
  const countriesInRegion = cart?.region?.countries?.map((c) => c.iso_2) || []

  // Get customer addresses in current region
  const addressesInRegion =
    customer?.addresses.filter(
      (a) => a.country_code && countriesInRegion.includes(a.country_code)
    ) || []

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name?.trim())
      newErrors.first_name = "First name is required"
    if (!formData.last_name?.trim())
      newErrors.last_name = "Last name is required"
    if (!formData.address_1?.trim()) newErrors.address_1 = "Address is required"
    if (!formData.postal_code?.trim())
      newErrors.postal_code = "Postal code is required"
    if (!formData.city?.trim()) newErrors.city = "City is required"
    if (!formData.country_code) newErrors.country_code = "Country is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle continue
  const handleContinue = () => {
    if (validateForm()) {
      onComplete(formData)
    }
  }

  // Handle saved address selection
  const handleAddressSelect = (address: HttpTypes.StoreCartAddress) => {
    setFormData({
      first_name: address.first_name || "",
      last_name: address.last_name || "",
      address_1: address.address_1 || "",
      company: address.company || "",
      postal_code: address.postal_code || "",
      city: address.city || "",
      country_code: address.country_code || "",
      province: address.province || "",
      phone: address.phone || "",
    })
    setErrors({})
  }

  // Format address for display
  const formatAddress = () => {
    const parts = [
      formData.address_1,
      formData.city,
      formData.province,
      formData.postal_code,
      formData.country_code?.toUpperCase(),
    ].filter(Boolean)
    return parts.join(", ")
  }

  // Collapsed view when complete
  if (isComplete) {
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
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-600">
                  {formData.first_name} {formData.last_name}
                </p>
                <p className="text-sm text-gray-600">{formatAddress()}</p>
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

  // Expanded form view
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#F16D34] text-white flex items-center justify-center text-base font-bold">
            2
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Shipping Address
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Where should we deliver your order?
            </p>
          </div>
        </div>

        {/* Saved Addresses */}
        {customer && addressesInRegion.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Hi {customer.first_name}, use a saved address?
            </p>
            <AddressSelect
              addresses={addressesInRegion}
              addressInput={formData as HttpTypes.StoreCartAddress}
              onSelect={handleAddressSelect}
            />
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              name="first_name"
              autoComplete="given-name"
              value={formData.first_name}
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
              value={formData.last_name}
              onChange={handleChange}
              required
              errors={
                errors.last_name ? { last_name: errors.last_name } : undefined
              }
            />
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Address"
              name="address_1"
              autoComplete="address-line1"
              value={formData.address_1}
              onChange={handleChange}
              required
              errors={
                errors.address_1 ? { address_1: errors.address_1 } : undefined
              }
            />
            <Input
              label="Company"
              name="company"
              autoComplete="organization"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          {/* City and Postal Code */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              autoComplete="address-level2"
              value={formData.city}
              onChange={handleChange}
              required
              errors={errors.city ? { city: errors.city } : undefined}
            />
            <Input
              label="Postal code"
              name="postal_code"
              autoComplete="postal-code"
              value={formData.postal_code}
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
          <div className="grid grid-cols-2 gap-4">
            <CountrySelect
              name="country_code"
              autoComplete="country"
              region={cart?.region}
              value={formData.country_code}
              onChange={handleChange}
              required
            />
            <Input
              label="State / Province"
              name="province"
              autoComplete="address-level1"
              value={formData.province}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full h-12 bg-gray-900 hover:bg-[#F16D34] text-white font-semibold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Continue to Delivery
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShippingSection
