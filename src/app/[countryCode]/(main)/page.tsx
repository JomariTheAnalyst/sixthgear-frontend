import { Metadata } from "next"
import { Suspense } from "react"

import Hero from "@modules/home/components/hero"
import AboutSection from "@modules/home/components/about"
import OurServices from "@modules/home/components/our-services"
import ShopByCategories from "@modules/home/components/categories"
import SatisfiedCustomers from "@modules/home/components/satisfied-customers"
import CoffeeShowcase from "@modules/home/components/coffee-showcase"
import ClientTestimonials from "@modules/home/components/client-testimonials"
import CTABanner from "@modules/home/components/cta-banner"
import Franchise from "@modules/home/components/franchise"
import OurTeam from "@modules/home/components/our-team"
import Stats from "@modules/home/components/stats"
import ProjectsSection from "@modules/home/components/projects"
import Brands from "@modules/home/components/brands"
import ClientStories from "@modules/home/components/client-stories"
import StoreLocation from "@modules/home/components/store-location"
import {
  HotDealsSection,
  BestSellersSection,
  NewArrivalsSection,
} from "@modules/home/components/product-sections"
import { getRegion } from "@lib/data/regions"
import { getMarketingForPath } from "@lib/data/marketing"
import { BannerSlot, PopupAds } from "@modules/marketing"
import {
  getHeroContent,
  fetchHomeContent,
  extractHeroContent,
} from "@lib/strapi/home"
import { getAboutContent } from "@lib/strapi/about"
import { getCoffeeShowcaseContent } from "@lib/strapi/coffee"
import { getMotoServicesContent } from "@lib/strapi/services"

// Force dynamic rendering for real-time sale price updates
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Home",
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

  // Fetch marketing content for homepage
  const marketing = await getMarketingForPath("/")

  // Fetch home content from Strapi CMS (includes hero and about sections)
  const homeContent = await fetchHomeContent()
  const heroContent = homeContent ? extractHeroContent(homeContent) : null
  const aboutContent = getAboutContent(homeContent)
  const coffeeContent = getCoffeeShowcaseContent(homeContent)
  const servicesContent = getMotoServicesContent(homeContent)

  // Debug logging
  console.log("[HomePage] About content from Strapi:", aboutContent)
  console.log("[HomePage] Coffee content from Strapi:", coffeeContent)
  console.log("[HomePage] Services content from Strapi:", servicesContent)

  return (
    <>
      {/* Hero Section */}
      <Hero
        trustBadge={heroContent?.trustBadge}
        title={heroContent?.title}
        description={heroContent?.description}
        primaryCta={heroContent?.primaryCta}
        secondaryCta={heroContent?.secondaryCta}
        backgroundImage={heroContent?.backgroundImage}
      />

      {/* Top Banner Slot */}
      <BannerSlot
        banners={marketing.banners}
        placement="home_hero_below"
        className="px-4 md:px-8 lg:px-16 py-4 max-w-7xl mx-auto"
      />

      {/* About Section */}
      <AboutSection
        kicker={aboutContent?.kicker}
        title={aboutContent?.title}
        description={aboutContent?.description}
        highlights={aboutContent?.highlights}
        primaryCta={aboutContent?.primaryCta}
        imageTop={aboutContent?.imageTop}
        imageBottom={aboutContent?.imageBottom}
        videoUrl={aboutContent?.videoUrl}
      />

      {/* Shop By Categories */}
      <ShopByCategories />

      {/* Hot Deals */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <HotDealsSection region={region} countryCode={countryCode} />
      </Suspense>

      {/* Mid-page Banner Slot */}
      <BannerSlot
        banners={marketing.banners}
        placement="home_mid"
        className="px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto"
      />

      {/* Best Sellers */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <BestSellersSection region={region} countryCode={countryCode} />
      </Suspense>

      {/* New Arrivals */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <NewArrivalsSection region={region} countryCode={countryCode} />
      </Suspense>

      {/* Coffee Showcase */}
      <CoffeeShowcase
        mainHeadingLine1={coffeeContent?.mainHeadingLine1}
        highlightedWord={coffeeContent?.highlightedWord}
        mainHeadingLine2={coffeeContent?.mainHeadingLine2}
        descriptionText={coffeeContent?.descriptionText}
        buttonText={coffeeContent?.buttonText}
        buttonLink={coffeeContent?.buttonLink}
        coffeeItems={coffeeContent?.coffeeItems}
      />

      {/* Our Services */}
      {servicesContent ? (
        <OurServices
          sectionTitle={servicesContent.sectionTitle}
          sectionDescription={servicesContent.sectionDescription}
          services={servicesContent.services}
        />
      ) : (
        <OurServices />
      )}

      {/* Project Section */}
      <ProjectsSection />

      {/* <Stats/> */}

      <Brands />

      {/* satisfied customers */}
      <SatisfiedCustomers />

      {/* Franchise Section */}
      <Franchise />

      {/* Our Team Section */}
      <OurTeam />

      {/* Client Testimonials */}
      <ClientTestimonials />

      {/* Client Stories */}
      <ClientStories />

      {/* CTA Banner - Opening Hours */}
      <CTABanner />

      {/* Store Location */}
      <StoreLocation />

      {/* Popup Ads - Shows after page load */}
      <PopupAds popups={marketing.popups} />
    </>
  )
}
