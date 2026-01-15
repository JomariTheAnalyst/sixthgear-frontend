import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full space-y-6">
      {/* Step 1: Shipping Address */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Addresses cart={cart} customer={customer} />
      </div>

      {/* Step 2: Delivery Method */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      </div>

      {/* Step 3: Payment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      </div>

      {/* Step 4: Review & Place Order */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Review cart={cart} />
      </div>
    </div>
  )
}
