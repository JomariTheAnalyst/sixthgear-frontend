"use client"

import { useRef } from "react"
import Image from "next/image"

/**
 * Client Stories (Rider Stories) Section
 * Displays rider stories and garage notes.
 * Now connected to Strapi CMS with field-level fallbacks.
 */

interface Story {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
}

interface ClientStoriesProps {
  sectionTitle?: string
  sectionDescription?: string
  stories?: Story[]
}

export default function ClientStories({
  sectionTitle = "Rider Stories & Garage Notes",
  sectionDescription = "Tips, stories, and insights from the workshop, the road, and the rider lounge",
  stories = [],
}: ClientStoriesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Don't render if no stories
  if (!stories || stories.length === 0) {
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
    <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8">
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {sectionTitle}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto">
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
            {stories.map((story) => (
              <article
                key={story.id}
                className="group flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] bg-white rounded-2xl overflow-hidden shadow-sm snap-center"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 45vw"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#fca311] text-black text-xs font-semibold px-3 py-1 rounded-full">
                      {story.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {story.excerpt}
                  </p>

                  {/* Author & Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-medium">
                      {story.author}
                    </span>
                    <span className="text-gray-400">{story.date}</span>
                  </div>
                </div>
              </article>
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
          {stories.map((story) => (
            <article
              key={story.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="33vw"
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
                  <span className="text-gray-700 font-medium">
                    {story.author}
                  </span>
                  <span className="text-gray-400">{story.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 md:mt-12 text-center px-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#fca311] hover:bg-[#e5940e] text-black font-semibold px-6 md:px-8 py-3 rounded-full transition-colors"
          >
            View All Stories
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
