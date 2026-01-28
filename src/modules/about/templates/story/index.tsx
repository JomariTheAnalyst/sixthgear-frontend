"use client"

/**
 * About Story Section
 * Main narrative about Sixthgear
 */

import React from "react"
import Image from "next/image"
import BlocksRenderer from "@lib/strapi/blocks-renderer"

interface AboutStoryProps {
  image?: string
  badgeText?: string
  badgePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  heading?: string
  highlightedText?: string
  bodyText?: any[]
}

export default function AboutStory({
  image = "/images/sixthgear-workshop.jpg",
  badgeText = "100%\nRider Focused",
  badgePosition = "bottom-right",
  heading = "More Than a Shop,\nA Rider's Space",
  highlightedText = "A Rider's Space",
  bodyText,
}: AboutStoryProps) {
  // Map badge position to CSS classes
  const badgePositionClasses = {
    "top-left": "-top-6 -left-6 md:top-8 md:-left-8",
    "top-right": "-top-6 -right-6 md:top-8 md:-right-8",
    "bottom-left": "-bottom-6 -left-6 md:bottom-8 md:-left-8",
    "bottom-right": "-bottom-6 -right-6 md:bottom-8 md:-right-8",
  }

  // Split badge text by newline for multi-line display
  const badgeLines = badgeText.split("\n")

  // Split heading to find highlighted text
  const headingParts = heading.split("\n")

  return (
    <section className="bg-[#FAFAFA] py-20 md:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt="Sixthgear Workshop"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Badge - Only render if badgeText is not empty */}
            {badgeText && badgeText.trim() !== "" && (
              <div
                className={`absolute ${badgePositionClasses[badgePosition]} bg-[#F16D34] text-white px-6 py-4 rounded-2xl shadow-xl`}
              >
                {badgeLines.map((line, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "text-3xl md:text-4xl font-bold"
                        : "text-sm text-white/80"
                    }
                    style={{
                      fontFamily:
                        index === 0
                          ? "Tanker, sans-serif"
                          : "Inter Display, sans-serif",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right - Content */}
          <div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-[#1a1a1a] uppercase leading-[1.1] mt-4 mb-8"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              {headingParts.map((part, index) => {
                // Check if this part contains the highlighted text
                const isHighlighted =
                  highlightedText && part.includes(highlightedText)

                if (isHighlighted) {
                  // Split by highlighted text and wrap it
                  const parts = part.split(highlightedText)
                  return (
                    <React.Fragment key={index}>
                      {parts[0]}
                      <span className="text-[#F16D34]">{highlightedText}</span>
                      {parts[1]}
                      {index < headingParts.length - 1 && <br />}
                    </React.Fragment>
                  )
                }

                return (
                  <React.Fragment key={index}>
                    {part}
                    {index < headingParts.length - 1 && <br />}
                  </React.Fragment>
                )
              })}
            </h2>

            {/* Body Text - Use BlocksRenderer if available, otherwise fallback */}
            {bodyText && bodyText.length > 0 ? (
              <BlocksRenderer
                content={bodyText}
                className="space-y-6 text-[#4a4a4a] text-base md:text-lg text-justify leading-relaxed"
              />
            ) : (
              <div
                className="space-y-6 text-[#4a4a4a] text-base md:text-lg text-justify leading-relaxed"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                <p>
                  <strong className="text-[#1a1a1a]">
                    Sixth Gear Moto Supply Café + Lounge
                  </strong>{" "}
                  is built by riders, for riders. We are a premium motorcycle
                  service hub that combines professional workshop expertise with
                  a relaxed café and lounge experience, powered by First Gear
                  Coffee.
                </p>

                <p>
                  From routine PMS to advanced diagnostics, repairs, and
                  performance upgrades, our workshop is equipped to handle big
                  bikes and premium motorcycles with precision, care, and
                  attention to detail. We believe proper maintenance is not just
                  about fixing issues, but about ensuring safety, reliability,
                  and riding confidence.
                </p>

                <p>
                  Beyond servicing, Sixth Gear offers a curated selection of
                  quality motorcycle accessories, riding gear, helmets, and
                  performance parts. We also provide professional bike wash,
                  detailing, and cosmetic restoration to keep your motorcycle
                  looking and performing at its best.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
