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
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Completed",
    },
    canceled: { bg: "bg-red-100", text: "text-red-700", label: "Canceled" },
    archived: { bg: "bg-gray-100", text: "text-gray-700", label: "Archived" },
    requires_action: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      label: "Action Required",
    },
  }

  const status = statusConfig[order.status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: order.status,
  }

  return (
    <div className="p-5" data-testid="order-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              Order #
              <span data-testid="order-display-id">{order.display_id}</span>
            </p>
            <p className="text-sm text-gray-500" data-testid="order-created-at">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
          <span
            className="text-lg font-bold text-gray-900"
            data-testid="order-amount"
          >
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="flex items-center gap-3 py-4 border-t border-b border-gray-100">
        <div className="flex -space-x-2">
          {order.items?.slice(0, 4).map((item, index) => (
            <div
              key={item.id}
              className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-gray-100 shadow-sm"
              style={{ zIndex: 4 - index }}
              data-testid="order-item"
            >
              <Thumbnail thumbnail={item.thumbnail} images={[]} size="square" />
            </div>
          ))}
          {numberOfProducts > 4 && (
            <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm">
              +{numberOfProducts - 4}
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{numberOfLines}</span>{" "}
          {numberOfLines > 1 ? "items" : "item"}
          {numberOfProducts > 1 && (
            <span className="text-gray-400">
              {" "}
              • {numberOfProducts} products
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-500">
          {order.shipping_address && (
            <span>
              Ships to {order.shipping_address.city},{" "}
              {order.shipping_address.country_code?.toUpperCase()}
            </span>
          )}
        </div>
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
          data-testid="order-details-link"
        >
          View Details
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
