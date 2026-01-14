"use client"

/**
 * Franchise Section
 * Interactive hover effect with fill-up animation on title
 * Images pop in on hover, scattered layout
 * Gear/nut shape decorative element
 */

import { useState } from "react"
import Image from "next/image"

// Gear/Nut SVG Component
const GearShape = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Outer gear shape */}
    <path
      fill="#F16D34"
      fillOpacity="0.2"
      d="M100,10 L115,10 L120,30 L130,25 L140,40 L155,35 L160,55 L175,55 L175,70 L190,80 L180,95 L190,110 L175,120 L175,135 L160,140 L155,160 L140,155 L130,170 L120,165 L115,185 L100,185 L85,185 L80,165 L70,170 L60,155 L45,160 L40,140 L25,135 L25,120 L10,110 L20,95 L10,80 L25,70 L25,55 L40,55 L45,35 L60,40 L70,25 L80,30 L85,10 Z"
    />
    {/* Inner circle cutout */}
    <circle cx="100" cy="100" r="50" fill="#F5F0E8" />
  </svg>
)

export default function Franchise() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section
      className="relative bg-[#F5F0E8] py-28 md:py-36 lg:py-44 overflow-hidden min-h-[750px] md:min-h-[850px] lg:min-h-[900px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Gear/Nut behind title */}
      <div
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[400px] md:w-[550px] lg:w-[700px] aspect-square
          transition-all duration-700 ease-out
          ${
            isHovered
              ? "opacity-100 scale-100 rotate-[15deg]"
              : "opacity-0 scale-75 rotate-0"
          }
        `}
      >
        <GearShape />
      </div>

      {/* Left Image - Tilted */}
      <div
        className={`
          absolute top-[8%] left-[3%] md:left-[6%] w-[200px] md:w-[280px] lg:w-[340px]
          transition-all duration-700 ease-out
          ${
            isHovered
              ? "opacity-100 translate-y-0 rotate-[-8deg]"
              : "opacity-0 translate-y-10 rotate-[-8deg]"
          }
        `}
        style={{ transitionDelay: "100ms" }}
      >
        <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl border-4 border-white">
          <Image
            src="/images/franchise/sixthgear-outside.jpg"
            alt="Sixthgear Store Outside"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Image - Tilted opposite */}
      <div
        className={`
          absolute bottom-[8%] right-[3%] md:right-[6%] w-[200px] md:w-[280px] lg:w-[340px]
          transition-all duration-700 ease-out
          ${
            isHovered
              ? "opacity-100 translate-y-0 rotate-[6deg]"
              : "opacity-0 translate-y-10 rotate-[6deg]"
          }
        `}
        style={{ transitionDelay: "200ms" }}
      >
        <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl border-4 border-white">
          <Image
            src="/images/franchise/sixthgear-inside.jpg"
            alt="Sixthgear Store Inside"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Floating Text Badge - Top Right */}
      <div
        className={`
          absolute top-[12%] right-[12%] md:right-[22%]
          transition-all duration-500 ease-out
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
        style={{ transitionDelay: "300ms" }}
      >
        <div className="bg-[#F16D34] text-white px-5 py-3 rounded-sm rotate-[8deg] shadow-lg">
          <p
            className="text-sm md:text-base font-bold uppercase tracking-wide"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Do you dream of opening
            <br />
            your own moto shop & café?
          </p>
        </div>
      </div>

      {/* Floating Text Badge - Bottom Left */}
      <div
        className={`
          absolute bottom-[18%] left-[6%] md:left-[12%]
          transition-all duration-500 ease-out
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="bg-[#FFD700] text-[#3D2314] px-5 py-3 rounded-sm rotate-[-5deg] shadow-lg">
          <p
            className="text-sm md:text-base font-bold uppercase tracking-wide"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            With Sixthgear, you have the
            <br />
            opportunity to become part
            <br />
            of an innovative brand.
          </p>
        </div>
      </div>

      {/* Main Content - Center */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Title with Fill Animation */}
        <div className="relative inline-block">
          {/* Outline Text (Always visible) */}
          <h2
            className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] uppercase leading-[0.85] tracking-tight"
            style={{
              fontFamily: "Tanker, sans-serif",
              color: "transparent",
              WebkitTextStroke: "3px #3D2314",
            }}
          >
            Become A
            <br />
            Franchise Partner
          </h2>

          {/* Filled Text (Reveals on hover from bottom) */}
          <h2
            className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] uppercase leading-[0.85] tracking-tight overflow-hidden"
            style={{
              fontFamily: "Tanker, sans-serif",
              color: "#F16D34",
              clipPath: isHovered ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          >
            Become A
            <br />
            Franchise Partner
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className={`
            text-[#3D2314]/70 text-base md:text-lg lg:text-xl mt-10 max-w-2xl mx-auto leading-relaxed
            transition-all duration-500 ease-out
            ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-70 translate-y-0"
            }
          `}
          style={{ fontFamily: "Inter Display, sans-serif" }}
        >
          Become a franchise partner and offer your customers
          <br />
          premium motorcycle gear, services, and great coffee at the highest
          level.
        </p>

        {/* CTA Button - Appears on hover */}
        <div
          className={`
            mt-12 transition-all duration-500 ease-out
            ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }
          `}
          style={{ transitionDelay: "500ms" }}
        >
          <a
            href="/franchise"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#F16D34] text-white text-lg font-semibold uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-[#3D2314] hover:scale-105"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Contact us
            
    
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
           
          </a>
        </div>
      </div>
    </section>
  )
}
