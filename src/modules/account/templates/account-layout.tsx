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
  // Dashboard layout for logged-in users
  return (
    <div className="min-h-screen bg-gray-50/50" data-testid="account-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="mb-6 px-2 hidden lg:block">
                 <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                    Account
                 </h1>
                 <p className="text-sm text-gray-500 mt-1">
                    Manage your info
                 </p>
              </div>
              <AccountNav customer={customer} />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
             <div className="animate-fade-in-up">
                {children}
             </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
