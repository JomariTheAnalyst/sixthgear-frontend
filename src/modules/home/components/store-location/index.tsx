"use client"

/**
 * Store Location Section
 * Interactive Google Maps embed with built-in marker
 * Allows zoom/pan with marker staying at coordinates
 */

import { useState } from "react"

const storeInfo = {
  name: "Sixth Gear Moto Supply Café + Lounge",
  address: "3610 Bautista St, Makati City, Metro Manila",
  phone: "0995 093 0157",
  coordinates: {
    lat: 14.554651468423817,
    lng: 121.00262199651827,
  },
  googleMapsUrl: "https://maps.app.goo.gl/MAiATmPJ3BmQYXoH7",
  hours: "Monday - Friday | 9:00 AM - 8:00 PM",
}

export default function StoreLocation() {
  const handleGetDirections = () => {
    const { lat, lng } = storeInfo.coordinates
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        "_blank"
      )
    } else {
      window.open(storeInfo.googleMapsUrl, "_blank")
    }
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-4xl md:text-6xl lg:text-7xl text-gray-900"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Store Location
          </h2>
          <p
            className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            Visit us at our store in Makati City for premium motorcycle gear,
            professional services, and great coffee.
          </p>
        </div>

        {/* Map and Info Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 items-stretch">
          {/* Map Container - Interactive with built-in marker */}
          <div className="lg:col-span-2 relative rounded-3xl lg:rounded-r-none overflow-hidden shadow-2xl min-h-[450px] md:min-h-[550px] lg:min-h-[600px]">
            <iframe
              src="https://maps.google.com/maps?q=14.554651468423817,121.00262199651827&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sixthgear Store Location"
              className="absolute inset-0"
            />
          </div>

          {/* Info Card */}
          <div className="lg:col-span-1 bg-[#1a1a1a] rounded-3xl lg:rounded-l-none p-8 md:p-12 flex flex-col justify-center text-white min-h-[450px] md:min-h-[550px] lg:min-h-[600px]">
            {/* Store Name */}
            <h3
              className="text-3xl md:text-4xl lg:text-5xl text-[#F16D34] mb-8"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              {storeInfo.name}
            </h3>

            {/* Info Items */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F16D34]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-[#F16D34]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-white/60 text-sm uppercase tracking-wider mb-1"
                    style={{ fontFamily: "Inter Display, sans-serif" }}
                  >
                    Address
                  </p>
                  <p
                    className="text-white text-base md:text-lg"
                    style={{ fontFamily: "Inter Display, sans-serif" }}
                  >
                    {storeInfo.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F16D34]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-[#F16D34]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-white/60 text-sm uppercase tracking-wider mb-1"
                    style={{ fontFamily: "Inter Display, sans-serif" }}
                  >
                    Phone
                  </p>
                  <a
                    href={`tel:${storeInfo.phone.replace(/\s/g, "")}`}
                    className="text-white text-base md:text-lg hover:text-[#F16D34] transition-colors"
                    style={{ fontFamily: "Inter Display, sans-serif" }}
                  >
                    {storeInfo.phone}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F16D34]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-[#F16D34]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-white/60 text-sm uppercase tracking-wider mb-1"
                    style={{ fontFamily: "Inter Display, sans-serif" }}
                  >
                    Store Hours
                  </p>
                  <p
                    className="text-white text-base md:text-lg"
                    style={{ fontFamily: "Inter Display, sans-serif" }}
                  >
                    {storeInfo.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <button
              onClick={handleGetDirections}
              className="mt-10 w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#F16D34] text-white text-lg font-semibold uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-white hover:text-[#1a1a1a] hover:scale-[1.02] group"
              style={{ fontFamily: "Inter Display, sans-serif" }}
            >
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Get Directions
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
