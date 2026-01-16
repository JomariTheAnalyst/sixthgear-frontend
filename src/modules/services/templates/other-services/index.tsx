"use client"

/**
 * Other Services Section
 * Shows related/other services for navigation
 */

import Image from "next/image"
import Link from "next/link"
import { ServiceCategory } from "@lib/services-data"

interface OtherServicesProps {
  services: ServiceCategory[]
  currentSlug: string
}

export default function OtherServices({
  services,
  currentSlug,
}: OtherServicesProps) {
  const otherServices = services
    .filter((s) => s.slug !== currentSlug)
    .slice(0, 4)

  if (otherServices.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="text-[#F16D34] text-sm md:text-base font-semibold uppercase tracking-widest"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Explore More
          </span>
          <h2
            className="text-3xl md:text-4xl text-[#1a1a1a] uppercase leading-[1.1] mt-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Other <span className="text-[#F16D34]">Services</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              {/* Background Image */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  className="text-white text-lg font-semibold leading-tight mb-2 group-hover:text-[#F16D34] transition-colors"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  {service.shortTitle}
                </h3>
                <div className="h-0.5 w-8 bg-[#F16D34] group-hover:w-full transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
