"use client"

/**
 * About Us Hero Section
 * Premium hero with background image and overlay
 * Displays main tagline and introduction
 */

import Image from "next/image"

export default function AboutHero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/sixthgearleftsideimg.jpg"
          alt="Sixthgear Workshop"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F16D34]/20 backdrop-blur-sm rounded-full border border-[#F16D34]/30 mb-8">
          <span
            className="text-[#F16D34] text-sm md:text-base font-medium tracking-wide"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Built by Riders, For Riders
          </span>
        </div>

        {/* Main Title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white uppercase leading-[0.95] tracking-tight mb-6"
          style={{
            fontFamily: "Tanker, sans-serif",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          About <span className="text-[#F16D34]">Us</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/80 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "Inter Display, sans-serif" }}
        >
          We Offer Complete Diagnostics and Care for Your Motorcycle
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-[#F16D34] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
