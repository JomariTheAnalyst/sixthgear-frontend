"use client"

import { useState, useMemo } from "react"
import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type StatusTab = "all" | "pending" | "shipped" | "delivered" | "returned"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  const [activeTab, setActiveTab] = useState<StatusTab>("all")

  // Filter orders based on fulfillment_status
  const filteredOrders = useMemo(() => {
    if (!orders) return []
    
    switch (activeTab) {
      case "pending":
        return orders.filter(o => 
          o.fulfillment_status === "not_fulfilled" || 
          o.fulfillment_status === "partially_fulfilled"
        )
      case "shipped":
        return orders.filter(o => 
          o.fulfillment_status === "fulfilled" || 
          o.fulfillment_status === "shipped" ||
          o.fulfillment_status === "partially_shipped"
        )
      case "delivered":
        return orders.filter(o => 
          o.fulfillment_status === "delivered" ||
          o.fulfillment_status === "partially_delivered"
        )
      case "returned":
        // Check for canceled or any return-related status
        return orders.filter(o => 
          o.fulfillment_status === "canceled" ||
          String(o.fulfillment_status).includes("return")
        )
      default:
        return orders
    }
  }, [orders, activeTab])

  // Count orders per tab
  const tabCounts = useMemo(() => {
    if (!orders) return { all: 0, pending: 0, shipped: 0, delivered: 0, returned: 0 }
    
    return {
      all: orders.length,
      pending: orders.filter(o => 
        o.fulfillment_status === "not_fulfilled" || 
        o.fulfillment_status === "partially_fulfilled"
      ).length,
      shipped: orders.filter(o => 
        o.fulfillment_status === "fulfilled" || 
        o.fulfillment_status === "shipped" ||
        o.fulfillment_status === "partially_shipped"
      ).length,
      delivered: orders.filter(o => 
        o.fulfillment_status === "delivered" ||
        o.fulfillment_status === "partially_delivered"
      ).length,
      returned: orders.filter(o => 
        o.fulfillment_status === "canceled" ||
        String(o.fulfillment_status).includes("return")
      ).length,
    }
  }, [orders])

  const tabs: { id: StatusTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "returned", label: "Returned" },
  ]

  if (!orders?.length) {
    return (
      <div
        className="bg-white rounded-lg border border-gray-200/60 p-16 text-center"
        data-testid="no-orders-container"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No orders yet
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">
          You haven&apos;t placed any orders yet. Start exploring our products and
          find something you love!
        </p>
        <LocalizedClientLink
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all font-medium text-sm shadow-sm"
          data-testid="continue-shopping-button"
        >
          Start Shopping
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8 -mb-px overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const count = tabCounts[tab.id]
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative py-4 px-1 text-sm font-medium whitespace-nowrap transition-colors
                  ${isActive 
                    ? "text-gray-900 border-b-2 border-gray-900" 
                    : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                  }
                `}
              >
                {tab.label}
                {count > 0 && (
                  <span 
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                      isActive 
                        ? "bg-gray-900 text-white" 
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-lg border border-gray-200/60 overflow-hidden hover:border-gray-300 transition-colors"
            >
              <OrderCard order={o} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200/60 p-12 text-center">
          <p className="text-gray-500 text-sm">
            No {activeTab === "all" ? "" : activeTab} orders found.
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderOverview
