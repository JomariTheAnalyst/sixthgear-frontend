"use client"

const stats = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M12 14v4" />
        <path d="M9 22h6" />
        <path d="M12 8l-1-1" />
        <path d="M12 8l1-1" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
    title: "Rider-Built Experience",
    description: "Years of hands-on motorcycle expertise",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
        <path d="M12 11v2" />
      </svg>
    ),
    title: "Trusted by Riders",
    description: "Preferred by riders and enthusiasts",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
        <circle cx="17" cy="11" r="2" />
        <path d="M19 11h2" />
        <path d="M17 9v-2" />
      </svg>
    ),
    title: "Fast Turnaround",
    description: "Efficient, reliable service delivery",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a4 4 0 0 0-8 0v2" />
        <path d="M12 12v3" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    ),
    title: "Genuine Parts & Accessories",
    description: "Trusted OEM and premium aftermarket",
  },
]

export default function Stats() {
  return (
    <section 
      className="py-12 md:py-16"
      style={{
        background: "linear-gradient(135deg, #b8860b 0%, #8B4513 50%, #654321 100%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#5c3a21]/60 backdrop-blur-sm rounded-2xl p-5 md:p-6 flex items-center gap-4"
            >
              {/* Icon */}
              <div className="flex-shrink-0 text-[#d4a574]">
                {stat.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-base md:text-lg font-bold text-white leading-tight mb-1">
                  {stat.title}
                </h3>
                <p className="text-[#d4a574] text-xs md:text-sm">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
