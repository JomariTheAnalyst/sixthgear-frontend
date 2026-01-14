"use client"

import { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileMenu from "./mobile-menu"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Shop", href: "/store" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
]

interface NavClientProps {
  regions: StoreRegion[]
}

const NavClient = ({ regions }: NavClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
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
  const containerClasses = isScrolled || !isHomepage
    ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-100" 
    : "bg-transparent border-transparent"
    
  const textClasses = isScrolled || !isHomepage
    ? "text-gray-700 hover:text-[#F16D34]" 
    : "text-white hover:text-[#F16D34]"

  const logoClasses = isScrolled || !isHomepage
    ? "brightness-100" // Original
    : "brightness-0 invert" // White/Inverted

  const iconClasses = isScrolled || !isHomepage
    ? "text-gray-600 hover:text-[#F16D34]"
    : "text-white hover:text-[#F16D34]"
    
  return (
    <div className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled || !isHomepage ? "py-0" : "py-0"}`}>
      <header className={`relative h-20 md:h-24 mx-auto border-b duration-300 ${containerClasses}`}>
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
                <li key={link.name}>
                  <LocalizedClientLink
                    href={link.href}
                    className={`relative px-2 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-200 group ${textClasses}`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#F16D34] transition-all duration-300 group-hover:w-full`} />
                  </LocalizedClientLink>
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
            <Suspense
              fallback={
                <LocalizedClientLink
                  className={`p-2 transition-all duration-200 hover:scale-110 ${iconClasses}`}
                  href="/cart"
                  data-testid="nav-cart-link"
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
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <div className={`${iconClasses}`}>
                 <CartButton />
              </div>
            </Suspense>

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
