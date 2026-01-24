"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface Brand {
  name: string
  slug: string
  image: string
}

const brands: Brand[] = [
  {
    name: "Akrapovic",
    slug: "akrapovic",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  },
  {
    name: "SEC Moto",
    slug: "sec-moto",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop",
  },
  {
    name: "MotoHub",
    slug: "motohub",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop",
  },
  {
    name: "Motul",
    slug: "motul",
    image: "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&h=600&fit=crop",
  },
]

const stats = [
  {
    icon: "⭐",
    title: "Rider-Built Experience",
    description: "Years of hands-on motorcycle expertise",
  },
  {
    icon: "🏍️",
    title: "Trusted by Riders",
    description: "Preferred by riders and enthusiasts",
  },
  {
    icon: "⚡",
    title: "Fast Turnaround",
    description: "Efficient, reliable service delivery",
  },
  {
    icon: "🔩",
    title: "Genuine Parts & Accessories",
    description: "Trusted OEM and premium aftermarket",
  },
]

export default function ShopByBrands() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="w-full bg-white">
      {/* Brands Section */}
      <div className="py-6 md:py-8">
        <div className="w-full px-2 sm:px-3 md:px-4">
          {/* Section Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-tight px-1 sm:px-2">
            Greatest Brands
          </h2>

          {/* Brands Grid - Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
            {brands.map((brand, index) => (
              <LocalizedClientLink
                key={brand.slug}
                href={`/store?brand=${brand.slug}`}
                className="group relative overflow-hidden bg-gray-900 transition-all duration-500 ease-out touch-manipulation"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(index)}
                onTouchEnd={() => setTimeout(() => setHoveredIndex(null), 300)}
                style={{
                  transform:
                    hoveredIndex === index ? "scaleX(1.15)" : "scaleX(1)",
                  zIndex: hoveredIndex === index ? 10 : 1,
                  transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Image Container - Responsive Aspect Ratios */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
                    style={{
                      backgroundImage: `url(${brand.image})`,
                      transform:
                        hoveredIndex === index ? "scale(1.25)" : "scale(1)",
                    }}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 group-active:bg-black/30 transition-colors duration-500" />

                  {/* Content - Responsive Sizing */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-8">
                    {/* Brand Name - Responsive Text */}
                    <h3 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 md:mb-4 uppercase tracking-wide">
                      {brand.name}
                    </h3>

                    {/* Shop Now Button - Responsive */}
                    <div className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider opacity-90 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300">
                      <span>Shop Now</span>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-2 group-active:translate-x-2"
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
        </div>
      </div>

      {/* Stats Strip */}
      <div className="w-full bg-[#f5f5f5] border-t border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-start gap-3 md:gap-4"
              >
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl md:text-3xl">
                  {stat.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-tight mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
