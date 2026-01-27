"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { servicesData } from "@lib/services-data"

interface ServiceCard {
  id?: number
  title: string
  description: string
  image: string
  slug?: string
  link?: string // Add link field from Strapi
}

interface OurServicesProps {
  sectionTitle?: string
  sectionDescription?: string
  services?: Array<{
    id: number
    title: string
    description: string
    image: string | null
    link?: string // Add link field from Strapi
  }>
}

export default function OurServices({
  sectionTitle,
  sectionDescription,
  services,
}: OurServicesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Use Strapi content if provided, otherwise fall back to hardcoded
  const content = {
    title: sectionTitle || "Motorcycle Services",
    description: sectionDescription || "Bike Repair & Maintenance Services",
    cards: services
      ? services.map((service) => ({
          id: service.id,
          title: service.title,
          description: service.description,
          image: service.image || "/images/services/default.jpg",
          link: service.link, // Use link from Strapi
        }))
      : [
          {
            title: "Service & Preventive Maintenance",
            description:
              "Scheduled servicing, PMS, and inspections to keep your motorcycle reliable, safe, and ready for daily rides or long journeys.",
            image:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
            slug: "preventive-maintenance",
          },
          {
            title: "Repairs & Diagnostics",
            description:
              "Accurate troubleshooting and professional repairs using proper tools, experience, and diagnostics for dependable motorcycle performance.",
            image:
              "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
            slug: "repairs-diagnostics",
          },
          {
            title: "Accessories & Custom Installation",
            description:
              "Professional installation of accessories, electronics, protection, and touring upgrades, ensuring correct fitment, safety, and clean integration.",
            image:
              "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80",
            slug: "accessories-installation",
          },
          {
            title: "Wheels, Drivetrain & Handling",
            description:
              "Tyres, chains, sprockets, and handling components serviced and aligned for stability, control, and confident riding.",
            image:
              "https://images.unsplash.com/photo-1571293521801-fd3dbf02a4f2?w=800&q=80",
            slug: "wheels-drivetrain",
          },
          {
            title: "Detailing, Care & Protection",
            description:
              "Thorough cleaning, detailing, and protective treatments to restore, preserve, and enhance your motorcycle's appearance and condition.",
            image:
              "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
            slug: "detailing-protection",
          },
          {
            title: "Performance & Upgrade Services",
            description:
              "Carefully selected performance upgrades and tuning support to improve power delivery, efficiency, and overall riding experience.",
            image:
              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
            slug: "performance-upgrades",
          },
          {
            title: "Roadside Assistance & Recovery",
            description:
              "Emergency motorcycle towing, rescue, and recovery services to get you and your bike to safety when needed.",
            image:
              "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
            slug: "roadside-assistance",
          },
          {
            title: "Rider Support & Convenience",
            description:
              "Consultation, inspections, and after-service support designed to help riders make informed decisions and ride with confidence.",
            image:
              "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
            slug: "rider-support",
          },
        ],
  }

  // Don't render if no services
  if (content.cards.length === 0) {
    return null
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 md:mb-12 gap-4 md:gap-6">
          <div className="flex-1 text-center lg:text-left w-full lg:w-auto">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              {content.title}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-500 font-medium">
              {content.description}
            </p>
          </div>

          {/* Navigation Buttons - Desktop only (top right) */}
          <div className="hidden lg:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#fca311] hover:bg-[#e5940e] text-black transition-all hover:scale-105"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#fca311] hover:bg-[#e5940e] text-black transition-all hover:scale-105"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {content.cards.map((service, index) => {
            // Use link from Strapi if available, otherwise construct from slug
            const linkHref =
              service.link || (service.slug ? `/services/${service.slug}` : "#")
            const isClickable = !!(service.link || service.slug)

            const cardContent = (
              <>
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 75vw, (max-width: 768px) 60vw, 400px"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-300">
                  <h3
                    className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3"
                    style={{ fontFamily: "Inter Display, sans-serif" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3 md:mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                    {service.description}
                  </p>
                  <div className="h-1 w-12 bg-[#fca311] rounded-full group-hover:w-full transition-all duration-500" />
                </div>
              </>
            )

            return isClickable ? (
              <Link
                key={service.id || index}
                href={linkHref}
                className="relative flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-[350px] lg:w-[400px] h-[400px] md:h-[450px] lg:h-[500px] snap-center rounded-2xl overflow-hidden group cursor-pointer"
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={service.id || index}
                className="relative flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-[350px] lg:w-[400px] h-[400px] md:h-[450px] lg:h-[500px] snap-center rounded-2xl overflow-hidden group"
              >
                {cardContent}
              </div>
            )
          })}
        </div>

        {/* Navigation Buttons - Mobile/Tablet (centered below cards) */}
        <div className="flex lg:hidden justify-center gap-3 mt-6">
          <button
            onClick={() => scroll("left")}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#fca311] hover:bg-[#e5940e] text-black transition-all active:scale-95"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#fca311] hover:bg-[#e5940e] text-black transition-all active:scale-95"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
