"use client"

/**
 * Services List Template
 * Main services page showing all service categories with tilted landscape cards
 */

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ServiceCategory } from "@lib/services-data"
import CTABanner from "@modules/home/components/cta-banner"

interface ServicesListTemplateProps {
  services: ServiceCategory[]
}

export default function ServicesListTemplate({
  services,
}: ServicesListTemplateProps) {
  const params = useParams()
  const countryCode = params?.countryCode as string

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#F16D34]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#F16D34]/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
          <span
            className="inline-block text-[#F16D34] text-sm md:text-base font-semibold uppercase tracking-widest mb-4"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Professional Motorcycle Care
          </span>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.95] tracking-tight mb-6"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Our <span className="text-[#F16D34]">Services</span>
          </h1>

          <p
            className="text-white/70 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Complete motorcycle care from routine maintenance to performance
            upgrades. Expert technicians, quality parts, and attention to
            detail.
          </p>
        </div>
      </section>

      {/* Services List - Landscape Cards */}
      <section className="bg-[#FAFAFA] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-10 md:gap-14">
            {services.map((service, index) => {
              const rotation = index % 2 === 0 ? "-1.5deg" : "1.5deg"
              // Use heroImage if available, fallback to image
              const serviceImage = service.heroImage || service.image

              return (
                <Link
                  key={service.id}
                  href={`/${countryCode}/services/${service.slug}`}
                  className="group block"
                >
                  <div
                    className="relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out group-hover:shadow-2xl"
                    style={{
                      transform: `rotate(${rotation})`,
                      transition:
                        "transform 0.5s ease-out, box-shadow 0.5s ease-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "rotate(0deg) translateY(-4px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `rotate(${rotation})`
                    }}
                  >
                    {/* Card Layout - Responsive */}
                    <div className="flex flex-col md:flex-row">
                      {/* Content - Left Side */}
                      <div className="flex-1 p-6 md:p-8 lg:p-10 order-2 md:order-1">
                        {/* Title with accent word */}
                        <h3
                          className="text-xl md:text-2xl lg:text-3xl text-[#1a1a1a] uppercase leading-tight mb-4"
                          style={{ fontFamily: "Tanker, sans-serif" }}
                        >
                          {service.title.split(" ").map((word, i) => (
                            <span
                              key={i}
                              className={i === 0 ? "text-[#F16D34]" : ""}
                            >
                              {word}{" "}
                            </span>
                          ))}
                        </h3>

                        {/* Full Description */}
                        <p
                          className="text-gray-600 text-sm md:text-base leading-relaxed mb-6"
                          style={{ fontFamily: "Inter Display, sans-serif" }}
                        >
                          {service.description}
                        </p>

                        {/* Service Tags */}
                        <div className="mb-6">
                          <span
                            className="text-xs text-gray-400 uppercase tracking-wider mb-3 block"
                            style={{ fontFamily: "Inter Display, sans-serif" }}
                          >
                            Ideal For:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {service.items.slice(0, 6).map((item, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200"
                                style={{
                                  fontFamily: "Inter Display, sans-serif",
                                }}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Arrow Button */}
                        <div className="flex items-center justify-end">
                          <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center transition-all duration-300 group-hover:bg-[#F16D34]">
                            <svg
                              className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1"
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
                          </div>
                        </div>
                      </div>

                      {/* Image - Right Side (16:9 aspect ratio) */}
                      {serviceImage && (
                        <div className="relative w-full md:w-2/5 lg:w-[45%] aspect-video md:aspect-auto order-1 md:order-2">
                          <Image
                            src={serviceImage}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className="h-1.5 bg-[#F16D34]" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  )
}
