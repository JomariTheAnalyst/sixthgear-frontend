import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{getAmount(order.subtotal)}</span>
        </div>

        {/* Discount */}
        {order.discount_total > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-green-600">- {getAmount(order.discount_total)}</span>
          </div>
        )}

        {/* Gift Card */}
        {order.gift_card_total > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Gift Card</span>
            <span className="font-medium text-green-600">- {getAmount(order.gift_card_total)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">{getAmount(order.shipping_total)}</span>
        </div>

        {/* Taxes */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Taxes</span>
          <span className="font-medium text-gray-900">{getAmount(order.tax_total)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{getAmount(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
