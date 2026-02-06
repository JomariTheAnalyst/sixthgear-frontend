"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useEffect } from "react"
import OrderSummary from "@modules/checkout/components/order-summary"
import { setShippingMethod, updateCart, placeOrder } from "@lib/data/cart"
import { Envelope } from "@medusajs/icons"
import Input from "@modules/common/components/input"
import CountrySelect from "@modules/checkout/components/country-select"
import AddressSelect from "@modules/checkout/components/address-select"
import { Radio, RadioGroup } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import BillingAddressSection from "@modules/checkout/components/billing-address-section"
import TermsSection from "@modules/checkout/components/terms-section"
import StripeCheckoutButton from "@modules/checkout/components/stripe-checkout-button"

interface CheckoutFormProps {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: HttpTypes.StoreCartShippingOption[] | null
  paymentMethods: any[] | null
}

/**
 * Modern Single-Page Checkout Form
 *
 * All sections visible at once - no step-by-step flow
 * Single "Pay Now" button at the bottom
 * Two-column layout: form (60%) + order summary (40%)
 * Mobile-optimized with collapsible summary
 */
export default function CheckoutForm({
  cart,
  customer,
  shippingMethods,
  paymentMethods,
}: CheckoutFormProps) {
  // Form state
  const [email, setEmail] = useState(cart?.email || customer?.email || "")
  const [shippingAddress, setShippingAddress] = useState<any>({
    first_name:
      cart?.shipping_address?.first_name || customer?.first_name || "",
    last_name: cart?.shipping_address?.last_name || customer?.last_name || "",
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
  const [billingAddress, setBillingAddress] = useState<any>(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<
    string | null
  >(cart?.shipping_methods?.[0]?.shipping_option_id || null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cod")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedPrices, setCalculatedPrices] = useState<
    Record<string, number>
  >({})
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  if (!cart || !shippingMethods || !paymentMethods) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F16D34] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Filter shipping methods
  const availableShippingMethods =
    shippingMethods?.filter(
      (sm) => !sm.service_zone_id || sm.service_zone_id !== "pickup"
    ) || []

  // Filter payment methods - Only COD and Stripe
  const availablePaymentMethods =
    paymentMethods?.filter(
      (pm) =>
        pm.id === "cod" ||
        pm.id === "cash_on_delivery" ||
        pm.id === "stripe" ||
        pm.id?.includes("stripe")
    ) || []

  // Get customer addresses in current region
  const countriesInRegion = cart?.region?.countries?.map((c) => c.iso_2) || []
  const addressesInRegion =
    customer?.addresses.filter(
      (a) => a.country_code && countriesInRegion.includes(a.country_code)
    ) || []

  // Calculate prices for shipping methods
  useEffect(() => {
    if (!availableShippingMethods.length) return

    setIsLoadingPrices(true)

    const calculatedMethods = availableShippingMethods.filter(
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
  }, [availableShippingMethods, cart.id])

  // Get price for a shipping method
  const getMethodPrice = (method: HttpTypes.StoreCartShippingOption) => {
    if (method.price_type === "flat") {
      return method.amount || 0
    }
    return calculatedPrices[method.id] || 0
  }

  // Validate email
  const validateEmail = (value: string) => {
    if (!value) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return "Please enter a valid email address"
    return ""
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError

    // Shipping address validation
    if (!shippingAddress.first_name?.trim())
      newErrors.first_name = "First name is required"
    if (!shippingAddress.last_name?.trim())
      newErrors.last_name = "Last name is required"
    if (!shippingAddress.address_1?.trim())
      newErrors.address_1 = "Address is required"
    if (!shippingAddress.postal_code?.trim())
      newErrors.postal_code = "Postal code is required"
    if (!shippingAddress.city?.trim()) newErrors.city = "City is required"
    if (!shippingAddress.country_code)
      newErrors.country_code = "Country is required"

    // Shipping method validation
    if (!selectedShippingMethod)
      newErrors.shipping_method = "Please select a shipping method"

    // Payment method validation
    if (!selectedPaymentMethod)
      newErrors.payment_method = "Please select a payment method"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleShippingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setShippingAddress((prev: any) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handle saved address selection
  const handleAddressSelect = (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => {
    if (!address) return

    setShippingAddress({
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

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    if (!agreedToTerms) {
      setErrors((prev) => ({
        ...prev,
        terms: "You must agree to the terms and conditions",
      }))
      return
    }

    setIsSubmitting(true)

    try {
      // Update cart with email
      if (email !== cart.email) {
        await updateCart({ email })
      }

      // Update cart with addresses
      await updateCart({
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
      })

      // Set shipping method
      if (selectedShippingMethod) {
        await setShippingMethod({
          cartId: cart.id,
          shippingMethodId: selectedShippingMethod,
        })
      }

      // For COD: Place order directly
      if (
        selectedPaymentMethod === "cod" ||
        selectedPaymentMethod === "cash_on_delivery"
      ) {
        await placeOrder()
      }

      console.log("[Checkout] Cart updated successfully")
    } catch (error: any) {
      console.error("[Checkout] Error:", error)
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to process checkout",
      }))
      setIsSubmitting(false)
    }
  }

  // Check if Stripe is selected
  const isStripeSelected =
    selectedPaymentMethod === "stripe" ||
    selectedPaymentMethod?.startsWith("pp_stripe") ||
    selectedPaymentMethod?.includes("stripe")

  // Check if form is valid
  const isFormValid =
    email &&
    !validateEmail(email) &&
    shippingAddress.first_name &&
    shippingAddress.last_name &&
    shippingAddress.address_1 &&
    shippingAddress.postal_code &&
    shippingAddress.city &&
    shippingAddress.country_code &&
    selectedShippingMethod &&
    selectedPaymentMethod

  return (
    <div className="w-full">
      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Form (60%) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Email Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Contact Information
              </h3>
              <p className="text-sm text-gray-500">
                {customer
                  ? `Logged in as ${customer.email}`
                  : "We'll use this to send order updates"}
              </p>
            </div>

            {customer ? (
              // Logged in: Show email as read-only
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
                <Envelope className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {customer.email}
                </span>
              </div>
            ) : (
              // Guest: Show email input
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Envelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }))
                      }
                    }}
                    placeholder="you@example.com"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#F16D34] focus:ring-orange-200"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            )}
          </div>

          {/* Delivery Address Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delivery Address
              </h3>
              <p className="text-base text-gray-500">
                Where should we deliver your order?
              </p>
            </div>

            {/* Saved Addresses */}
            {customer && addressesInRegion.length > 0 && (
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Hi {customer.first_name}, use a saved address?
                </p>
                <AddressSelect
                  addresses={addressesInRegion}
                  addressInput={shippingAddress as HttpTypes.StoreCartAddress}
                  onSelect={handleAddressSelect}
                />
              </div>
            )}

            {/* Address Form */}
            <div className="space-y-4">
              {/* Country/Region */}
              <CountrySelect
                name="country_code"
                autoComplete="country"
                region={cart?.region}
                value={shippingAddress.country_code}
                onChange={handleShippingAddressChange}
                required
              />

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div title="Enter a first name">
                  <Input
                    label="First name"
                    name="first_name"
                    autoComplete="given-name"
                    value={shippingAddress.first_name}
                    onChange={handleShippingAddressChange}
                    required
                    errors={
                      errors.first_name
                        ? { first_name: errors.first_name }
                        : undefined
                    }
                  />
                </div>
                <div title="Enter a last name">
                  <Input
                    label="Last name"
                    name="last_name"
                    autoComplete="family-name"
                    value={shippingAddress.last_name}
                    onChange={handleShippingAddressChange}
                    required
                    errors={
                      errors.last_name
                        ? { last_name: errors.last_name }
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* Address */}
              <div title="Enter an address">
                <Input
                  label="Address"
                  name="address_1"
                  autoComplete="address-line1"
                  value={shippingAddress.address_1}
                  onChange={handleShippingAddressChange}
                  required
                  errors={
                    errors.address_1
                      ? { address_1: errors.address_1 }
                      : undefined
                  }
                />
              </div>

              {/* Apartment/Suite */}
              <Input
                label="Apartment, suite, etc. (optional)"
                name="company"
                autoComplete="organization"
                value={shippingAddress.company}
                onChange={handleShippingAddressChange}
              />

              {/* Postal Code and City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div title="Enter a ZIP / postal code">
                  <Input
                    label="Postal code"
                    name="postal_code"
                    autoComplete="postal-code"
                    value={shippingAddress.postal_code}
                    onChange={handleShippingAddressChange}
                    required
                    errors={
                      errors.postal_code
                        ? { postal_code: errors.postal_code }
                        : undefined
                    }
                  />
                </div>
                <div title="Enter a city">
                  <Input
                    label="City"
                    name="city"
                    autoComplete="address-level2"
                    value={shippingAddress.city}
                    onChange={handleShippingAddressChange}
                    required
                    errors={errors.city ? { city: errors.city } : undefined}
                  />
                </div>
              </div>

              {/* Region/Province */}
              <Input
                label="Region / Province"
                name="province"
                autoComplete="address-level1"
                value={shippingAddress.province}
                onChange={handleShippingAddressChange}
              />

              {/* Phone */}
              <div title="Enter a phone number">
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={shippingAddress.phone}
                  onChange={handleShippingAddressChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Method Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Shipping Method
              </h3>
              <p className="text-base text-gray-500">
                Choose how you want to receive your order
              </p>
            </div>

            <RadioGroup
              value={selectedShippingMethod}
              onChange={async (value) => {
                setSelectedShippingMethod(value)
                if (errors.shipping_method) {
                  setErrors((prev) => ({ ...prev, shipping_method: "" }))
                }
                // Automatically set shipping method to update cart total
                if (value) {
                  try {
                    await setShippingMethod({
                      cartId: cart.id,
                      shippingMethodId: value,
                    })
                  } catch (error) {
                    console.error(
                      "[Checkout] Failed to set shipping method:",
                      error
                    )
                  }
                }
              }}
              className="space-y-0"
            >
              {availableShippingMethods.map((method, index) => {
                const price = getMethodPrice(method)
                const isDisabled =
                  method.price_type === "calculated" &&
                  !isLoadingPrices &&
                  typeof calculatedPrices[method.id] !== "number"
                const isFirst = index === 0
                const isLast = index === availableShippingMethods.length - 1

                return (
                  <Radio
                    key={method.id}
                    value={method.id}
                    disabled={isDisabled}
                    className="w-full"
                  >
                    {({ checked }) => (
                      <div
                        className={`cursor-pointer transition-all ${
                          checked
                            ? "border-2 border-gray-900 bg-gray-50 rounded-lg mt-4 first:mt-0"
                            : isFirst
                            ? "border border-gray-300 rounded-t-lg"
                            : isLast
                            ? "border border-gray-300 border-t-0 rounded-b-lg"
                            : "border border-gray-300 border-t-0"
                        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                checked
                                  ? "border-gray-900 bg-gray-900"
                                  : "border-gray-400"
                              }`}
                            >
                              {checked && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-base font-medium text-gray-900">
                                {method.name}
                              </p>
                              {method.name
                                .toLowerCase()
                                .includes("express") && (
                                <p className="text-sm text-gray-500 mt-0.5">
                                  Estimated delivery: 1-2 business days
                                </p>
                              )}
                              {method.name
                                .toLowerCase()
                                .includes("standard") && (
                                <p className="text-sm text-gray-500 mt-0.5">
                                  Estimated delivery: 3-5 business days
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-base font-semibold text-gray-900">
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
                        </div>
                      </div>
                    )}
                  </Radio>
                )
              })}
            </RadioGroup>

            {errors.shipping_method && (
              <p className="text-sm text-red-600">{errors.shipping_method}</p>
            )}
          </div>

          {/* Payment Section - Clean Layout (Only Selected Has Outline) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment</h3>
              <p className="text-base text-gray-500">
                All transactions are secure and encrypted.
              </p>
            </div>

            <RadioGroup
              value={selectedPaymentMethod}
              onChange={(value) => {
                setSelectedPaymentMethod(value)
                if (errors.payment_method) {
                  setErrors((prev) => ({ ...prev, payment_method: "" }))
                }
              }}
              className="space-y-0"
            >
              {/* COD Option */}
              <Radio value="cod" className="w-full">
                {({ checked }) => (
                  <div
                    className={`cursor-pointer transition-all ${
                      checked
                        ? "border-2 border-gray-900 bg-gray-50 rounded-lg"
                        : "border border-gray-300 rounded-t-lg"
                    }`}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            checked
                              ? "border-gray-900 bg-gray-900"
                              : "border-gray-400"
                          }`}
                        >
                          {checked && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-base font-medium text-gray-900">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                    </div>
                    {/* Dropdown Note - Only shows when selected */}
                    {checked && (
                      <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300 ease-out">
                        <div className="p-4 bg-white rounded-md border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            You'll be able to pay with cash when your order is
                            delivered. COD is applicable only for orders below
                            ₱50,000 within Metro Manila and below ₱25,000
                            outside Metro Manila.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Radio>

              {/* Stripe Option */}
              {availablePaymentMethods.some(
                (pm) => pm.id === "stripe" || pm.id?.includes("stripe")
              ) && (
                <Radio value="stripe" className="w-full">
                  {({ checked }) => (
                    <div
                      className={`cursor-pointer transition-all ${
                        checked
                          ? "border-2 border-gray-900 bg-gray-50 rounded-lg mt-4"
                          : "border border-gray-300 border-t-0 rounded-b-lg"
                      }`}
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              checked
                                ? "border-gray-900 bg-gray-900"
                                : "border-gray-400"
                            }`}
                          >
                            {checked && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-medium text-gray-900">
                              Stripe
                            </span>
                            <span className="text-sm text-gray-500">
                              - Card Payment
                            </span>
                          </div>
                        </div>
                        <svg
                          className="w-12 h-4"
                          fill="#635BFF"
                          viewBox="0 0 60 25"
                        >
                          <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" />
                        </svg>
                      </div>
                      {/* Dropdown Note - Only shows when selected */}
                      {checked && (
                        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300 ease-out">
                          <div className="p-4 bg-white rounded-md border border-gray-200">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              You'll be redirected to Stripe to complete your
                              purchase securely using Cards, Bank Transfer
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Radio>
              )}
            </RadioGroup>

            {errors.payment_method && (
              <p className="text-sm text-red-600">{errors.payment_method}</p>
            )}
          </div>

          {/* Billing Address Section */}
          <BillingAddressSection
            cart={cart}
            shippingAddress={shippingAddress}
            onBillingAddressChange={setBillingAddress}
          />

          {/* Terms & Conditions */}
          <TermsSection
            agreed={agreedToTerms}
            onAgreeChange={setAgreedToTerms}
          />

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Pay Now Button - Black Background, White Text, No Icons */}
          {isStripeSelected ? (
            <div className="space-y-4">
              {agreedToTerms && isFormValid ? (
                <StripeCheckoutButton cart={cart} />
              ) : (
                <button
                  disabled
                  className="w-full h-14 bg-gray-300 text-gray-500 font-bold text-base uppercase tracking-wider rounded-lg cursor-not-allowed flex items-center justify-center"
                >
                  {!agreedToTerms
                    ? "Agree to Terms to Continue"
                    : "Complete All Fields"}
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!agreedToTerms || !isFormValid || isSubmitting}
              className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold text-base uppercase tracking-wider rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 flex items-center justify-center"
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>

        {/* Right Column: Order Summary (40%) - Sticky on Desktop */}
        <div className="lg:col-span-5">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
