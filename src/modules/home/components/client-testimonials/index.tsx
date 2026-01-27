"use client"

import { useRef } from "react"

/**
 * Client Testimonials Section
 * Displays a list of testimonials from satisfied customers.
 * Now connected to Strapi CMS with field-level fallbacks.
 */

interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  avatar: string
}

interface ClientTestimonialsProps {
  sectionTitle?: string
  sectionDescription?: string
  testimonials?: Testimonial[]
}

const QuoteIcon = () => (
  <svg
    width="32"
    height="24"
    viewBox="0 0 32 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#F16D34]"
  >
    <path
      d="M0 15.6C0 9.8 1.6 5.6 4.8 3C8 0.4 11.6 -0.6 15.6 0L13.8 4.8C11.8 4.8 10 5.4 8.4 6.6C6.8 7.8 6 9.4 6 11.4V12H12V24H0V15.6ZM18 15.6C18 9.8 19.6 5.6 22.8 3C26 0.4 29.6 -0.6 33.6 0L31.8 4.8C29.8 4.8 28 5.4 26.4 6.6C24.8 7.8 24 9.4 24 11.4V12H30V24H18V15.6Z"
      fill="currentColor"
    />
  </svg>
)

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-[#F9F9F9] rounded-2xl p-6 md:p-8 flex flex-col h-full border border-gray-100 hover:shadow-lg transition-shadow duration-300 min-w-[300px] md:min-w-[350px]">
    {/* Quote Icon */}
    <div className="mb-4 flex justify-center">
      <QuoteIcon />
    </div>

    {/* Quote Text */}
    <p
      className="text-gray-700 text-sm md:text-base leading-relaxed flex-grow mb-6 italic text-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      &quot;{testimonial.quote}&quot;
    </p>

    {/* Author Info - Centered without image */}
    <div className="flex flex-col items-center text-center mt-auto">
      <span
        className="text-gray-900 text-base font-bold mb-1"
        style={{ fontFamily: "Inter Display, sans-serif" }}
      >
        {testimonial.name}
      </span>
      <span className="text-[#F16D34] text-xs uppercase tracking-wider font-semibold">
        {testimonial.role}
      </span>
    </div>
  </div>
)

export default function ClientTestimonials({
  sectionTitle = "What Clients Say",
  sectionDescription = "Trusted Motorcycle Service, Gear & Rider Experience",
  testimonials = [],
}: ClientTestimonialsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Don't render if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350 + 32 // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-16 gap-8">
          <div className="text-left max-w-2xl">
            <h2
              className="text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              {sectionTitle}
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium">
              {sectionDescription}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#F16D34] hover:text-white text-gray-900 transition-all"
              aria-label="Previous testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#F16D34] hover:text-white text-gray-900 transition-all"
              aria-label="Next testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 gap-6 md:gap-8 snap-x snap-mandatory scrollbar-hide px-2 -mx-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="snap-center">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
