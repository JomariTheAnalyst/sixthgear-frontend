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
    <div className="relative w-full h-auto bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <img
            src={bgImage}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-40 md:opacity-60"
          />
        ) : (
          <Image
            src={bgImage}
            alt="Hero Background"
            fill
            className="object-cover opacity-40 md:opacity-60"
            sizes="100vw"
            priority
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 md:bg-gradient-to-r md:from-black md:via-black/80 md:to-transparent" />
      </div>

      {/* Mobile Layout - Centered with image on top */}
      <div className="relative z-10 lg:hidden w-full min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg flex flex-col items-center text-center">
          {/* Bike Image - Top */}
          <div className="relative w-full mb-8 animate-in fade-in zoom-in-95 duration-1000">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src="/images/homepage/banner-bike-img.png"
                alt="Premium Motorcycle"
                fill
                className="object-contain drop-shadow-[0_0_80px_rgba(241,109,52,0.3)]"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            {titleLines.map((line, index) => (
              <span key={index}>
                <span className="text-white uppercase tracking-tight">{line}</span>
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Trust Badge */}
          {trustBadge && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6 animate-in fade-in duration-700 delay-200">
              <span className="w-1.5 h-1.5 bg-[#F16D34] rounded-full" />
              <span className="text-white/70 text-xs font-medium tracking-wide uppercase">
                {trustBadge}
              </span>
            </div>
          )}

          {/* CTA Buttons - Stacked */}
          <div className="flex flex-col w-full gap-3 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <LocalizedClientLink
              href={primaryCta.link}
              className="w-full px-8 py-4 bg-white text-black font-bold rounded-md text-center hover:bg-gray-100 transition-all uppercase tracking-wide text-sm"
            >
              {primaryCta.text}
            </LocalizedClientLink>

            <LocalizedClientLink
              href={secondaryCta.link}
              className="w-full px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md text-center hover:bg-white hover:text-black transition-all uppercase tracking-wide text-sm"
            >
              {secondaryCta.text}
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Content LEFT, Image RIGHT */}
      <div className="relative z-10 hidden lg:flex w-full h-[65vh] min-h-[500px]">
        <div className="w-full h-full flex items-center">
          <div className="grid grid-cols-2 gap-8 items-center w-full h-full">
            {/* Left: Content */}
            <div className="flex flex-col items-start justify-end h-full pb-8 pl-8 xl:pl-12 animate-in fade-in slide-in-from-left duration-1000">
              {/* Trust Badge */}
              {trustBadge && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 bg-[#F16D34] rounded-full" />
                  <span className="text-white/70 text-xs font-medium tracking-wide uppercase">
                    {trustBadge}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-3">
                {titleLines.map((line, index) => (
                  <span key={index}>
                    <span className="text-white uppercase">{line}</span>
                    {index < titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>

              {/* Description */}
              {description && (
                <p className="text-gray-400 text-sm xl:text-base leading-relaxed max-w-lg mb-4">
                  {description}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <LocalizedClientLink
                  href={primaryCta.link}
                  className="px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-100 transition-all uppercase tracking-wide text-xs"
                >
                  {primaryCta.text}
                </LocalizedClientLink>

                <LocalizedClientLink
                  href={secondaryCta.link}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-black transition-all uppercase tracking-wide text-xs"
                >
                  {secondaryCta.text}
                </LocalizedClientLink>
              </div>
            </div>

            {/* Right: Bike Image */}
            <div className="relative w-full h-full flex items-center justify-center pr-8 animate-in fade-in slide-in-from-right duration-1000 delay-200">
              <div className="relative w-full h-full translate-x-8">
                <Image
                  src="/images/homepage/banner-bike-img.png"
                  alt="Premium Motorcycle"
                  fill
                  className="object-contain drop-shadow-[0_0_100px_rgba(241,109,52,0.4)]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Dots - Mobile only */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 lg:hidden flex items-center gap-2">
        <button className="w-2 h-2 rounded-full bg-white" />
        <button className="w-2 h-2 rounded-full bg-white/30" />
        <button className="w-2 h-2 rounded-full bg-white/30" />
      </div>
    </div>
  )
}

export default Hero
