"use client"

/**
 * About Services Section
 * What We Offer - True Bento Grid Layout
 */

import Image from "next/image"

const services = [
  {
    id: 1,
    title: "Motorcycle Service & Diagnostics",
    description:
      "PMS, repairs, detailing, and performance upgrades for big bikes and premium motorcycles.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    id: 2,
    title: "Parts, Accessories & Luggage",
    description:
      "Helmets, riding gear, bags, communications, parts, and accessories from trusted brands.",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
  },
  {
    id: 3,
    title: "Rider Apparel & Gear",
    description:
      "Protective riding gear and lifestyle apparel designed for comfort, safety, and style.",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
  },
  {
    id: 4,
    title: "Café & Rider Lounge",
    description:
      "Relax, connect, and refuel with First Gear Coffee in a space built for riders.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  },
]

export default function AboutServices() {
  return (
    <section className="bg-[#1a1a1a] py-20 md:py-28 lg:py-36 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span
            className="text-[#F16D34] text-sm md:text-base font-semibold uppercase tracking-widest"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            What We Offer
          </span>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[1.1] mt-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Complete Care for
            <br />
            <span className="text-[#F16D34]">Your Ride</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Row 1 */}
          {/* Service 1 - Large Left (spans 1 col, 2 rows) */}
          <div className="group relative md:row-span-2 rounded-2xl overflow-hidden cursor-pointer min-h-[300px] md:min-h-[500px]">
            <Image
              src={services[0].image}
              alt={services[0].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3
                className="text-xl md:text-2xl text-white uppercase leading-tight mb-2"
                style={{ fontFamily: "Tanker, sans-serif" }}
              >
                {services[0].title}
              </h3>
              <p
                className="text-gray-300 text-sm leading-relaxed"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {services[0].description}
              </p>
            </div>
          </div>

          {/* Service 2 - Top Right */}
          <div className="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[240px]">
            <Image
              src={services[1].image}
              alt={services[1].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3
                className="text-lg md:text-xl text-white uppercase leading-tight mb-1"
                style={{ fontFamily: "Tanker, sans-serif" }}
              >
                {services[1].title}
              </h3>
              <p
                className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {services[1].description}
              </p>
            </div>
          </div>

          {/* Service 3 - Top Far Right */}
          <div className="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[240px]">
            <Image
              src={services[2].image}
              alt={services[2].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3
                className="text-lg md:text-xl text-white uppercase leading-tight mb-1"
                style={{ fontFamily: "Tanker, sans-serif" }}
              >
                {services[2].title}
              </h3>
              <p
                className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {services[2].description}
              </p>
            </div>
          </div>

          {/* Row 2 */}
          {/* Service 4 - Bottom Right (spans 2 cols) */}
          <div className="group relative md:col-span-2 rounded-2xl overflow-hidden cursor-pointer min-h-[240px]">
            <Image
              src={services[3].image}
              alt={services[3].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3
                className="text-xl md:text-2xl text-white uppercase leading-tight mb-2"
                style={{ fontFamily: "Tanker, sans-serif" }}
              >
                {services[3].title}
              </h3>
              <p
                className="text-gray-300 text-sm leading-relaxed max-w-md"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {services[3].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
