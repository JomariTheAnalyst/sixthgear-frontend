"use client"

/**
 * Service CTA Section
 * Call to action for booking/contact
 */

import Link from "next/link"

export default function ServiceCTA() {
  return (
    <section className="bg-[#1a1a1a] py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F16D34]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl text-white uppercase leading-[1.1] mb-6"
          style={{ fontFamily: "Tanker, sans-serif" }}
        >
          Ready to Get <span className="text-[#F16D34]">Started?</span>
        </h2>

        <p
          className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10"
          style={{ fontFamily: "Inter Display, sans-serif" }}
        >
          Book your service appointment today or visit our shop. Our expert
          technicians are ready to take care of your motorcycle.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#F16D34] text-white font-semibold uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-white hover:text-[#1a1a1a] hover:scale-105"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Book Now
            <svg
              className="w-5 h-5"
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
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white font-semibold uppercase tracking-wider rounded-full border-2 border-white/30 transition-all duration-300 hover:bg-white hover:text-[#1a1a1a] hover:border-white"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
