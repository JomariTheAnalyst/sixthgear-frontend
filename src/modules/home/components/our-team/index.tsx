"use client"

import { useRef } from "react"
import Image from "next/image"

interface TeamMember {
  id: number
  name: string
  role: string
  title: string
  description: string
  image: string
  socialLinks: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
}

interface OurTeamProps {
  sectionTitle?: string
  sectionDescription?: string
  teamMembers?: TeamMember[]
}

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
)

const TiktokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
)

const teamMembersFallback = [
  {
    id: 1,
    name: "MARTIE",
    role: "Lead Technician",
    title: "Workshop Head",
    description:
      "Experienced motorcycle technician specializing in diagnostics, repairs, and performance upgrades for big bikes and premium motorcycles.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    socialLinks: {},
  },
  {
    id: 2,
    name: "JAMES",
    role: "Senior Mechanic",
    title: "Service & Installation Specialist",
    description:
      "Focused on PMS, mechanical repairs, and proper installation of accessories, electronics, and safety upgrades.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
    socialLinks: {},
  },
  {
    id: 3,
    name: "MARVIN",
    role: "Service Advisor",
    title: "Rider Support & Coordination",
    description:
      "Your point of contact for service consultations, job updates, and ensuring a smooth workshop experience from start to finish.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    socialLinks: {},
  },
]

export default function OurTeam({
  sectionTitle = "Our Team",
  sectionDescription = "Riders, Technicians, and Professionals Who Care About Your Bike",
  teamMembers = teamMembersFallback,
}: OurTeamProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Don't render if no team members
  if (!teamMembers || teamMembers.length === 0) {
    return null
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="relative">
      {/* Top Paper Cut */}
      <div className="w-full -mb-1">
        <img
          src="/images/polaroid-marquee/top.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Main Section */}
      <div className="bg-[#0A0A0A] relative overflow-hidden">
        <div className="py-12 md:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto">
            {/* Header */}
            <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8">
              <h2
                className="text-3xl md:text-5xl lg:text-7xl text-white mb-3 md:mb-4"
                style={{ fontFamily: "Tanker, sans-serif" }}
              >
                {sectionTitle}
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
                {sectionDescription}
              </p>
            </div>

            {/* Mobile/Tablet: Horizontal Scroll */}
            <div className="lg:hidden">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 md:px-8"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] bg-[#141414] rounded-2xl overflow-hidden border border-gray-800 snap-center"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 45vw"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                      {/* Decorative Elements */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-[#fca311]/40" />
                      <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-[#fca311]/40" />
                    </div>

                    {/* Content */}
                    <div className="p-5 text-center">
                      <h3
                        className="text-xl font-bold text-white mb-1"
                        style={{ fontFamily: "Inter Display, sans-serif" }}
                      >
                        {member.name}
                      </h3>
                      <p className="text-[#fca311] font-semibold text-xs uppercase tracking-wider mb-1">
                        {member.role}
                      </p>
                      <p className="text-gray-500 text-xs font-medium mb-3">
                        {member.title}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        {member.description}
                      </p>

                      {/* Social Icons */}
                      <div className="flex justify-center gap-3">
                        {member.socialLinks.facebook && (
                          <a
                            href={member.socialLinks.facebook}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400"
                            aria-label={`${member.name}'s Facebook`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FacebookIcon />
                          </a>
                        )}
                        {member.socialLinks.instagram && (
                          <a
                            href={member.socialLinks.instagram}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400"
                            aria-label={`${member.name}'s Instagram`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <InstagramIcon />
                          </a>
                        )}
                        {member.socialLinks.tiktok && (
                          <a
                            href={member.socialLinks.tiktok}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400"
                            aria-label={`${member.name}'s TikTok`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <TiktokIcon />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows - Mobile/Tablet */}
              <div className="flex justify-center gap-3 mt-6 px-4">
                <button
                  onClick={() => scroll("left")}
                  className="w-11 h-11 bg-[#fca311] hover:bg-[#e5940e] rounded-lg flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Previous"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="w-11 h-11 bg-[#fca311] hover:bg-[#e5940e] rounded-lg flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Next"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8 px-4 md:px-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="group bg-[#141414] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#fca311]/50 transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Image Container - Taller */}
                  <div className="relative h-80 md:h-96 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="33vw"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#fca311]/40" />
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[#fca311]/40" />
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <h3
                      className="text-2xl font-bold text-white mb-1"
                      style={{ fontFamily: "Inter Display, sans-serif" }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-[#fca311] font-semibold text-sm uppercase tracking-wider mb-1">
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-sm font-medium mb-4">
                      {member.title}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {member.description}
                    </p>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-4">
                      {member.socialLinks.facebook && (
                        <a
                          href={member.socialLinks.facebook}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#fca311] hover:text-black transition-all duration-300 transform hover:scale-110"
                          aria-label={`${member.name}'s Facebook`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FacebookIcon />
                        </a>
                      )}
                      {member.socialLinks.instagram && (
                        <a
                          href={member.socialLinks.instagram}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#fca311] hover:text-black transition-all duration-300 transform hover:scale-110"
                          aria-label={`${member.name}'s Instagram`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <InstagramIcon />
                        </a>
                      )}
                      {member.socialLinks.tiktok && (
                        <a
                          href={member.socialLinks.tiktok}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#fca311] hover:text-black transition-all duration-300 transform hover:scale-110"
                          aria-label={`${member.name}'s TikTok`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <TiktokIcon />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="h-1 w-0 bg-[#fca311] group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Paper Cut */}
      <div className="w-full -mt-1">
        <img
          src="/images/polaroid-marquee/bottom.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>
    </section>
  )
}
