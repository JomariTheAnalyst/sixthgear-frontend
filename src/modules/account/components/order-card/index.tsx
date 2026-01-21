"use client"

import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const statusConfig: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    not_fulfilled: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    partially_fulfilled: { bg: "bg-blue-100", text: "text-blue-700", label: "Processing" },
    fulfilled: { bg: "bg-purple-100", text: "text-purple-700", label: "Shipped" },
    partially_shipped: { bg: "bg-blue-100", text: "text-blue-700", label: "Partially Shipped" },
    shipped: { bg: "bg-purple-100", text: "text-purple-700", label: "Shipped" },
    delivered: { bg: "bg-green-100", text: "text-green-700", label: "Delivered" },
    partially_delivered: { bg: "bg-green-100", text: "text-green-700", label: "Partially Delivered" },
    canceled: { bg: "bg-red-100", text: "text-red-700", label: "Canceled" },
    returned: { bg: "bg-gray-100", text: "text-gray-700", label: "Returned" },
    partially_returned: { bg: "bg-gray-100", text: "text-gray-700", label: "Partially Returned" },
  }

  const status = statusConfig[order.fulfillment_status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: order.fulfillment_status 
      ? order.fulfillment_status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") 
      : "Unknown",
  }

  return (
    <div className="p-6 transition-all" data-testid="order-card">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 leading-none">
                    Order #{order.display_id}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                    {status.label}
                </span>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
               {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            
            <div className="flex items-center gap-4">
                 <div className="flex -space-x-3 overflow-hidden py-1">
                    {order.items?.slice(0, 4).map((item, index) => (
                        <div
                        key={item.id}
                        className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 shadow-sm relative overflow-hidden"
                        style={{ zIndex: 4 - index }}
                        >
                        <Thumbnail thumbnail={item.thumbnail} images={[]} size="square" />
                        </div>
                    ))}
                    {numberOfProducts > 4 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500 shadow-sm" style={{ zIndex: 0 }}>
                        +{numberOfProducts - 4}
                        </div>
                    )}
                </div>
                {(order.items?.length || 0) > 0 && (
                     <span className="text-xs text-gray-500 font-medium pt-1">
                        {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                     </span>
                )}
            </div>
        </div>
        
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-1 mt-2 sm:mt-0">
             <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-gray-900 tracking-tight">
                    {convertToLocale({
                    amount: order.total,
                    currency_code: order.currency_code,
                    })}
                </p>
             </div>
             
             <LocalizedClientLink
                href={`/account/orders/details/${order.id}`}
                className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors mt-2"
             >
                View Details
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
             </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
