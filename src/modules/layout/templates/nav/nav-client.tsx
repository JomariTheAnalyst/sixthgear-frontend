"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { StoreRegion, HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import MobileMenu from "./mobile-menu"
import { ServiceCategory } from "@lib/services-data"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Shop", href: "/store" },
  { name: "Services", href: "/services", hasDropdown: true },
  { name: "Contact", href: "/contact" },
]

interface NavClientProps {
  regions: StoreRegion[]
  cart: HttpTypes.StoreCart | null
  servicesData: ServiceCategory[]
}

const NavClient = ({ regions, cart, servicesData }: NavClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // Check if we are on the home page
  const isHome = pathname === "/" || pathname === "/us" || pathname === "/dk" // Adjust based on your localization pattern if needed, or better, check if path ends with / or country code
  // Simpler check: if it's strictly the landing page.
  // Actually, simplest is to check if we are on the homepage.
  // The user only mentioned "leaves the hero section", implying this effect is primarily for the homepage where the hero exists.
  // Unless the hero exists on all pages? Usually only Home.
  // Let's assume for now this effect is global but primarily seen on home. If on other pages we don't have a dark hero, we might default to "scrolled" state immediately?
  // User said "in the nav... make the nav once staring to leaves the hero section".
  // Let's assume on other pages we might want the white nav always? Or keep it consistent?
  // For now, I'll implement the scroll listener.

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

  // If not on home, maybe we always want the "scrolled" look (black text on white)?
  // But let's stick to the scroll behavior requested.
  // Note: if other pages have white background, white text won't be visible if we don't toggle.
  // So for non-home pages, we might want to force `isScrolled` styling or just start with dark text.
  // Given the request is specific to "hero section", I'll assume this specific dynamic behavior.

  // To be safe for other pages, let's verify if `pathname` indicates homepage.
  // Ideally, other pages should probably have the "scrolled" style (visible header).
  const isHomepage = pathname === "/" || /^\/[a-z]{2}$/.test(pathname) // Matches / or /us, /ph, etc.

  // Dynamic classes
  const containerClasses =
    isScrolled || !isHomepage
      ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-100"
      : "bg-transparent border-transparent"

  const textClasses =
    isScrolled || !isHomepage
      ? "text-gray-700 hover:text-[#F16D34]"
      : "text-white hover:text-[#F16D34]"

  const logoClasses =
    isScrolled || !isHomepage
      ? "brightness-100" // Original
      : "brightness-0 invert" // White/Inverted

  const iconClasses =
    isScrolled || !isHomepage
      ? "text-gray-600 hover:text-[#F16D34]"
      : "text-white hover:text-[#F16D34]"

  return (
    <div
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomepage ? "py-0" : "py-0"
      }`}
    >
      <header
        className={`relative h-20 md:h-24 mx-auto border-b duration-300 ${containerClasses}`}
      >
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Logo - Left */}
          <div className="flex-shrink-0 transition-all duration-300">
            <LocalizedClientLink href="/" className="flex items-center">
              <Image
                src="/images/logo/sixthgear-removebg-preview.png"
                alt="Sixthgear Logo"
                width={320}
                height={100}
                className={`h-20 md:h-28 w-auto object-contain -my-4 transition-all duration-300 ${logoClasses}`}
                priority
              />
            </LocalizedClientLink>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (link.hasDropdown) {
                      if (servicesTimeoutRef.current)
                        clearTimeout(servicesTimeoutRef.current)
                      setIsServicesOpen(true)
                    }
                  }}
                  onMouseLeave={() => {
                    if (link.hasDropdown) {
                      servicesTimeoutRef.current = setTimeout(
                        () => setIsServicesOpen(false),
                        150
                      )
                    }
                  }}
                >
                  <LocalizedClientLink
                    href={link.href}
                    className={`relative px-2 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-200 group flex items-center gap-1 ${textClasses}`}
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

                  {/* Services Dropdown */}
                  {link.hasDropdown && isServicesOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
                      onMouseEnter={() => {
                        if (servicesTimeoutRef.current)
                          clearTimeout(servicesTimeoutRef.current)
                      }}
                      onMouseLeave={() => {
                        servicesTimeoutRef.current = setTimeout(
                          () => setIsServicesOpen(false),
                          150
                        )
                      }}
                    >
                      <div
                        className={`backdrop-blur-xl rounded-xl shadow-2xl border p-6 min-w-[800px] transition-all duration-300 ${
                          isScrolled || !isHomepage
                            ? "bg-white/95 border-gray-200"
                            : "bg-[#0a0a0a]/95 border-white/10"
                        }`}
                      >
                        {/* Services Grid - 2 columns x 4 rows with icons */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                          {servicesData.map((service, index) => {
                            // Icon mapping for each service
                            const icons = [
                              // Service & Preventive Maintenance
                              <svg
                                key={index}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>,
                              // Repairs & Diagnostics
                              <svg
                                key={index}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                />
                              </svg>,
                              // Accessories & Custom Installation
                              <svg
                                key={index}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                                />
                              </svg>,
                              // Wheels, Drivetrain & Handling
                              <svg
                                key={index}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  strokeWidth={2}
                                />
                                <circle cx="12" cy="12" r="3" strokeWidth={2} />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 2v4m0 12v4M2 12h4m12 0h4"
                                />
                              </svg>,
                              // Detailing, Care & Protection
                              <svg
                                key={index}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                              </svg>,
                              // Performance & Upgrade Services
                              <svg
                                key={index}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>,
                              // Roadside Assistance & Recovery
                              <svg
                                key={index}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>,
                              // Rider Support & Convenience
                              <svg
                                key={index}
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>,
                            ]

                            return (
                              <LocalizedClientLink
                                key={service.id}
                                href={`/services/${service.slug}`}
                                className={`group/item flex items-start gap-4 p-3 rounded-lg transition-all duration-200 ${
                                  isScrolled || !isHomepage
                                    ? "hover:bg-gray-100"
                                    : "hover:bg-white/10"
                                }`}
                              >
                                <div
                                  className={`flex-shrink-0 transition-colors mt-0.5 ${
                                    isScrolled || !isHomepage
                                      ? "text-gray-700 group-hover/item:text-[#F16D34]"
                                      : "text-white group-hover/item:text-[#F16D34]"
                                  }`}
                                >
                                  {icons[index]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className={`font-bold text-sm mb-0.5 transition-colors ${
                                      isScrolled || !isHomepage
                                        ? "text-gray-900 group-hover/item:text-[#F16D34]"
                                        : "text-white group-hover/item:text-[#F16D34]"
                                    }`}
                                  >
                                    {service.title}
                                  </h4>
                                  <p
                                    className={`text-xs leading-relaxed line-clamp-2 ${
                                      isScrolled || !isHomepage
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {service.items[0]}
                                  </p>
                                </div>
                              </LocalizedClientLink>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - Account & Cart Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Account */}
            <LocalizedClientLink
              href="/account"
              className={`p-2 transition-all duration-200 hover:scale-110 ${iconClasses}`}
              data-testid="nav-account-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </LocalizedClientLink>

            {/* Cart */}
            <div className={`${iconClasses}`}>
              <CartDropdown cart={cart} />
            </div>

            {/* Mobile Menu */}
            <div className={`${textClasses}`}>
              <MobileMenu regions={regions} navLinks={navLinks} />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default NavClient
