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
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Motorcycle Brands We Service & Support
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            Experienced in servicing Japanese, American, and European motorcycles 
            with proper tools, care, and attention to detail.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
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
                  className="object-contain max-h-20 md:max-h-24 w-auto"
                />
              </div>
              {/* Brand Name */}
              <span className="text-gray-700 font-medium text-sm md:text-base">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
