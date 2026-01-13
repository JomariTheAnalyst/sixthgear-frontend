"use client"

import { useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { companyData } from "@lib/company-data"

/**
 * Our Services Section
 * Accordion-style services display with image on left
 */

export default function OurServices() {
  const [openIndex, setOpenIndex] = useState<number>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#F16D34]/10 text-[#F16D34] text-sm font-medium rounded-full mb-4">
            What We Offer
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Our Services
          </h2>
        </div>

        {/* Content Grid - Image Left, Accordion Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image */}
          <div className="relative aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden">
            <Image
              src="/images/homepage/imgi_115_h1sl1.jpg"
              alt="Sixthgear Services"
              fill
              className="object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {/* Badge */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                <p
                  className="text-gray-800 text-sm md:text-base"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  Professional motorcycle services with passion and expertise
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Accordion */}
          <div className="flex flex-col">
            <div className="space-y-3">
              {companyData.servicesOffered.map((service, index) => (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? "border-[#F16D34] bg-[#F16D34]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                          openIndex === index
                            ? "bg-[#F16D34] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={`font-semibold text-base md:text-lg transition-colors ${
                          openIndex === index
                            ? "text-[#F16D34]"
                            : "text-gray-900"
                        }`}
                        style={{ fontFamily: "Inter Display, sans-serif" }}
                      >
                        {service.title}
                      </h3>
                    </div>
                    {/* Arrow Icon */}
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openIndex === index
                          ? "rotate-180 text-[#F16D34]"
                          : "text-gray-400"
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
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pl-16 md:pl-[4.5rem]">
                      <p
                        className="text-gray-600 text-sm md:text-base leading-relaxed"
                        style={{ fontFamily: "Inter Display, sans-serif" }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Services Button */}
            <div className="mt-8">
              <LocalizedClientLink
                href="/services"
                className="inline-flex items-center gap-3 bg-[#F16D34] hover:bg-[#ff7a3d] text-white font-semibold px-8 py-4 transition-all duration-300 group"
              >
                <span style={{ fontFamily: "Inter Display, sans-serif" }}>
                  View All Services
                </span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
