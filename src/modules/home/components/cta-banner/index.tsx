"use client"

/**
 * CTA Banner Section
 * Opening Hours + Social Media Links
 * Hero-style background with gradient overlays
 */

import Image from "next/image"

interface CTABannerProps {
  title?: string
  description?: string
  backgroundImage?: string
  openingHours?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
}

export default function CTABanner({
  title = "VISIT US\nTODAY",
  description = "Your one-stop destination for premium motorcycle gear, parts, and great coffee",
  backgroundImage = "/images/cta-placeholder.jpg",
  openingHours = "Open Monday - Friday | 9:00 AM - 8:00 PM",
  socialLinks = {
    facebook: "https://www.facebook.com/camille.sixthgear",
    instagram: "https://www.instagram.com/sixthgear_moto_supply/",
    tiktok: "https://www.tiktok.com/@sixthgear.moto.su",
  },
}: CTABannerProps) {
  // Parse title to handle line breaks
  const titleLines = title.split("\n")

  // Filter out empty social links
  const activeSocials = [
    socialLinks.facebook && {
      name: "Facebook",
      url: socialLinks.facebook,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    socialLinks.instagram && {
      name: "Instagram",
      url: socialLinks.instagram,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
    socialLinks.tiktok && {
      name: "TikTok",
      url: socialLinks.tiktok,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      ),
    },
  ].filter(Boolean)

  return (
    <section className="px-3 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="relative w-full h-[500px] md:h-[550px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Image */}
        <Image
          src={backgroundImage}
          alt="Sixthgear Store"
          fill
          className="object-cover"
          sizes="100vw"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#F16D34]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#F16D34]/5 rounded-full blur-3xl" />

        {/* Main Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
          {/* Main Title */}
          <h2
            className="text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] font-bold uppercase tracking-tight"
            style={{
              fontFamily: "Tanker, sans-serif",
              textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            {titleLines.map((line, index) => (
              <span key={index}>
                {index === 1 ? (
                  <span className="text-[#F16D34]">{line}</span>
                ) : (
                  line
                )}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          {/* Subtitle */}
          <p
            className="text-white/80 text-sm md:text-base lg:text-lg mt-6 tracking-wide max-w-lg"
            style={{ fontFamily: "Inter Display, sans-serif" }}
          >
            {description}
          </p>

          {/* Social Media Section - Only show if there are active socials */}
          {activeSocials.length > 0 && (
            <div className="mt-10 md:mt-12">
              <p
                className="text-white/60 text-xs md:text-sm uppercase tracking-widest mb-4"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                Follow us on our socials
              </p>
              <div className="flex items-center justify-center gap-4">
                {activeSocials.map((social: any) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/80 hover:bg-[#F16D34] hover:border-[#F16D34] hover:text-white transition-all duration-300 hover:scale-110"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Opening Hours Badge */}
        {openingHours && (
          <div className="absolute bottom-6 left-6 right-6 flex justify-center z-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#F16D34] rounded-full">
              <svg
                className="w-5 h-5 text-white"
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
              <span
                className="text-white text-sm md:text-base font-semibold tracking-wide"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {openingHours}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
