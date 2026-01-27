"use client"

import { companyData } from "@lib/company-data"
import Image from "next/image"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ServiceCategory } from "@lib/services-data"

// Popular services to tag
const popularServices = [
  "Periodic Maintenance Service (PMS)",
  "ECU Scan & Error Code Diagnosis",
  "Ceramic Coating & Paint Protection",
  "Tyre Replacement & Wheel Balancing",
]

interface ServicesDropdownProps {
  servicesData: ServiceCategory[]
}

const ServicesDropdown = ({ servicesData }: ServicesDropdownProps) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  // Use CMS services data (already sorted by order from Strapi)
  const categories = servicesData

  return (
    <div className="bg-white w-full">
      {/* 90% Width Container - Reduced padding for smaller height */}
      <div className="mx-auto w-[90%] py-6">
        <div className="flex flex-col gap-6">
          {/* Main Content: Categories (Left) + Services (Right) */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Categories List */}
            <div className="col-span-12 lg:col-span-3 border-r border-gray-100 pr-6">
              <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-gray-900">
                Services Category
              </h3>
              <div className="flex flex-col gap-0.5">
                {categories.map((service, index) => (
                  <LocalizedClientLink
                    key={service.id}
                    href={`/services/${service.slug}`}
                    onMouseEnter={() => setActiveCategoryIndex(index)}
                    className={`text-left px-3 py-2 text-sm font-semibold transition-all duration-150 ${
                      activeCategoryIndex === index
                        ? "text-gray-900 bg-gray-50"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {service.title}
                  </LocalizedClientLink>
                ))}
              </div>
              <div className="mt-6 px-3">
                <LocalizedClientLink
                  href="/contact"
                  className="block w-full py-3 text-center bg-[#1a1a1a] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#F16D34] transition-colors rounded-md"
                >
                  Book Now
                </LocalizedClientLink>
              </div>
            </div>

            {/* Right Column: Active Services Display */}
            <div className="col-span-12 lg:col-span-9 pl-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
                  {categories[activeCategoryIndex]?.title || "Services"}
                </h2>
                <LocalizedClientLink
                  href={`/services/${
                    categories[activeCategoryIndex]?.slug || ""
                  }`}
                  className="text-xs font-bold text-[#F16D34] hover:text-[#d95a2b] transition-colors uppercase tracking-wider"
                >
                  View All →
                </LocalizedClientLink>
              </div>

              {/* Service Items Grid - 3 columns, compact */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {categories[activeCategoryIndex]?.items
                  .slice(0, 6)
                  .map((item, i) => {
                    const isPopular = popularServices.includes(item)
                    return (
                      <LocalizedClientLink
                        key={i}
                        href={`/services/${categories[activeCategoryIndex].slug}`}
                        className="group relative p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm bg-white transition-all duration-200"
                      >
                        {isPopular && (
                          <span className="absolute -top-2 right-2 px-2 py-0.5 bg-[#F16D34] text-white text-[10px] font-bold uppercase tracking-wide rounded">
                            Popular
                          </span>
                        )}
                        <span className="font-semibold text-gray-800 text-sm block group-hover:text-gray-900 transition-colors">
                          {item}
                        </span>
                      </LocalizedClientLink>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* Bottom Section: Brands - No hover effects */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400">
                Brands We Service
              </h3>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {companyData.serviceMenu.brands.map((brand, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-4 rounded-[10px] bg-gray-50/80"
                >
                  <div className="relative w-full h-10 mb-2 grayscale opacity-60">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesDropdown
