"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Order Details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          data-testid="back-to-overview-button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Back to overview
        </LocalizedClientLink>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Order Info */}
        <OrderDetails order={order} showStatus />

        {/* Items */}
        <div className="bg-white rounded-lg border border-gray-200/60 overflow-hidden">
          <Items order={order} />
        </div>

        {/* Two Column Layout for Shipping and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Details */}
          <ShippingDetails order={order} />

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200/60 p-6 h-fit">
            <OrderSummary order={order} />
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg border border-gray-200/60 p-6">
          <Help />
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
