"use client"

import Image from "next/image"

const brands = [
  { name: "Suzuki", logo: "/images/brands/brand1.png" },
  { name: "Yamaha", logo: "/images/brands/brand2.png" },
  { name: "KTM", logo: "/images/brands/brand3.png" },
  { name: "Kawasaki", logo: "/images/brands/brand4.png" },
  { name: "BMW", logo: "/images/brands/brand5.png" },
  { name: "Royal Enfield", logo: "/images/brands/brand6.png" },
]

export default function Brands() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8">
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Motorcycle Brands We Service & Support
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto">
            Experienced in servicing Japanese, American, and European
            motorcycles with proper tools, care, and attention to detail.
          </p>
        </div>

        {/* Mobile/Tablet: Horizontal Scroll */}
        <div className="lg:hidden">
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 md:px-8"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] flex flex-col items-center justify-center gap-3 snap-center"
              >
                {/* Logo */}
                <div className="bg-gray-50 rounded-2xl p-4 w-full aspect-square flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={100}
                    height={100}
                    className="object-contain max-h-16 w-auto"
                  />
                </div>
                {/* Brand Name */}
                <span className="text-gray-700 font-medium text-sm">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-8 px-4 md:px-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-4"
            >
              {/* Logo */}
              <div className="bg-gray-50 rounded-2xl p-6 w-full aspect-square flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={120}
                  className="object-contain max-h-24 w-auto"
                />
              </div>
              {/* Brand Name */}
              <span className="text-gray-700 font-medium text-base">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
