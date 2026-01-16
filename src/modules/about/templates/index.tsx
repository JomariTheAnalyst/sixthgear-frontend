"use client"

/**
 * About Us Page Template
 * Combines all about sections into a complete page
 */

import AboutHero from "./hero"
import AboutStory from "./story"
import AboutServices from "./services"
import AboutMission from "./mission"
import CTABanner from "@modules/home/components/cta-banner"

export default function AboutTemplate() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutServices />
      <AboutMission />
      <CTABanner />
    </>
  )
}
