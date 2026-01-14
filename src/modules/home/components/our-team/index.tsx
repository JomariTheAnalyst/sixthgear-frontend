"use client"

import Image from "next/image"

const teamMembers = [
  {
    name: "MARTIE",
    role: "Lead Technician",
    title: "Workshop Head",
    description:
      "Experienced motorcycle technician specializing in diagnostics, repairs, and performance upgrades for big bikes and premium motorcycles.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "JAMES",
    role: "Senior Mechanic",
    title: "Service & Installation Specialist",
    description:
      "Focused on PMS, mechanical repairs, and proper installation of accessories, electronics, and safety upgrades.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "MARVIN",
    role: "Service Advisor",
    title: "Rider Support & Coordination",
    description:
      "Your point of contact for service consultations, job updates, and ensuring a smooth workshop experience from start to finish.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
  },
]

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const TiktokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
)


export default function OurTeam() {
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
        <div className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-[1440px] mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2
                className="text-4xl md:text-6xl lg:text-7xl text-white mb-4"
                style={{ fontFamily: "Tanker, sans-serif" }}
              >
                Our Team
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Riders, Technicians, and Professionals Who Care About Your Bike
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group bg-[#141414] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#fca311]/50 transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Image Container - Taller */}
                  <div className="relative h-80 md:h-96 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                      <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#fca311] hover:text-black transition-all duration-300 transform hover:scale-110"
                        aria-label={`${member.name}'s Facebook`}
                      >
                        <FacebookIcon />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#fca311] hover:text-black transition-all duration-300 transform hover:scale-110"
                        aria-label={`${member.name}'s Instagram`}
                      >
                        <InstagramIcon />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#fca311] hover:text-black transition-all duration-300 transform hover:scale-110"
                        aria-label={`${member.name}'s TikTok`}
                      >
                        <TiktokIcon />
                      </a>
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
