import { Heading, Text } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import { CheckCircleSolid } from "@medusajs/icons"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Success Header */}
            <div>
              <Heading level="h1" className="text-3xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </Heading>
              <p className="text-gray-600 text-lg">
                Thank you for your order. We've sent a confirmation email to{" "}
                <span className="font-medium text-gray-900">{order.email}</span>.
              </p>
            </div>

            {/* Order Details Card */}
            <OrderDetails order={order} showStatus />

            {/* Shipping Details Card */}
            <ShippingDetails order={order} />

            {/* Payment Details Card */}
            <PaymentDetails order={order} />
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Order Summary Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <Heading level="h2" className="text-lg font-bold text-gray-900">
                  Order Summary
                </Heading>
              </div>
              
              <div className="px-6 py-2">
                <Items order={order} />
              </div>
              
              <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/30">
                <CartTotals totals={order} />
              </div>
            </div>

            {/* Help Section */}
            <Help />
            
          </div>
        </div>
      </div>
    </div>
  )
}
