"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)
  const addressCount = customer?.addresses?.length || 0
  const orderCount = orders?.length || 0

  return (
    <div data-testid="overview-page-wrapper" className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Profile"
          value={`${profileCompletion}%`}
          subtitle="Completed"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
          color="blue"
          href="/account/profile"
          testId="customer-profile-completion"
          dataValue={profileCompletion}
        />
        <StatCard
          title="Addresses"
          value={addressCount.toString()}
          subtitle="Saved"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
          color="green"
          href="/account/addresses"
          testId="addresses-count"
          dataValue={addressCount}
        />
        <StatCard
          title="Orders"
          value={orderCount.toString()}
          subtitle="Total"
          icon={
            <svg
              className="w-6 h-6"
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
          }
          color="orange"
          href="/account/orders"
          testId="orders-count"
          dataValue={orderCount}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          {orders && orders.length > 0 && (
            <LocalizedClientLink
              href="/account/orders"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View all →
            </LocalizedClientLink>
          )}
        </div>
        <div data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <LocalizedClientLink
                  key={order.id}
                  href={`/account/orders/details/${order.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                  data-testid="order-wrapper"
                  data-value={order.id}
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
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
                          <p
                            className="font-medium text-gray-900"
                            data-testid="order-id"
                            data-value={order.display_id}
                          >
                            Order #{order.display_id}
                          </p>
                          <p
                            className="text-sm text-gray-500"
                            data-testid="order-created-date"
                          >
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p
                            className="font-semibold text-gray-900"
                            data-testid="order-amount"
                          >
                            {convertToLocale({
                              amount: order.total,
                              currency_code: order.currency_code,
                            })}
                          </p>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      </div>
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          ) : (
            <div
              className="px-6 py-12 text-center"
              data-testid="no-orders-message"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <h3 className="text-gray-900 font-medium mb-1">No orders yet</h3>
              <p className="text-gray-500 text-sm mb-4">
                Start shopping to see your orders here
              </p>
              <LocalizedClientLink
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Start Shopping
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickActionCard
          title="Update Profile"
          description="Keep your personal information up to date"
          href="/account/profile"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          }
        />
        <QuickActionCard
          title="Manage Addresses"
          description="Add or edit your delivery addresses"
          href="/account/addresses"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  href,
  testId,
  dataValue,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  color: "blue" | "green" | "orange"
  href: string
  testId: string
  dataValue: number
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  }

  return (
    <LocalizedClientLink href={href}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p
              className="text-3xl font-bold text-gray-900 mt-1"
              data-testid={testId}
              data-value={dataValue}
            >
              {value}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
              {subtitle}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

// Quick Action Card Component
const QuickActionCard = ({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}) => {
  return (
    <LocalizedClientLink href={href}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
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
        </div>
      </div>
    </LocalizedClientLink>
  )
}

// Order Status Badge Component
const OrderStatusBadge = ({ status }: { status: string }) => {
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

  const config = statusConfig[status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: status,
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
