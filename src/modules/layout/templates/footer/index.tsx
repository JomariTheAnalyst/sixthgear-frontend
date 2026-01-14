"use client"

/**
 * Footer Component
 * Dark themed footer with paper cut design
 * Includes navigation, newsletter, and social links
 */

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const menuLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/store" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about" },
  { name: "Franchise", href: "/franchise" },
]

const supportLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "FAQs", href: "/faqs" },
  { name: "Shipping Info", href: "/shipping" },
  { name: "Returns", href: "/returns" },
]

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/camille.sixthgear",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/sixthgear_moto_supply/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@sixthgear.moto.su",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://twitter.com/sixthgear",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/sixthgear",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

const legalLinks = [
  { name: "Legal Notices & T&Cs", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Internal Regulations", href: "/regulations" },
  { name: "Vigipirate", href: "/vigipirate" },
  { name: "Consumer Mediation", href: "/mediation" },
]

export default function Footer() {
  return (
    <footer className="relative">
      {/* Top Paper Cut */}
      <div className="w-full -mb-1">
        <img
          src="/images/polaroid-marquee/top.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16">
          {/* Main Content Box with Outline */}
          <div className="border border-white/20 p-8 md:p-12 mb-8">
            {/* Top Section - Brand */}
            <div className="mb-12">
              {/* Brand Section */}
              <div>
                <h2
                  className="text-[#F16D34] text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight mb-1"
                  style={{ fontFamily: "Tanker, sans-serif" }}
                >
                  Sixthgear
                </h2>
                <p
                  className="text-white/70 text-sm md:text-base uppercase tracking-[0.2em] mb-3"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  Moto Supply & Café + Lounge
                </p>
                <p
                  className="text-white/50 text-xs md:text-sm tracking-wider max-w-md"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  From routine PMS to diagnostics, repairs, and upgrades, we ensure your motorcycle runs safely and reliably. Rider-focused technicians using proper tools, experience, and professional workshop standards.
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {/* Menu */}
              <div>
                <h3
                  className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  Menu
                </h3>
                <ul className="space-y-2">
                  {menuLinks.map((link) => (
                    <li key={link.name}>
                      <LocalizedClientLink
                        href={link.href}
                        className="text-white/70 text-xs uppercase tracking-wider hover:text-white transition-colors"
                        style={{ fontFamily: "Inter Display, sans-serif" }}
                      >
                        {link.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3
                  className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  Support
                </h3>
                <ul className="space-y-2">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <LocalizedClientLink
                        href={link.href}
                        className="text-white/70 text-xs uppercase tracking-wider hover:text-white transition-colors"
                        style={{ fontFamily: "Inter Display, sans-serif" }}
                      >
                        {link.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3
                  className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  Contact
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="tel:09950930157"
                      className="text-white/70 text-xs uppercase tracking-wider hover:text-white transition-colors"
                      style={{ fontFamily: "Inter Display, sans-serif" }}
                    >
                      0995 093 0157
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:info@sixthgear.ph"
                      className="text-white/70 text-xs uppercase tracking-wider hover:text-white transition-colors"
                      style={{ fontFamily: "Inter Display, sans-serif" }}
                    >
                      info@sixthgear.ph
                    </a>
                  </li>
                </ul>
              </div>

              {/* Hours */}
              <div>
                <h3
                  className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  Store Hours
                </h3>
                <p
                  className="text-white/70 text-xs uppercase tracking-wider"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  Monday - Friday
                  <br />
                  9:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter & Social Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 border-t border-white/10">
            {/* Newsletter */}
            <div className="flex items-center gap-4">
              <span
                className="text-white text-sm uppercase tracking-[0.15em] font-semibold"
                style={{ fontFamily: "Tanker, sans-serif" }}
              >
                Stay Informed
              </span>
              <LocalizedClientLink
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2 border border-white/30 text-white text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                Contact Us
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </LocalizedClientLink>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Legal Links */}
              <div className="flex flex-wrap items-center gap-3 md:gap-5">
                {legalLinks.map((link) => (
                  <LocalizedClientLink
                    key={link.name}
                    href={link.href}
                    className="text-white/30 text-[10px] uppercase tracking-wider hover:text-white/50 transition-colors"
                    style={{ fontFamily: "Inter Display, sans-serif" }}
                  >
                    {link.name}
                  </LocalizedClientLink>
                ))}
              </div>

              {/* Copyright & Logo */}
              <div className="flex items-center gap-4">
                <p
                  className="text-white/30 text-[10px] uppercase tracking-wider"
                  style={{ fontFamily: "Inter Display, sans-serif" }}
                >
                  © {new Date().getFullYear()} Sixthgear, A Moto Supply
                </p>
                <img
                  src="/images/logo/sixthgear-logo-white.png"
                  alt="Sixthgear"
                  className="h-6 opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
