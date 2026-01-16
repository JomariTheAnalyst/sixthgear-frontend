"use client"

import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const navItems = [
    {
      href: "/account",
      label: "Overview",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      testId: "overview-link",
    },
    {
      href: "/account/profile",
      label: "Profile",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      testId: "profile-link",
    },
    {
      href: "/account/addresses",
      label: "Addresses",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      testId: "addresses-link",
    },
    {
      href: "/account/orders",
      label: "Orders",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      testId: "orders-link",
    },
  ]

  return (
    <div>
      {/* Mobile Navigation */}
      <div className="lg:hidden" data-testid="mobile-account-nav">
        <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {navItems.map((item, index) => {
            const isActive =
              route === `/${countryCode}${item.href}` ||
              (item.href === "/account" && route === `/${countryCode}/account`)
            return (
              <LocalizedClientLink
                key={item.href}
                href={item.href}
                className={clx(
                  "flex items-center gap-3 px-4 py-3.5 transition-colors",
                  index !== navItems.length - 1 && "border-b border-gray-100",
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                )}
                data-testid={item.testId}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                )}
              </LocalizedClientLink>
            )
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-red-600 hover:bg-red-50 transition-colors"
            data-testid="logout-button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Log out</span>
          </button>
        </nav>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block" data-testid="account-nav">
        <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              My Account
            </h2>
          </div>
          <div className="p-2">
            {navItems.map((item) => {
              const isActive =
                route === `/${countryCode}${item.href}` ||
                (item.href === "/account" &&
                  route === `/${countryCode}/account`)
              return (
                <LocalizedClientLink
                  key={item.href}
                  href={item.href}
                  className={clx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-1",
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  data-testid={item.testId}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </LocalizedClientLink>
              )
            })}
          </div>
          <div className="p-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              data-testid="logout-button"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default AccountNav
