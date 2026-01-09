"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const heroImages = [
  "/images/homepage/imgi_115_h1sl1.jpg",
  "/images/homepage/imgi_116_h1sl2.jpg",
]

const SLIDE_DURATION = 10000 // 10 seconds

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length)
        setIsTransitioning(false)
      }, 500)
    }, SLIDE_DURATION)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <div className="relative w-full h-[70vh] md:h-[80vh] rounded-2xl overflow-hidden shadow-2xl">
        {/* Background Images with Crossfade */}
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Hero background ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
          <h1
            className="text-[#F16D34] text-[14vw] md:text-[10vw] lg:text-[8vw] leading-[0.85] font-bold uppercase tracking-tight drop-shadow-lg"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            SIXTHGEAR
          </h1>
          <p
            className="text-white/90 text-base md:text-lg lg:text-xl mt-3 md:mt-4 tracking-[0.25em] uppercase"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Moto Supply & Café
          </p>

          {/* CTA Button */}
          <LocalizedClientLink
            href="/store"
            className="mt-8 md:mt-10 group relative inline-flex items-center justify-center"
          >
            <span className="relative z-10 px-8 py-3 md:px-10 md:py-4 bg-[#F16D34] text-white text-sm md:text-base font-semibold uppercase tracking-wider rounded-full transition-all duration-300 group-hover:bg-[#d85a25] group-hover:shadow-lg group-hover:shadow-[#F16D34]/30">
              Shop Now
            </span>
          </LocalizedClientLink>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "w-8 bg-[#F16D34]"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
          <p
            className="text-white/60 max-w-[180px] md:max-w-[220px] text-left text-[10px] md:text-xs leading-relaxed hidden sm:block"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Your one-stop shop for motorcycle gear, parts, and great coffee.
          </p>
          <p
            className="text-white/60 text-right text-[10px] md:text-xs hidden sm:block"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Makati, Philippines
          </p>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div
            className="h-full bg-[#F16D34] transition-all ease-linear"
            style={{
              width: "100%",
              animation: `progress ${SLIDE_DURATION}ms linear infinite`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
