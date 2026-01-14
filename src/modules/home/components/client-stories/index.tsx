"use client"

import Image from "next/image"

const stories = [
  {
    title: "First Long Ride After Engine Rebuild",
    excerpt: "After months of waiting, finally took my bike out for a 300km ride. The engine feels brand new thanks to the team at Sixthgear.",
    author: "Marco R.",
    date: "January 10, 2026",
    category: "Rider Story",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    title: "Why Regular PMS Matters",
    excerpt: "A quick guide on preventive maintenance schedules and why sticking to them can save you from costly repairs down the road.",
    author: "Sixthgear Team",
    date: "January 5, 2026",
    category: "Garage Notes",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80",
  },
  {
    title: "Weekend Ride to Tagaytay",
    excerpt: "Joined the Sunday group ride with fellow riders. Great weather, great roads, and even better company at the coffee stop.",
    author: "James L.",
    date: "December 28, 2025",
    category: "Rider Story",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
  },
]

export default function ClientStories() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            Rider Stories & Garage Notes
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Tips, stories, and insights from the workshop, the road, and the rider lounge
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#fca311] text-black text-xs font-semibold px-3 py-1 rounded-full">
                    {story.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#fca311] transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {story.excerpt}
                </p>
                
                {/* Author & Date */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">{story.author}</span>
                  <span className="text-gray-400">{story.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#fca311] hover:bg-[#e5940e] text-black font-semibold px-8 py-3 rounded-full transition-colors"
          >
            View All Stories
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
