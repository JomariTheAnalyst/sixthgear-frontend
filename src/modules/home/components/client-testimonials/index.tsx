"use client"

/**
 * Client Testimonials Section
 * 3 testimonial cards: Services, Products, Coffee
 * Design based on reference image with quote icons and avatar
 */

import Image from "next/image"

interface Testimonial {
  id: number
  category: "services" | "products" | "coffee"
  quote: string
  name: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    category: "services",
    quote:
      "The carwash and detailing service here is top-notch! My motorcycle has never looked this clean. The attention to detail is incredible, and the staff really knows their stuff.",
    name: "Juan Dela Cruz",
    avatar: "/images/testimonials/avatar-1.jpg",
  },
  {
    id: 2,
    category: "products",
    quote:
      "I've been buying my riding gear from Sixthgear for years now. The quality is always excellent, and they have everything a rider needs. Best moto shop in town!",
    name: "Maria Santos",
    avatar: "/images/testimonials/avatar-2.jpg",
  },
  {
    id: 3,
    category: "coffee",
    quote:
      "Their coffee is amazing! I love hanging out here after a long ride. The espresso is rich and smooth, and the atmosphere is perfect for fellow riders.",
    name: "Carlos Reyes",
    avatar: "/images/testimonials/avatar-3.jpg",
  },
]

const QuoteIcon = () => (
  <svg
    width="40"
    height="32"
    viewBox="0 0 40 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#F5A623]"
  >
    <path
      d="M0 20.8C0 13.0667 2.13333 7.46667 6.4 4C10.6667 0.533333 15.4667 -0.8 20.8 0L18.4 6.4C15.7333 6.4 13.3333 7.2 11.2 8.8C9.06667 10.4 8 12.5333 8 15.2V16H16V32H0V20.8ZM24 20.8C24 13.0667 26.1333 7.46667 30.4 4C34.6667 0.533333 39.4667 -0.8 44.8 0L42.4 6.4C39.7333 6.4 37.3333 7.2 35.2 8.8C33.0667 10.4 32 12.5333 32 15.2V16H40V32H24V20.8Z"
      fill="currentColor"
    />
  </svg>
)

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-[#F5F0E8] rounded-2xl p-6 md:p-8 flex flex-col h-full">
    {/* Quote Icon */}
    <div className="mb-4">
      <QuoteIcon />
    </div>

    {/* Quote Text */}
    <p
      className="text-[#3D2314] text-sm md:text-base leading-relaxed flex-grow mb-6 uppercase tracking-wide font-semibold text-center"
      style={{ fontFamily: "Inter Display, sans-serif" }}
    >
      {testimonial.quote}
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 mt-auto">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#D4C4B0] flex-shrink-0">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={40}
          height={40}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails
            const target = e.target as HTMLImageElement
            target.style.display = "none"
          }}
        />
      </div>
      <span
        className="text-[#3D2314] text-sm font-medium"
        style={{ fontFamily: "Inter Display, sans-serif" }}
      >
        {testimonial.name}
      </span>
    </div>
  </div>
)

export default function ClientTestimonials() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-[#3D2314] text-4xl md:text-6xl lg:text-7xl uppercase"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            It&apos;s Our Customers
            <br />
            Who Love Us
          </h2>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
