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
import {
  HeroSectionContent,
  IntroSectionContent,
  WhatWeOfferContent,
  CeoQuoteContent,
} from "@lib/strapi/about-page"

interface AboutTemplateProps {
  heroContent: HeroSectionContent
  introContent: IntroSectionContent | null
  whatWeOfferContent: WhatWeOfferContent | null
  ceoQuoteContent: CeoQuoteContent | null
}

export default function AboutTemplate({
  heroContent,
  introContent,
  whatWeOfferContent,
  ceoQuoteContent,
}: AboutTemplateProps) {
  return (
    <>
      <AboutHero
        badgeText={heroContent.badgeText}
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        backgroundImage={heroContent.backgroundImage}
        overlayStrength={heroContent.overlayStrength}
      />
      {introContent && (
        <AboutStory
          image={introContent.image ?? undefined}
          badgeText={introContent.badgeText}
          badgePosition={introContent.badgePosition}
          heading={introContent.heading}
          highlightedText={introContent.highlightedText}
          bodyText={introContent.bodyText}
        />
      )}
      {whatWeOfferContent && (
        <AboutServices
          sectionName={whatWeOfferContent.sectionName}
          heading={whatWeOfferContent.heading}
          cards={whatWeOfferContent.cards}
        />
      )}
      {ceoQuoteContent && (
        <AboutMission
          quoteText={ceoQuoteContent.quoteText}
          highlightedPhrase={ceoQuoteContent.highlightedPhrase}
          ceoName={ceoQuoteContent.ceoName}
          ceoTitle={ceoQuoteContent.ceoTitle}
          ceoPhoto={ceoQuoteContent.ceoPhoto ?? undefined}
        />
      )}
      <CTABanner />
    </>
  )
}
