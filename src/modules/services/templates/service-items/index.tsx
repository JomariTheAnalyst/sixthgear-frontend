"use client"

/**
 * Service Items Template
 * Accordion layout with image on left side
 */

import { useState } from "react"
import Image from "next/image"
import { ServiceCategory } from "@lib/services-data"

interface ServiceItemsProps {
  service: ServiceCategory
}

export default function ServiceItems({ service }: ServiceItemsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Use detailImage if available, fallback to image
  const sideImage = service.detailImage || service.image

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span
            className="text-[#F16D34] text-sm md:text-base font-semibold uppercase tracking-widest"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            What We Offer
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#1a1a1a] uppercase leading-tight mt-3"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Service <span className="text-[#F16D34]">Details</span>
          </h2>
        </div>

        {/* Content Layout - Image Left, Accordion Right */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image - Left Side */}
          {sideImage && (
            <div className="w-full lg:w-2/5">
              <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden sticky top-24">
                <Image
                  src={sideImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Overlay Title */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className="text-white text-xl md:text-2xl uppercase"
                    style={{ fontFamily: "Tanker, sans-serif" }}
                  >
                    {service.title}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Accordion - Right Side */}
          <div className={`w-full ${sideImage ? "lg:w-3/5" : "lg:w-full"}`}>
            <div className="space-y-3">
              {service.items.map((item, index) => (
                <div
                  key={index}
                  className={`
                    border rounded-xl overflow-hidden transition-all duration-300
                    ${
                      openIndex === index
                        ? "border-[#F16D34] bg-[#F16D34]/5"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }
                  `}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      {/* Number */}
                      <span
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          transition-colors duration-300
                          ${
                            openIndex === index
                              ? "bg-[#F16D34] text-white"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                        style={{ fontFamily: "Inter Display, sans-serif" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Title */}
                      <h4
                        className={`
                          text-base md:text-lg font-semibold transition-colors duration-300
                          ${
                            openIndex === index
                              ? "text-[#F16D34]"
                              : "text-[#1a1a1a]"
                          }
                        `}
                        style={{ fontFamily: "Inter Display, sans-serif" }}
                      >
                        {item}
                      </h4>
                    </div>

                    {/* Toggle Icon */}
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${
                          openIndex === index
                            ? "bg-[#F16D34] rotate-180"
                            : "bg-gray-100"
                        }
                      `}
                    >
                      <svg
                        className={`w-5 h-5 transition-colors duration-300 ${
                          openIndex === index ? "text-white" : "text-gray-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${
                        openIndex === index
                          ? "max-h-48 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                      <div className="pl-12">
                        <p
                          className="text-gray-600 text-sm md:text-base leading-relaxed"
                          style={{ fontFamily: "Inter Display, sans-serif" }}
                        >
                          Professional {item.toLowerCase()} service performed by
                          our expert technicians using quality parts and
                          equipment. We ensure your motorcycle receives the best
                          care possible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
