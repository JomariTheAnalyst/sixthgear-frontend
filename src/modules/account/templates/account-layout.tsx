"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import AccountNav from "../components/account-nav"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  // If no customer (login/register page), render children without wrapper
  if (!customer) {
    return <>{children}</>
  }

  // Dashboard layout for logged-in users
  return (
    <div className="min-h-screen bg-gray-50" data-testid="account-page">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-bold shadow-lg">
              {customer.first_name?.charAt(0) || "U"}
              {customer.last_name?.charAt(0) || ""}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {customer.first_name || "User"}
              </h1>
              <p className="text-gray-300 text-sm">{customer.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <AccountNav customer={customer} />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm">
                Check our FAQ or contact our support team
              </p>
            </div>
            <a
              href="/customer-service"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              Customer Service
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
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
