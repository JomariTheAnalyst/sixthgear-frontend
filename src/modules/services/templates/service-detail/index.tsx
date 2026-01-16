"use client"

/**
 * Service Detail Template
 * Complete page template for individual service pages
 */

import { ServiceCategory } from "@lib/services-data"
import ServiceHero from "../service-hero"
import ServiceItems from "../service-items"
import ServiceCTA from "../service-cta"
import CTABanner from "@modules/home/components/cta-banner"
import OtherServices from "../other-services"

interface ServiceDetailTemplateProps {
  service: ServiceCategory
  otherServices: ServiceCategory[]
}

export default function ServiceDetailTemplate({
  service,
  otherServices,
}: ServiceDetailTemplateProps) {
  return (
    <>
      <ServiceHero service={service} />
      <ServiceItems service={service} />
      <OtherServices services={otherServices} currentSlug={service.slug} />
      <CTABanner/>
    </>
  )
}
