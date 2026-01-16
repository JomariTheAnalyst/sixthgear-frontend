"use client"

/**
 * About Story Section
 * Main narrative about Sixthgear
 */

import Image from "next/image"

export default function AboutStory() {
  return (
    <section className="bg-[#FAFAFA] py-20 md:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/sixthgear-workshop.jpg"
                alt="Sixthgear Workshop"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-[#F16D34] text-white px-6 py-4 rounded-2xl shadow-xl">
              <p
                className="text-3xl md:text-4xl font-bold"
                style={{ fontFamily: "Tanker, sans-serif" }}
              >
                100%
              </p>
              <p
                className="text-sm text-white/80"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                Rider Focused
              </p>
            </div>
          </div>

          {/* Right - Content */}
          <div>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-[#1a1a1a] uppercase leading-[1.1] mt-4 mb-8"
              style={{ fontFamily: "Tanker, sans-serif" }}
            >
              More Than a Shop,
              <br />
              <span className="text-[#F16D34]">A Rider's Space</span>
            </h2>

            <div
              className="space-y-6 text-[#4a4a4a] text-base md:text-lg text-justify leading-relaxed"
              style={{ fontFamily: "Inter Display, sans-serif" }}
            >
              <p>
                <strong className="text-[#1a1a1a]">
                  Sixth Gear Moto Supply Café + Lounge
                </strong>{" "}
                is built by riders, for riders. We are a premium motorcycle
                service hub that combines professional workshop expertise with a
                relaxed café and lounge experience, powered by First Gear
                Coffee.
              </p>

              <p>
                From routine PMS to advanced diagnostics, repairs, and
                performance upgrades, our workshop is equipped to handle big
                bikes and premium motorcycles with precision, care, and
                attention to detail. We believe proper maintenance is not just
                about fixing issues, but about ensuring safety, reliability, and
                riding confidence.
              </p>

              <p>
                Beyond servicing, Sixth Gear offers a curated selection of
                quality motorcycle accessories, riding gear, helmets, and
                performance parts. We also provide professional bike wash,
                detailing, and cosmetic restoration to keep your motorcycle
                looking and performing at its best.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
