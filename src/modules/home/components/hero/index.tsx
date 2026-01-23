"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface HeroProps {
  trustBadge?: string
  title?: string
  description?: string
  primaryCta?: {
    text: string
    link: string
  }
  secondaryCta?: {
    text: string
    link: string
  }
  backgroundImage?: string | null
}

const Hero = ({
  trustBadge = "Trusted by 500+ Riders",
  title = "Best Bike\nRepair & Service",
  description = "Professional servicing, repairs, detailing & performance upgrades. Trusted by riders for precision and care.",
  primaryCta = { text: "More About Us", link: "/about" },
  secondaryCta = { text: "View Services", link: "/services" },
  backgroundImage = null,
}: HeroProps) => {
  // Split title by newline for rendering
  const titleLines = title.split("\n")

  // Use CMS background image if available, otherwise use default
  const bgImage = backgroundImage || "/images/homepage/banner-img.png"

  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] overflow-hidden flex flex-col">
      {/* Background Image - Different positioning for mobile */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          // CMS image - use regular img tag for external URLs
          <img
            src={bgImage}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-40 md:opacity-60"
          />
        ) : (
          // Default image - use Next.js Image
          <Image
            src={bgImage}
            alt="Hero Background"
            fill
            className="object-cover opacity-40 md:opacity-60"
            sizes="100vw"
            priority
          />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 md:bg-gradient-to-r md:from-black md:via-black/80 md:to-transparent" />
      </div>

      {/* Mobile & Tablet Layout */}
      <div className="relative z-10 w-full min-h-screen lg:hidden flex flex-col">
        {/* Content Container - Centered for mobile */}
        <div className="flex flex-col items-center justify-start pt-24 sm:pt-28 md:pt-32 px-5 sm:px-8 text-center flex-1">
          {/* Badge/Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6 animate-in fade-in slide-in-from-top duration-700">
            <span className="w-2 h-2 bg-[#F16D34] rounded-full animate-pulse" />
            <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">
              {trustBadge}
            </span>
          </div>

          {/* Main Heading - Improved typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] mb-5 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            {titleLines.map((line, index) => (
              <span key={index}>
                {index === 0 ? (
                  <span className="text-white">{line}</span>
                ) : (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B88746] via-[#F16D34] to-[#B88746]">
                    {line}
                  </span>
                )}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Subtext - More readable on mobile */}
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            {description}
          </p>

          {/* CTA Buttons - Stacked on mobile, side by side on tablet */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <LocalizedClientLink
              href={primaryCta.link}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#B88746] to-[#F16D34] text-white font-bold rounded-xl text-center shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-[0.98]"
            >
              {primaryCta.text}
            </LocalizedClientLink>

            <LocalizedClientLink
              href={secondaryCta.link}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl text-center hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              {secondaryCta.text}
            </LocalizedClientLink>
          </div>

          {/* Features Grid - Mobile */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
            <div className="flex items-start gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <span className="text-lg">⭐</span>
              <div className="text-left">
                <p className="text-white text-xs sm:text-sm font-semibold">
                  Rider-Built
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  Years of expertise
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <span className="text-lg">🏍</span>
              <div className="text-left">
                <p className="text-white text-xs sm:text-sm font-semibold">
                  Trusted
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  By riders & enthusiasts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <span className="text-lg">⚡</span>
              <div className="text-left">
                <p className="text-white text-xs sm:text-sm font-semibold">
                  Fast Service
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  Reliable turnaround
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <span className="text-lg">🔩</span>
              <div className="text-left">
                <p className="text-white text-xs sm:text-sm font-semibold">
                  Genuine Parts
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  OEM & premium
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bike Image Section - Bottom positioned */}
        <div className="relative w-full mt-auto">
          {/* Gold Arch - Repositioned for mobile */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[240px] sm:w-[300px] md:w-[380px] h-[280px] sm:h-[350px] md:h-[450px] border-[12px] sm:border-[16px] md:border-[20px] border-[#B88746]/60 rounded-t-full z-0" />

          {/* Bike Image - Centered and properly sized */}
          <div className="relative z-10 flex justify-center pb-0">
            <Image
              src="/images/homepage/banner-bike-img.png"
              alt="Premium Motorcycle"
              width={500}
              height={400}
              className="object-contain w-[90%] sm:w-[80%] md:w-[70%] max-w-[500px] drop-shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-500"
              priority
            />
          </div>

          {/* Bottom Gradient Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 w-full flex-1 hidden lg:flex lg:flex-col">
        {/* Main Content Area */}
        <div className="flex-1 max-w-[1440px] mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Bike Visual with Gold Arch */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Gold Arch */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[400px] h-[600px] border-[24px] border-[#B88746] rounded-t-full z-0 opacity-80" />

            {/* Bike Image */}
            <div className="relative z-10 w-[110%] max-w-[800px] translate-x-12">
              <Image
                src="/images/homepage/banner-bike-img.png"
                alt="Premium Motorcycle"
                width={800}
                height={600}
                className="object-contain drop-shadow-2xl animate-in slide-in-from-left duration-1000 fade-in"
                priority
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col items-start justify-center gap-6 pl-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full animate-in fade-in slide-in-from-right duration-700">
              <span className="w-2 h-2 bg-[#F16D34] rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium tracking-wide">
                {trustBadge}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] animate-in slide-in-from-right duration-1000 delay-100 fade-in">
              {titleLines.map((line, index) => (
                <span key={index}>
                  {index === 0 ? (
                    <span className="text-white">{line}</span>
                  ) : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#B88746] via-[#F16D34] to-[#B88746]">
                      {line}
                    </span>
                  )}
                  {index < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h1>

            {/* Subtext */}
            <p className="text-gray-400 text-lg xl:text-xl max-w-lg leading-relaxed animate-in slide-in-from-right duration-1000 delay-200 fade-in">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-4 animate-in slide-in-from-right duration-1000 delay-300 fade-in">
              <LocalizedClientLink
                href={primaryCta.link}
                className="px-8 py-4 bg-gradient-to-r from-[#B88746] to-[#F16D34] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(241,109,52,0.4)] transition-all transform hover:-translate-y-1"
              >
                {primaryCta.text}
              </LocalizedClientLink>

              <LocalizedClientLink
                href={secondaryCta.link}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all"
              >
                {secondaryCta.text}
              </LocalizedClientLink>
            </div>
          </div>
        </div>

        {/* Full-Width Features Bar - Bottom */}
        <div className="w-full bg-black/40 backdrop-blur-md border-t border-white/5 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
          <div className="max-w-[1440px] mx-auto px-8 py-6">
            <div className="grid grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F16D34]/20 to-[#B88746]/20 flex items-center justify-center group-hover:from-[#F16D34]/30 group-hover:to-[#B88746]/30 transition-all">
                  <span className="text-3xl">⭐</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Rider-Built</p>
                  <p className="text-gray-400 text-sm">Years of expertise</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F16D34]/20 to-[#B88746]/20 flex items-center justify-center group-hover:from-[#F16D34]/30 group-hover:to-[#B88746]/30 transition-all">
                  <span className="text-3xl">🏍</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Trusted</p>
                  <p className="text-gray-400 text-sm">
                    By riders & enthusiasts
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F16D34]/20 to-[#B88746]/20 flex items-center justify-center group-hover:from-[#F16D34]/30 group-hover:to-[#B88746]/30 transition-all">
                  <span className="text-3xl">⚡</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Fast Service</p>
                  <p className="text-gray-400 text-sm">Reliable turnaround</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F16D34]/20 to-[#B88746]/20 flex items-center justify-center group-hover:from-[#F16D34]/30 group-hover:to-[#B88746]/30 transition-all">
                  <span className="text-3xl">🔩</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Genuine Parts</p>
                  <p className="text-gray-400 text-sm">OEM & premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Mobile only */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 lg:hidden animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default Hero
