"use client"

/**
 * Service Hero Section
 * Hero banner for individual service pages
 */

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ServiceCategory } from "@lib/services-data"

interface ServiceHeroProps {
  service: ServiceCategory
}

export default function ServiceHero({ service }: ServiceHeroProps) {
  const params = useParams()
  const countryCode = params?.countryCode as string

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 mb-6 text-sm">
          <Link
            href={`/${countryCode}`}
            className="text-white/60 hover:text-white transition-colors"
          >
            Home
          </Link>
          <span className="text-white/40">/</span>
          <Link
            href={`/${countryCode}/services`}
            className="text-white/60 hover:text-white transition-colors"
          >
            Services
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-[#F16D34]">{service.shortTitle}</span>
        </nav>

        {/* Title */}
        <h1
          className="text-3xl md:text-5xl lg:text-6xl text-white uppercase leading-[0.95] tracking-tight mb-6"
          style={{
            fontFamily: "Tanker, sans-serif",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          {service.title}
        </h1>

        {/* Description */}
        <p
          className="text-white/80 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "Inter Display, sans-serif" }}
        >
          {service.description}
        </p>
      </div>
    </section>
  )
}
