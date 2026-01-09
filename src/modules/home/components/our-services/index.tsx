"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const serviceImages = [
  "/images/homepage/imgi_115_h1sl1.jpg",
  "/images/homepage/imgi_116_h1sl2.jpg",
]

const SLIDE_DURATION = 10000

const OurServices = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % serviceImages.length)
    }, SLIDE_DURATION)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
      {/* Main Services Card - Black */}
      <div className="relative w-full h-[70vh] md:h-[80vh] bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          {/* Left Image Slideshow */}
          <div className="relative hidden lg:block order-1">
            <div className="absolute inset-4 lg:inset-8 rounded-xl overflow-hidden shadow-lg">
              {serviceImages.map((image, index) => (
                <div
                  key={image}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Services ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              ))}
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                {serviceImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? "w-6 bg-[#F16D34]"
                        : "w-1.5 bg-white/60 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16 z-10 order-2">
            {/* Title */}
            <h2
              className="text-[#F16D34] text-[12vw] md:text-[8vw] lg:text-[6vw] leading-[0.9] font-bold uppercase tracking-tight"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              Our Services
            </h2>

            {/* Bottom Section - Button and Description */}
            <div className="flex flex-col gap-6">
              {/* CTA Button */}
              <LocalizedClientLink
                href="/services"
                className="inline-flex items-center gap-3 px-5 py-3 bg-[#F16D34] text-white text-sm font-medium rounded-lg hover:bg-[#d85a25] transition-all duration-300 group w-fit"
              >
                <span style={{ fontFamily: "Inter Display, sans-serif" }}>
                  View all services
                </span>
                <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F16D34"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </LocalizedClientLink>

              {/* Description */}
              <p
                className="text-white/90 text-base md:text-lg lg:text-xl leading-relaxed max-w-md font-medium"
                style={{
                  fontFamily: "Inter Display, sans-serif",
                  fontWeight: 500,
                }}
              >
                Professional motorcycle care from routine maintenance to
                complete customization. Your ride deserves the best.
              </p>
            </div>
          </div>

          {/* Mobile Image */}
          <div className="relative lg:hidden h-48 md:h-64 order-1">
            <div className="absolute inset-4 rounded-xl overflow-hidden">
              {serviceImages.map((image, index) => (
                <div
                  key={image}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Services ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurServices
