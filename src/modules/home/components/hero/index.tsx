"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Background Texture/Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/homepage/banner-img.png"
          alt="Hero Background"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
          priority
        />
        {/* Dark Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left: Bike Visual with Gold Arch */}
        <div className="relative w-full h-[50vh] lg:h-full flex items-center justify-center order-2 lg:order-1">
            {/* Gold Arch */}
            <div className="absolute left-0 lg:left-10 top-1/2 -translate-y-1/2 w-[280px] md:w-[400px] h-[400px] md:h-[600px] border-[16px] md:border-[24px] border-[#B88746] rounded-t-full z-0 opacity-80" />
            
            {/* Bike Image */}
            <div className="relative z-10 w-[120%] md:w-[110%] max-w-[800px] translate-x-4 md:translate-x-12">
                <Image
                    src="/images/homepage/banner-bike-img.png"
                    alt="Premium Motorcycle"
                    width={800}
                    height={600}
                    className="object-contain drop-shadow-2xl animate-in slide-in-from-left duration-1000 fade-in"
                    priority
                />
            </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col items-start justify-center gap-6 lg:pl-12 order-1 lg:order-2 pt-20 lg:pt-0">
          
         
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-[#B88746] via-[#F16D34] to-[#B88746] animate-in slide-in-from-right duration-1000 delay-100 fade-in fill-mode-forwards">
             Best Bike Repair & Maintenance Services <br />
            
          </h1>

          {/* Subtext */}
          <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed animate-in slide-in-from-right duration-1000 delay-200 fade-in fill-mode-forwards">
             Professional two-wheeler servicing, repairs, detailing & performance upgrades. Trusted by riders for precision and care.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-4 animate-in slide-in-from-right duration-1000 delay-300 fade-in fill-mode-forwards">
            <LocalizedClientLink
              href="/about"
              className="px-8 py-4 bg-gradient-to-r from-[#B88746] to-[#F16D34] text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(241,109,52,0.5)] transition-all transform hover:-translate-y-1"
            >
              More About Us
            </LocalizedClientLink>
            
            <LocalizedClientLink
              href="/services"
              className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white transition-all"
            >
              View All Services
            </LocalizedClientLink>
          </div>

          
        </div>

      </div>
    </div>
  )
}

export default Hero
