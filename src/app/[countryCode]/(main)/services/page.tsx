import { Metadata } from "next"
import ServicesListTemplate from "@modules/services/templates/services-list"
import { getAllServices } from "@lib/strapi/services"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Professional motorcycle services including maintenance, repairs, diagnostics, detailing, and performance upgrades. Expert care for your ride at Sixthgear.",
}

export default async function ServicesPage() {
  // Fetch services from Strapi with fallback to local data
  const services = await getAllServices()

  return <ServicesListTemplate services={services} />
}
