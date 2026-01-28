"use client"

/**
 * About Services Section
 * What We Offer - True Bento Grid Layout
 */

import Image from "next/image"
import Link from "next/link"

interface ServiceCard {
  id: number
  title: string
  description: string
  backgroundImage: string | null
  linkUrl?: string
}

interface AboutServicesProps {
  sectionName?: string
  heading?: string
  cards?: ServiceCard[]
}

const defaultServices: ServiceCard[] = [
  {
    id: 1,
    title: "Motorcycle Service & Diagnostics",
    description:
      "PMS, repairs, detailing, and performance upgrades for big bikes and premium motorcycles.",
    backgroundImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    linkUrl: "/services",
  },
  {
    id: 2,
    title: "Parts, Accessories & Luggage",
    description:
      "Helmets, riding gear, bags, communications, parts, and accessories from trusted brands.",
    backgroundImage:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    linkUrl: "/store",
  },
  {
    id: 3,
    title: "Rider Apparel & Gear",
    description:
      "Protective riding gear and lifestyle apparel designed for comfort, safety, and style.",
    backgroundImage:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    linkUrl: "/store",
  },
  {
    id: 4,
    title: "Café & Rider Lounge",
    description:
      "Relax, connect, and refuel with First Gear Coffee in a space built for riders.",
    backgroundImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    linkUrl: "/menu",
  },
]

export default function AboutServices({
  sectionName = "What We Offer",
  heading = "Complete Care for\nYour Ride",
  cards = defaultServices,
}: AboutServicesProps) {
  // Split heading by newline
  const headingParts = heading.split("\n")

  // Render a single card
  const renderCard = (
    service: ServiceCard,
    className: string,
    isLarge: boolean = false
  ) => {
    const CardContent = (
      <>
        <Image
          src={service.backgroundImage || "/images/placeholder.jpg"}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div
          className={`absolute bottom-0 left-0 right-0 ${
            isLarge ? "p-6" : "p-5"
          }`}
        >
          <h3
            className={`${
              isLarge ? "text-xl md:text-2xl" : "text-lg md:text-xl"
            } text-white uppercase leading-tight ${isLarge ? "mb-2" : "mb-1"}`}
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {service.title}
          </h3>
          <p
            className={`text-gray-${isLarge ? "300" : "400"} ${
              isLarge ? "text-sm" : "text-xs md:text-sm"
            } leading-relaxed ${isLarge ? "" : "line-clamp-2"} ${
              isLarge ? "max-w-md" : ""
            }`}
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            {service.description}
          </p>
        </div>
      </>
    )

    // If linkUrl is provided and not empty, make it clickable
    if (service.linkUrl && service.linkUrl.trim() !== "") {
      return (
        <Link
          key={service.id}
          href={service.linkUrl}
          className={`group relative ${className} rounded-2xl overflow-hidden cursor-pointer`}
        >
          {CardContent}
        </Link>
      )
    }

    // Otherwise, render as a div
    return (
      <div
        key={service.id}
        className={`group relative ${className} rounded-2xl overflow-hidden`}
      >
        {CardContent}
      </div>
    )
  }

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
            {sectionName}
          </span>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[1.1] mt-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {headingParts.map((part, index) => (
              <span key={index}>
                {index === headingParts.length - 1 ? (
                  <span className="text-[#F16D34]">{part}</span>
                ) : (
                  <>
                    {part}
                    <br />
                  </>
                )}
              </span>
            ))}
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Row 1 */}
          {/* Service 1 - Large Left (spans 1 col, 2 rows) */}
          {cards[0] &&
            renderCard(
              cards[0],
              "md:row-span-2 min-h-[300px] md:min-h-[500px]",
              true
            )}

          {/* Service 2 - Top Right */}
          {cards[1] && renderCard(cards[1], "min-h-[240px]")}

          {/* Service 3 - Top Far Right */}
          {cards[2] && renderCard(cards[2], "min-h-[240px]")}

          {/* Row 2 */}
          {/* Service 4 - Bottom Right (spans 2 cols) */}
          {cards[3] &&
            renderCard(cards[3], "md:col-span-2 min-h-[240px]", true)}
        </div>
      </div>
    </section>
  )
}
