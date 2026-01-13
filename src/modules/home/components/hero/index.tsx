"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const heroImages = [
  "/images/homepage/imgi_115_h1sl1.jpg",
  "/images/homepage/imgi_116_h1sl2.jpg",
]

const SLIDE_DURATION = 8000

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    setProgress(0)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setProgress(0)
  }

  useEffect(() => {
    if (isPaused) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + 100 / (SLIDE_DURATION / 50)
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [isPaused, nextSlide])

  return (
    <div className="px-3 md:px-6 lg:px-8 py-3 md:py-6">
      <div
        className="relative w-full h-[85vh] md:h-[90vh] rounded-3xl overflow-hidden shadow-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Images with Ken Burns Effect */}
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={image}
              alt={`Hero background ${index + 1}`}
              fill
              priority={index === 0}
              className={`object-cover transition-transform duration-[8000ms] ease-out ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#F16D34]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl" />

        {/* Main Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
          {/* Animated Badge */}
          <div className="mb-6 md:mb-8 animate-fade-in-down">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-xs md:text-sm font-medium tracking-wide">
              <span className="w-2 h-2 bg-[#F16D34] rounded-full animate-pulse" />
              Premium Motorcycle Gear
            </span>
          </div>

          {/* Main Title */}
          <h1
            className="text-[#F16D34] text-[16vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] font-bold uppercase tracking-tight"
            style={{
              fontFamily: "Tanker, sans-serif",
              textShadow:
                "0 4px 30px rgba(241, 109, 52, 0.3), 0 0 80px rgba(241, 109, 52, 0.1)",
            }}
          >
            SIXTHGEAR
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/90 text-sm md:text-lg lg:text-xl mt-4 md:mt-6 tracking-[0.3em] uppercase font-light"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Moto Supply & Café
          </p>

          {/* Tagline */}
          <p className="text-white/60 text-xs md:text-sm mt-3 max-w-md tracking-wide">
            Your one-stop destination for premium motorcycle gear, parts, and
            great coffee
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 md:mt-12">
            <LocalizedClientLink
              href="/store"
              className="group relative inline-flex items-center justify-center overflow-hidden"
            >
              <span className="relative z-10 px-8 py-4 md:px-12 md:py-5 bg-[#F16D34] text-white text-sm md:text-base font-semibold uppercase tracking-wider rounded-full transition-all duration-500 group-hover:bg-[#ff7a3d] group-hover:shadow-2xl group-hover:shadow-[#F16D34]/40 group-hover:scale-105 flex items-center gap-3">
                Shop Now
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
              </span>
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/collections"
              className="group relative inline-flex items-center justify-center"
            >
              <span className="relative z-10 px-8 py-4 md:px-12 md:py-5 bg-white/10 backdrop-blur-sm text-white text-sm md:text-base font-semibold uppercase tracking-wider rounded-full border border-white/30 transition-all duration-500 group-hover:bg-white/20 group-hover:border-white/50 group-hover:scale-105">
                Browse Collections
              </span>
            </LocalizedClientLink>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden ${
                index === currentSlide
                  ? "w-12 bg-white/30"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <div
                  className="absolute inset-y-0 left-0 bg-[#F16D34] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Side Navigation Arrows */}
        <button
          onClick={() =>
            goToSlide(
              (currentSlide - 1 + heroImages.length) % heroImages.length
            )
          }
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroImages.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
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
        </button>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-8 left-6 right-6 flex justify-between items-end z-10 pointer-events-none">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Makati, Philippines</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Open Daily 9AM - 9PM</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/40 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Hero
