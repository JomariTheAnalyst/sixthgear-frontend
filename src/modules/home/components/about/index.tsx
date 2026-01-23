"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { companyData } from "@lib/company-data"

interface AboutSectionProps {
  kicker?: string
  title?: string
  description?: string
  highlights?: string[]
  primaryCta?: {
    text: string
    link: string
  }
  imageTop?: string | null
  imageBottom?: string | null
  videoUrl?: string | null
}

const AboutSection = ({
  kicker,
  title,
  description,
  highlights,
  primaryCta,
  imageTop,
  imageBottom,
  videoUrl,
}: AboutSectionProps) => {
  const { aboutUs } = companyData

  // Debug logging
  console.log("[AboutSection] Props received:", {
    kicker,
    title,
    description: description?.substring(0, 50),
    highlights,
    primaryCta,
  })

  // Use Strapi content if provided, otherwise fall back to hardcoded
  const content = {
    kicker: kicker || "About Us",
    title: title || aboutUs?.heading || "About Our Company",
    description: description || aboutUs?.description || "",
    highlights: highlights || aboutUs?.features || [],
    ctaText: primaryCta?.text || "More About Us",
    ctaLink: primaryCta?.link || "/about",
    imageTop: imageTop || "/images/homepage/about/about_bg.png",
    imageBottom: imageBottom || "/images/homepage/about/about-small.png",
    hasVideo: !!videoUrl,
    videoUrl: videoUrl || "#",
  }

  console.log("[AboutSection] Final content.title:", content.title)

  return (
    <section className="bg-[#1a1a1a] py-16 md:py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Images Composition */}
        <div className="relative w-full aspect-square md:aspect-[5/4] lg:aspect-square">
          {/* Top Image (Background/Workshop) */}
          <div className="absolute top-0 right-0 w-[65%] h-[60%] z-10">
            <div
              className="relative w-full h-full rounded-[2rem] overflow-hidden"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
            >
              <Image
                src={content.imageTop}
                alt="Motorcycle Workshop"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          </div>

          {/* Bottom Image (Foreground/Mechanic) */}
          <div className="absolute bottom-0 left-0 w-[70%] h-[65%] z-20">
            <div className="relative w-full h-full rounded-[2rem] border-[6px] border-[#1a1a1a] overflow-hidden shadow-2xl">
              <Image
                src={content.imageBottom}
                alt="Mechanic Working"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 60vw, 40vw"
              />
            </div>

            {/* Play Button - Only show if video URL exists */}
            {content.hasVideo && (
              <a
                href={content.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -top-10 -right-10 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#D97706] to-[#92400E] rounded-[1.5rem] flex items-center justify-center shadow-lg z-30 cursor-pointer hover:scale-110 transition-transform border-[6px] border-[#1a1a1a]"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center pl-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#D97706"
                  >
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col gap-6 z-10">
          {/* Tagline */}
          <div className="flex items-center gap-2 text-[#F97316] font-bold uppercase tracking-wider text-sm md:text-base">
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
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span>{content.kicker}</span>
          </div>

          {/* Heading */}
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white font-tanker"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {content.title}
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed">
            {content.description}
          </p>

          {/* Features List */}
          {content.highlights.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mt-2">
              {content.highlights.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-white text-base md:text-lg">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-8">
            <LocalizedClientLink
              href={content.ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white font-bold rounded-lg hover:shadow-lg hover:to-[#D97706] transition-all transform hover:-translate-y-1"
            >
              {content.ctaText}
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
