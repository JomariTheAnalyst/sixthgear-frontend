"use client"

import { useState, useEffect, useRef } from "react"
import { menuData, type MenuCategory, type MenuItem } from "@lib/menu-data"

/**
 * First Gear Coffee Menu Template - Revamped
 * Professional, modern café menu with premium aesthetic
 * Card-based layout with images, horizontal scroll (mobile), prev/next buttons (desktop)
 */

// Menu Item Card Component - Card with image, fixed height, no hover
const MenuItemCard = ({ item }: { item: MenuItem }) => {
  // Use existing image if available, otherwise use placeholder
  const imageUrl =
    item.image ||
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"

  return (
    <article className="flex-shrink-0 w-[280px] md:w-[320px] h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md h-[480px] md:h-[500px] flex flex-col">
        {/* Image - Fixed height */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {/* Popular badge */}
          {item.popular && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-900 shadow-lg">
                Popular
              </span>
            </div>
          )}
        </div>

        {/* Content - Flexible height with overflow handling */}
        <div className="p-5 md:p-6 flex-1 flex flex-col overflow-hidden">
          {/* Item name */}
          <h3
            className="text-gray-900 text-xl md:text-2xl font-bold mb-2 tracking-tight flex-shrink-0"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {item.name}
          </h3>

          {/* Description - Scrollable if too long */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 flex-1 overflow-y-auto">
            {item.description}
          </p>

          {/* Bottom section - Fixed at bottom */}
          <div className="flex-shrink-0">
            {/* Size options (if available) */}
            {item.sizes && item.sizes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.sizes.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {size.size}
                  </span>
                ))}
              </div>
            )}

            {/* Customizations */}
            {item.customizations && item.customizations.length > 0 && (
              <p className="text-gray-500 text-xs italic">
                Available in: {item.customizations.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// Category Section Component with Carousel
const CategorySection = ({ category }: { category: MenuCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Card width + gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="scroll-mt-32 mb-16 md:mb-20" id={category.id}>
      {/* Category Header */}
      <div className="mb-6 md:mb-8">
        <h2
          className="text-3xl md:text-4xl text-gray-900 mb-3 font-bold tracking-tight"
          style={{ fontFamily: "Tanker, sans-serif" }}
        >
          {category.name}
        </h2>
        <p className="text-gray-600 text-base md:text-lg font-light max-w-2xl">
          {category.description}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Desktop Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#F16D34] transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Previous items"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#F16D34] transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Next items"
        >
          <svg
            className="w-6 h-6"
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
        </button>

        {/* Scrollable Cards Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {category.items.map((item) => (
            <div key={item.id} className="snap-start">
              <MenuItemCard item={item} />
            </div>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="md:hidden flex justify-center mt-4">
          <span className="text-xs text-gray-400 flex items-center gap-2">
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
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Swipe to explore
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
          </span>
        </div>
      </div>
    </section>
  )
}

export default function MenuTemplate() {
  const [activeCategory, setActiveCategory] = useState<string>("hot-coffee")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuData.map((cat) => ({
        id: cat.id,
        element: document.getElementById(cat.id),
      }))

      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        if (section.element) {
          const { offsetTop, offsetHeight } = section.element
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveCategory(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    setIsMobileMenuOpen(false)
    const element = document.getElementById(categoryId)
    if (element) {
      const offset = 120
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Hero Section with Image */}
      <div className="relative h-[50vh] md:h-[60vh] min-h-[400px] overflow-hidden">
        {/* Hero Image - Café Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80"
            alt="Coffee shop interior"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        </div>

        {/* Hero Content - Positioned to avoid nav overlap */}
        <div className="relative h-full flex items-center justify-center px-4 pt-24 md:pt-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Brand Label */}
            <div className="mb-4 md:mb-6">
              <span
                className="inline-block text-[#F16D34] text-sm md:text-base font-bold tracking-widest uppercase"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                First Gear Coffee
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-4xl md:text-6xl lg:text-7xl mb-4 md:mb-6 text-white leading-tight"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              Our Menu
            </h1>

            {/* Subtitle */}
            <p
              className="text-gray-200 text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{
                fontFamily: "Inter Display, sans-serif",
                fontWeight: 400,
              }}
            >
              Handcrafted brews served with passion. More than a pit stop—it's
              where riders refuel, relax, and reconnect.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 py-12 md:py-16">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1">
                {menuData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      ${
                        activeCategory === category.id
                          ? "bg-[#F16D34] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span
                      className="font-semibold text-sm tracking-wide"
                      style={{ fontFamily: "Inter Display, sans-serif" }}
                    >
                      {category.name}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Category Dropdown */}
          <div className="lg:hidden sticky top-20 z-30 bg-white border-b border-gray-200 -mx-4 px-4 py-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span
                className="font-semibold text-gray-900"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {menuData.find((cat) => cat.id === activeCategory)?.name ||
                  "Select Category"}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isMobileMenuOpen ? "rotate-180" : ""
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
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-40">
                {menuData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`
                      w-full text-left px-4 py-3 transition-colors
                      ${
                        activeCategory === category.id
                          ? "bg-[#F16D34] text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className="font-semibold text-sm"
                      style={{ fontFamily: "Inter Display, sans-serif" }}
                    >
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu Content */}
          <main className="flex-1 min-w-0">
            {menuData.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </main>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-[#47271f] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2
            className="text-3xl md:text-5xl mb-4 font-bold"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Visit Us Today
          </h2>
          <p
            className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto"
            style={{ fontFamily: "Inter Display, sans-serif", fontWeight: 400 }}
          >
            Experience the perfect blend of coffee culture and motorcycle
            passion at Sixthgear.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F16D34] hover:bg-[#ff7a3d] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ fontFamily: "Inter Display, sans-serif" }}
            >
              <span>Get Directions</span>
              <svg
                className="w-5 h-5"
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
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#47271f] hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              style={{ fontFamily: "Inter Display, sans-serif" }}
            >
              <span>View Services</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
