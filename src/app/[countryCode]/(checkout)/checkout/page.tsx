import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import ClearPromotionsOnLoad from "@modules/checkout/components/clear-promotions-on-load"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout - Sixthgear",
  description: "Complete your purchase securely",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()
  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clear promotions on page load/refresh */}
      <ClearPromotionsOnLoad />

      {/* Main Content - Modern Single-Page Checkout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PaymentWrapper cart={cart}>
          <CheckoutForm
            cart={cart}
            customer={customer}
            shippingMethods={shippingMethods}
            paymentMethods={paymentMethods}
          />
        </PaymentWrapper>
      </div>
    </div>
  )
}
