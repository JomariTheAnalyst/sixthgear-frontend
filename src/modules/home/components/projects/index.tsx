"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface ExperienceItem {
  id: number
  title: string
  description: string
  imageUrl: string
  isEnabled: boolean
}

interface ProjectsSectionProps {
  sectionTitle?: string
  sectionDescription?: string
  items?: ExperienceItem[]
}

const ProjectsSection = ({
  sectionTitle = "Our Space & Experiences",
  sectionDescription = "Great Coffee, Good Rides, Better Conversations",
  items = [],
}: ProjectsSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Don't render if no items
  if (!items || items.length === 0) {
    return null
  }

  const totalItems = items.length
  const maxDisplayItems = 6
  const displayItems = items.slice(0, maxDisplayItems)
  const hasMoreItems = totalItems > maxDisplayItems
  const showCarousel = displayItems.length > 3
  const itemsPerPage = 3
  const maxIndex = Math.max(0, displayItems.length - itemsPerPage)

  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex((prev) => Math.max(0, prev - 1))
    } else {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
    }
  }

  return (
    <section className="bg-[#2a2a2a] py-12 md:py-16 lg:py-24">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#F97316] to-[#D97706] rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {sectionTitle}
          </h2>

          {/* Subheading */}
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            {sectionDescription}
          </p>
        </div>

        {/* Mobile/Tablet: Horizontal Scroll */}
        <div className="lg:hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 md:px-8"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="group flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] bg-[#1a1a1a] rounded-2xl overflow-hidden snap-center"
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 45vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Mobile/Tablet */}
          <div className="flex justify-center gap-3 mt-6 px-4">
            <button
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  })
                }
              }}
              className="w-11 h-11 bg-[#F97316] hover:bg-[#EA580C] rounded-lg flex items-center justify-center transition-colors active:scale-95"
              aria-label="Previous"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    left: 320,
                    behavior: "smooth",
                  })
                }
              }}
              className="w-11 h-11 bg-[#F97316] hover:bg-[#EA580C] rounded-lg flex items-center justify-center transition-colors active:scale-95"
              aria-label="Next"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* View All Button - Mobile */}
          {hasMoreItems && (
            <div className="flex justify-center mt-6 px-4">
              <Link
                href="/experiences"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>View All Experiences</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Desktop: Carousel or Grid Layout */}
        <div className="hidden lg:block relative">
          {showCarousel ? (
            /* Carousel Mode - More than 3 items */
            <div className="relative px-16">
              {/* Navigation Arrows */}
              <button
                onClick={() => scroll("left")}
                disabled={currentIndex === 0}
                className={`absolute -left-2 top-1/3 -translate-y-1/2 z-10 w-12 h-12 bg-[#F97316] hover:bg-[#EA580C] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  currentIndex === 0
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100 hover:scale-110"
                }`}
                aria-label="Previous"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={currentIndex >= maxIndex}
                className={`absolute -right-2 top-1/3 -translate-y-1/2 z-10 w-12 h-12 bg-[#F97316] hover:bg-[#EA580C] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  currentIndex >= maxIndex
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100 hover:scale-110"
                }`}
                aria-label="Next"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div
                  className="flex gap-8 transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                  }}
                >
                  {displayItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex-shrink-0"
                      style={{ width: "calc(33.333% - 21.33px)" }}
                    >
                      <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2">
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="33vw"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#F97316] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "w-8 bg-[#F97316]"
                        : "w-2 bg-gray-600 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Grid Mode - 3 or fewer items */
            <div className="grid lg:grid-cols-3 gap-8 px-4 md:px-8">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-[#1a1a1a] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="33vw"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#F97316] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button - Desktop */}
          {hasMoreItems && (
            <div className="flex justify-center mt-12">
              <Link
                href="/experiences"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 inline-flex items-center gap-3 text-lg hover:scale-105"
              >
                <span>View All {totalItems} Experiences</span>
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
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
