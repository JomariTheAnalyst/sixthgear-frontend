"use client"

import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import { useState, useEffect } from "react"
import OrderSummary from "@modules/checkout/components/order-summary"
import ExpressCheckout from "@modules/checkout/components/express-checkout"
import ContactSection from "@modules/checkout/components/contact-section"
import ShippingSection from "@modules/checkout/components/shipping-section"
import DeliverySection from "@modules/checkout/components/delivery-section"
import PaymentSection from "@modules/checkout/components/payment-section"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import { setShippingMethod, updateCart } from "@lib/data/cart"

interface CheckoutFormProps {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: HttpTypes.StoreCartShippingOption[] | null
  paymentMethods: any[] | null
}

type CheckoutStep = "contact" | "shipping" | "delivery" | "payment"

/**
 * Modern Checkout Form
 *
 * Single-page checkout with progressive disclosure
 * Two-column layout: form (60%) + order summary (40%)
 * Mobile-optimized with collapsible summary
 */
export default function CheckoutForm({
  cart,
  customer,
  shippingMethods,
  paymentMethods,
}: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("contact")
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [contactData, setContactData] = useState<{
    email: string
    phone?: string
  } | null>(null)
  const [shippingData, setShippingData] = useState<any>(null)

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

  // Initialize steps based on cart state
  useEffect(() => {
    const completed = new Set<string>()

    if (cart.email) {
      completed.add("contact")
      if (!cart.shipping_address) {
        setCurrentStep("shipping")
      }
    }

    if (cart.shipping_address) {
      completed.add("contact")
      completed.add("shipping")
      if (!cart.shipping_methods || cart.shipping_methods.length === 0) {
        setCurrentStep("delivery")
      }
    }

    if (cart.shipping_methods && cart.shipping_methods.length > 0) {
      completed.add("contact")
      completed.add("shipping")
      completed.add("delivery")
      setCurrentStep("payment")
    }

    setCompletedSteps(completed)
  }, [cart])

  // Handle contact completion
  const handleContactComplete = async (data: {
    email: string
    phone?: string
  }) => {
    try {
      // Update cart with email
      await updateCart({ email: data.email })

      setContactData(data)
      setCompletedSteps((prev) => new Set(prev).add("contact"))
      setCurrentStep("shipping")
    } catch (error) {
      console.error("Failed to update contact:", error)
    }
  }

  // Handle shipping completion
  const handleShippingComplete = async (data: any) => {
    try {
      // Update cart with shipping address
      await updateCart({
        shipping_address: {
          first_name: data.first_name,
          last_name: data.last_name,
          address_1: data.address_1,
          company: data.company || "",
          postal_code: data.postal_code,
          city: data.city,
          country_code: data.country_code,
          province: data.province || "",
          phone: data.phone || "",
        },
        billing_address: {
          first_name: data.first_name,
          last_name: data.last_name,
          address_1: data.address_1,
          company: data.company || "",
          postal_code: data.postal_code,
          city: data.city,
          country_code: data.country_code,
          province: data.province || "",
          phone: data.phone || "",
        },
      })

      setShippingData(data)
      setCompletedSteps((prev) => new Set(prev).add("shipping"))
      setCurrentStep("delivery")

      // Reload to get updated cart
      window.location.reload()
    } catch (error) {
      console.error("Failed to update shipping:", error)
    }
  }

  // Handle delivery completion
  const handleDeliveryComplete = async (shippingMethodId: string) => {
    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId })

      setCompletedSteps((prev) => new Set(prev).add("delivery"))
      setCurrentStep("payment")
    } catch (error) {
      console.error("Failed to set shipping method:", error)
    }
  }

  // Handle edit actions
  const handleEditContact = () => {
    setCurrentStep("contact")
    setCompletedSteps((prev) => {
      const newSet = new Set(prev)
      newSet.delete("contact")
      return newSet
    })
  }

  const handleEditShipping = () => {
    setCurrentStep("shipping")
    setCompletedSteps((prev) => {
      const newSet = new Set(prev)
      newSet.delete("shipping")
      return newSet
    })
  }

  const handleEditDelivery = () => {
    setCurrentStep("delivery")
    setCompletedSteps((prev) => {
      const newSet = new Set(prev)
      newSet.delete("delivery")
      return newSet
    })
  }

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <CheckoutProgress
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Form (60%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Express Checkout */}
          <ExpressCheckout />

          {/* Contact Section */}
          <ContactSection
            cart={cart}
            onComplete={handleContactComplete}
            isComplete={completedSteps.has("contact")}
            onEdit={handleEditContact}
          />

          {/* Shipping Section */}
          {(currentStep === "shipping" || completedSteps.has("shipping")) && (
            <ShippingSection
              cart={cart}
              customer={customer}
              onComplete={handleShippingComplete}
              isComplete={completedSteps.has("shipping")}
              onEdit={handleEditShipping}
            />
          )}

          {/* Delivery Section */}
          {(currentStep === "delivery" ||
            currentStep === "payment" ||
            completedSteps.has("delivery")) && (
            <DeliverySection
              cart={cart}
              availableShippingMethods={shippingMethods}
              onComplete={handleDeliveryComplete}
              isComplete={completedSteps.has("delivery")}
              onEdit={handleEditDelivery}
              isEnabled={completedSteps.has("shipping")}
            />
          )}

          {/* Payment Section */}
          {(currentStep === "payment" || completedSteps.has("delivery")) && (
            <PaymentSection
              cart={cart}
              availablePaymentMethods={paymentMethods}
              isEnabled={completedSteps.has("delivery")}
            />
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
