"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const servicesData = [
  {
    title: "Chain & Sprocket Replacement",
    description: "Full service replacement and adjustment of drive chains and sprockets for smooth power delivery.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    title: "Tyre Replacement",
    description: "Professional tire mounting and balancing services to ensure safety and performance on the road.",
    image: "https://images.unsplash.com/photo-1571293521801-fd3dbf02a4f2?w=600&q=80",
  },
  {
    title: "Electrical Work",
    description: "Complete diagnostics and repairs for all electrical systems including lighting, battery, and ecu.",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80",
  },
  {
    title: "Brake & Clutch Repair",
    description: "Expert servicing of hydraulic and mechanical braking systems for optimal stopping power.",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
  },
  {
    title: "Engine Diagnostics",
    description: "Advanced engine analysis using state-of-the-art diagnostic tools to identify any issues.",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80",
  },
  {
    title: "Suspension Tuning",
    description: "Custom suspension setup and tuning for your specific riding style and weight.",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80",
  },
]

export default function OurServices() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400 // Scroll by roughly one card width
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="flex-1">
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Tanker, sans-serif" }}>
                Motorcycle Services
             </h2>
             <p className="text-xl md:text-2xl text-gray-500 font-medium">
                Bike Repair & Maintenance Services
             </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button 
                onClick={() => scroll("left")}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#fca311] hover:bg-[#e5940e] text-black transition-all hover:scale-105"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <button 
                onClick={() => scroll("right")}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#fca311] hover:bg-[#e5940e] text-black transition-all hover:scale-105"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0"
            style={{ 
                scrollbarWidth: "none", 
                msOverflowStyle: "none" 
            }}
        >
            {servicesData.map((service, index) => (
                <div 
                    key={index} 
                    className="relative flex-shrink-0 w-[85vw] md:w-[350px] lg:w-[400px] h-[450px] md:h-[500px] snap-center rounded-2xl overflow-hidden group cursor-pointer"
                >
                    {/* Background Image */}
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 85vw, 400px"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-300">
                        <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Inter Display, sans-serif" }}>
                            {service.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                            {service.description}
                        </p>
                        <div className="h-1 w-12 bg-[#fca311] rounded-full group-hover:w-full transition-all duration-500" />
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  )
}
