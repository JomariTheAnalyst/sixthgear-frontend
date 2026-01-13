import { Metadata } from "next"
import { Suspense } from "react"

import Hero from "@modules/home/components/hero"
import AboutSection from "@modules/home/components/about"
import OurServices from "@modules/home/components/our-services"
import ShopByCategories from "@modules/home/components/categories"
import SatisfiedCustomers from "@modules/home/components/satisfied-customers"
import CoffeeShowcase from "@modules/home/components/coffee-showcase"
import {
  HotDealsSection,
  BestSellersSection,
  NewArrivalsSection,
} from "@modules/home/components/product-sections"
import { getRegion } from "@lib/data/regions"

// Force dynamic rendering for real-time sale price updates
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sixthgear | Moto Supply & Café",
  description:
    "Your one-stop shop for motorcycle gear, parts, and great coffee in the Philippines.",
}

// Loading skeleton for product sections
function ProductSectionSkeleton() {
  return (
    <div className="py-12 md:py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl aspect-square" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <AboutSection />

      {/* Shop By Categories */}
      <ShopByCategories />

      {/* Hot Deals */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <HotDealsSection region={region} countryCode={countryCode} />
      </Suspense>

      {/* Best Sellers */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <BestSellersSection region={region} countryCode={countryCode} />
      </Suspense>

      {/* New Arrivals */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <NewArrivalsSection region={region} countryCode={countryCode} />
      </Suspense>

      {/* Coffee Showcase */}
      <CoffeeShowcase />

      {/* Our Services */}
      <OurServices />

      {/* satisfied customers */}
      <SatisfiedCustomers />
    </>
  )
}
