"use client"

/**
 * Coffee Showcase Section
 * Displays featured coffee drinks with paper cut design
 * Uses Tanker font for headings and Inter Display for body text
 * Mobile/Tablet: Horizontal swipe carousel
 * Desktop: 3-column grid
 */

// Featured coffee drinks data
const featuredDrinks = [
  {
    id: 1,
    name: "Iced Hazelnut Latte",
    description:
      "Smooth espresso blended with creamy hazelnut and chilled milk.",
    image: "/images/firstgear-coffee/hazelnut.png",
  },
  {
    id: 2,
    name: "Cold Brew Delight",
    description: "Slow-steeped coffee with a bold aroma and silky finish.",
    image: "/images/firstgear-coffee/coldbrew.png",
  },
  {
    id: 3,
    name: "Mocha Fusion",
    description:
      "Rich chocolate, fresh espresso, and whipped cream perfection.",
    image: "/images/firstgear-coffee/mochafusion.png",
  },
]

export default function CoffeeShowcase() {
  return (
    <section className="relative">
      {/* Top Paper Cut */}
      <div className="w-full -mb-1">
        <img
          src="/images/firstgear-coffee/imgi_13_691aef1ff3fe8593c72c20e1_Frame 2147239539.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Main Brown Section */}
      <div className="bg-[#47271f] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16 lg:py-24">
          {/* Main Heading - Top */}
          <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <h2
              className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl leading-tight"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              <span className="text-[#F16D34]">Sixthgear</span>
              <span className="text-white"> fuels more than rides.</span>
              <br />
              <span className="text-amber-400">We serve coffee too.</span>
            </h2>
          </div>

          {/* Mobile/Tablet: Horizontal Scroll */}
          <div className="lg:hidden">
            <div
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {featuredDrinks.map((drink) => (
                <div
                  key={drink.id}
                  className="group relative flex-shrink-0 w-[75vw] sm:w-[55vw] md:w-[45vw] snap-center"
                >
                  {/* Card */}
                  <div className="bg-[#F5F5F0] rounded-2xl overflow-hidden transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative aspect-[2/3] bg-gradient-to-b from-gray-50 to-gray-100">
                      <img
                        src={drink.image}
                        alt={drink.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Coffee Title Below Card */}
                  <div className="text-center mt-4">
                    <h3
                      className="text-white text-lg sm:text-xl uppercase tracking-wide"
                      style={{ fontFamily: "Tanker, sans-serif" }}
                    >
                      {drink.name}
                    </h3>
                    <p
                      className="text-gray-400 text-sm leading-relaxed mt-1 px-2"
                      style={{
                        fontFamily: "Inter Display, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {drink.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Swipe Indicator */}
            <div className="flex justify-center mt-4">
              <span className="text-xs text-amber-400/60 flex items-center gap-1">
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
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                Swipe to explore
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 lg:gap-10">
            {featuredDrinks.map((drink) => (
              <div key={drink.id} className="group relative">
                {/* Card - Large & Dominating */}
                <div className="bg-[#F5F5F0] rounded-3xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-amber-500/20 group-hover:-translate-y-3">
                  {/* Image Container - Dominating Size */}
                  <div className="relative aspect-[2/3] bg-gradient-to-b from-gray-50 to-gray-100">
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Coffee Title Below Card */}
                <div className="text-center mt-6">
                  <h3
                    className="text-white text-xl md:text-2xl lg:text-3xl uppercase tracking-wide"
                    style={{ fontFamily: "Tanker, sans-serif" }}
                  >
                    {drink.name}
                  </h3>
                  <p
                    className="text-gray-400 text-sm md:text-base leading-relaxed mt-2 px-2"
                    style={{
                      fontFamily: "Inter Display, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {drink.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Subheading - Bottom */}
          <div className="text-center mt-12 md:mt-16 lg:mt-20">
            <p
              className="text-gray-300 text-sm md:text-base lg:text-xl max-w-3xl mx-auto mb-6 md:mb-8"
              style={{
                fontFamily: "Inter Display, sans-serif",
                fontWeight: 500,
              }}
            >
              More than a pit stop it's where riders refuel, relax, and
              reconnect. Handcrafted brews served with passion, right here at
              Sixthgear.
            </p>
            <button className="bg-[#F16D34] hover:bg-[#ff7a3d] text-white font-bold px-8 md:px-10 py-3 md:py-4 rounded-none transition-all duration-300 inline-flex items-center gap-2 md:gap-3 group text-base md:text-lg">
              <span
                style={{
                  fontFamily: "Inter Display, sans-serif",
                  fontWeight: 500,
                }}
              >
                View Full Menu
              </span>
              <svg
                className="w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform"
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

      {/* Bottom Paper Cut */}
      <div className="w-full -mt-1">
        <img
          src="/images/firstgear-coffee/imgi_16_691c021fe5be5a70061df439_Frame 2147239540.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>
    </section>
  )
}
