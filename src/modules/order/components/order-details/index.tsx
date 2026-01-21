import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
             <div>
                <p className="text-sm text-gray-500 mb-1">Confirmation sent to</p>
                <p className="font-medium text-gray-900" data-testid="order-email">
                    {order.email}
                </p>
             </div>
             
             <div className="flex items-center gap-x-8 text-sm">
                 <div>
                    <p className="text-gray-500 mb-0.5">Order Date</p>
                    <p className="font-medium text-gray-900" data-testid="order-date">
                        {new Date(order.created_at).toLocaleDateString()}
                    </p>
                 </div>
                 <div>
                    <p className="text-gray-500 mb-0.5">Order Number</p>
                    <p className="font-medium text-gray-900" data-testid="order-id">
                        #{order.display_id}
                    </p>
                 </div>
             </div>
        </div>

        {showStatus && (
          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Order Status</span>
              <span 
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800" 
                data-testid="order-status"
              >
                {formatStatus(order.fulfillment_status)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Payment Status</span>
              <span 
                className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                data-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
