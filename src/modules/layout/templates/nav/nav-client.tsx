"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"

import { StoreRegion, HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import MobileMenu from "./mobile-menu"
import Link from "next/link"
import SearchBar from "@modules/layout/components/search-bar"
import MobileSearchButton from "@modules/search/components/mobile-search-button"
import Logo from "@modules/layout/components/brand-logo"
import ServicesDropdown from "@modules/layout/components/services-dropdown"
import { ServiceCategory } from "@lib/services-data"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Shop", href: "/store" },
  { name: "Services", href: "/services", hasDropdown: true },
  { name: "First Gear Coffee", href: "/menu" },
  { name: "Contact", href: "/contact" },
]

interface NavClientProps {
  regions: StoreRegion[]
  cart: HttpTypes.StoreCart | null
  servicesData: ServiceCategory[]
  customer: HttpTypes.StoreCustomer | null
  wishlistCount: number
}

const NavClient = ({
  regions,
  cart,
  servicesData,
  customer,
  wishlistCount,
}: NavClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when pathname changes (navigation occurs)
  useEffect(() => {
    setIsServicesOpen(false)
  }, [pathname])

  // Helper to get initials
  const getInitials = () => {
    if (!customer) return ""
    const first = customer.first_name?.charAt(0) || ""
    const last = customer.last_name?.charAt(0) || ""
    const initials = (first + last).toUpperCase()
    return initials || customer.email?.charAt(0).toUpperCase() || "U"
  }

  const textClasses = "text-gray-900 hover:text-[#F16D34]"

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current)
    setIsServicesOpen(true)
  }

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setIsServicesOpen(false), 200)
  }

  const handleDropdownClick = () => {
    setIsServicesOpen(false)
  }

  return (
    <>
      <div
        className={`sticky top-10 inset-x-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <header
          ref={headerRef}
          className="relative mx-auto border-b border-gray-100 bg-white"
        >
          <nav className="content-container w-full h-full flex flex-col">
            {/* Top Bar: Search - Logo - Account/Cart */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100/50">
              {/* Left: Menu Toggle + Search Icon (Mobile) / Search Bar (Desktop) */}
              <div className="flex-1 flex items-center gap-1">
                {/* Mobile: Hamburger Menu + Search Icon */}
                <div className="md:hidden flex items-center gap-1">
                  <MobileMenu
                    regions={regions}
                    navLinks={navLinks}
                    servicesData={servicesData}
                  />
                  <MobileSearchButton />
                </div>
                {/* Desktop: Search Bar */}
                <div className="hidden md:block flex-1">
                  <SearchBar />
                </div>
              </div>

              {/* Center: Logo - Single Line */}
              <div className="flex-1 flex justify-center px-2">
                <LocalizedClientLink
                  href="/"
                  className="flex items-center justify-center whitespace-nowrap"
                >
                  <Logo />
                </LocalizedClientLink>
              </div>

              {/* Right: Account + Cart Icons - Always visible */}
              <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
                {/* Wishlist Icon */}
                <LocalizedClientLink
                  href="/wishlist"
                  className="hover:text-[#F16D34] transition-colors text-gray-900 p-2 md:p-0 relative"
                  title="Wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  {/* Wishlist Count Badge */}
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-5 md:h-5 bg-[#F16D34] text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </LocalizedClientLink>

                {/* Track Order Icon */}
                <LocalizedClientLink
                  href="/track-order"
                  className="hover:text-[#F16D34] transition-colors text-gray-900 p-2 md:p-0"
                  title="Track Order"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                </LocalizedClientLink>

                {/* Account Icon */}
                <LocalizedClientLink
                  href="/account"
                  className="hover:text-[#F16D34] transition-colors text-gray-900 p-2 md:p-0"
                >
                  {customer ? (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#F16D34] flex items-center justify-center text-white font-bold text-xs tracking-widest">
                      {getInitials()}
                    </div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 md:w-6 md:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  )}
                </LocalizedClientLink>

                {/* Cart Icon */}
                <div className="hover:text-[#F16D34] transition-colors text-gray-900">
                  <CartDropdown cart={cart} />
                </div>
              </div>
            </div>

            {/* Bottom Bar: Navigation Links */}
            <div className="hidden md:flex justify-center py-3">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li
                    key={link.name}
                    className="relative"
                    onMouseEnter={() =>
                      link.hasDropdown && handleServicesEnter()
                    }
                    onMouseLeave={() =>
                      link.hasDropdown && handleServicesLeave()
                    }
                  >
                    <LocalizedClientLink
                      href={link.href}
                      className={`relative px-2 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 group flex items-center gap-1 ${
                        link.hasDropdown && isServicesOpen
                          ? "text-[#F16D34]"
                          : textClasses
                      }`}
                    >
                      {link.name}
                      {link.hasDropdown && (
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isServicesOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#F16D34] transition-all duration-300 group-hover:w-full`}
                      />
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>
      </div>

      {/* Services Dropdown - Rendered Outside Header for Full Width with Smooth Animation */}
      <div
        className={`fixed inset-x-0 z-[100] bg-white shadow-2xl border-t border-gray-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] transform ${
          isServicesOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
        style={{ top: headerRef.current?.getBoundingClientRect().bottom || 0 }}
        onMouseEnter={handleServicesEnter}
        onMouseLeave={handleServicesLeave}
        onClick={handleDropdownClick}
      >
        <ServicesDropdown servicesData={servicesData} />
      </div>
    </>
  )
}

export default NavClient
