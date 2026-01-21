import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
      </div>

      {/* Cart Items */}
      <div className="px-6 py-5 max-h-[400px] overflow-y-auto">
        <ItemsPreviewTemplate cart={cart} />
      </div>

      {/* Discount Code */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <DiscountCode cart={cart} />
      </div>

      {/* Totals */}
      <div className="px-6 py-5 border-t border-gray-200">
        <CartTotals totals={cart} />
      </div>
    </div>
  )
}

export default CheckoutSummary
