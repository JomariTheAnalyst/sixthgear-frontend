/**
 * Shop By Categories Section
 * Modern, professional grid layout with hover effects
 */

"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    name: "Bags and Luggage",
    slug: "bags-and-luggage",
    image: "/images/product-categories/bags-and-boxes (1).png",
  },
  {
    name: "Communications",
    slug: "communications",
    image: "/images/product-categories/intercom.png",
  },
  {
    name: "Helmets",
    slug: "helmets",
    image: "/images/product-categories/helmets.png",
  },
  {
    name: "Parts and Accessories",
    slug: "parts-and-accessories",
    image: "/images/product-categories/exhaust.png", // Using exhaust as placeholder for parts
  },
  {
    name: "Riding Gear",
    slug: "riding-gear",
    image: "/images/product-categories/shoes.png", // Using shoes/gear image
  },
  {
    name: "Apparel",
    slug: "apparel",
    image: "/images/product-categories/apparel.png",
  },
]

function CategoryCard({
  name,
  slug,
  image,
  index,
}: {
  name: string
  slug: string
  image: string
  index: number
}) {
  return (
    <LocalizedClientLink
      href={`/store?category=${slug}`}
      className="group block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative flex flex-col items-center">
        {/* Card Container with subtle background */}
        <div className="relative w-full bg-gradient-to-b from-gray-50 to-white rounded-2xl p-4 pb-0 transition-all duration-500 group-hover:from-orange-50 group-hover:to-white group-hover:shadow-xl group-hover:shadow-orange-100/50">
          {/* Product Image */}
          <div className="relative z-10 h-[160px] md:h-[180px] lg:h-[200px] w-full flex items-center justify-center mb-4">
            <Image
              src={image}
              alt={name}
              width={220}
              height={200}
              className="object-contain max-h-full w-auto transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-3 filter drop-shadow-lg group-hover:drop-shadow-2xl"
            />
          </div>

          {/* Orange Label - Clean flat design */}
          <div className="relative -mx-4 mt-auto">
            <div className="bg-[#F16D34] py-4 px-6 text-center transition-all duration-300 group-hover:bg-[#e55f26] rounded-b-2xl">
              <span className="text-white font-semibold text-sm md:text-base uppercase tracking-wide">
                {name}
              </span>
            </div>
          </div>
        </div>

        {/* Hover indicator arrow */}
        <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <svg
            className="w-5 h-5 text-white"
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
    </LocalizedClientLink>
  )
}

export default function ShopByCategories() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {/* Left line */}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />

          {/* Title with accent */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-tight">
              Shop By <span className="text-[#F16D34]">Categories</span>
            </h2>
          </div>

          {/* Right line */}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-500 mt-4 text-sm md:text-base max-w-2xl mx-auto">
          Find the perfect gear for your ride. Quality products from trusted
          brands.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              slug={category.slug}
              image={category.image}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-12 md:mt-16">
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium rounded-full transition-all duration-300 hover:bg-[#F16D34] hover:shadow-lg hover:shadow-orange-200/50 group"
        >
          <span>View All Products</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
        </LocalizedClientLink>
      </div>
    </section>
  )
}
