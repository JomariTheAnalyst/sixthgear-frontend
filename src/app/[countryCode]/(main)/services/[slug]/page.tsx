import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getService,
  getAllServices,
  getAllServiceSlugs,
} from "@lib/strapi/services"
import ServiceDetailTemplate from "@modules/services/templates/service-detail"

interface ServicePageProps {
  params: Promise<{
    countryCode: string
    slug: string
  }>
}

// Use dynamic rendering with ISR for CMS-driven content
// This prevents build failures when new services are added to Strapi
export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

// OPTIONAL: If you want static generation, uncomment this and comment out dynamic/revalidate above
// But this requires all slugs to exist at build time
/*
export async function generateStaticParams() {
  try {
    const slugs = await getAllServiceSlugs()
    const countryCodes = ["ph", "us", "sg", "my"] // Add all supported country codes
    
    // Generate all combinations of countryCode and slug
    const params = countryCodes.flatMap((countryCode) =>
      slugs.map((slug) => ({
        countryCode,
        slug,
      }))
    )
    
    console.log(`[Services] Generated ${params.length} static params`)
    return params
  } catch (error) {
    console.error("[Services] Error generating static params:", error)
    // Return empty array to allow dynamic rendering as fallback
    return []
  }
}
*/

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const service = await getService(slug)

    if (!service) {
      return {
        title: "Service Not Found",
        description: "The requested service could not be found.",
      }
    }

    return {
      title: service.title,
      description: service.description || service.title,
    }
  } catch (error) {
    console.error("[Services] Error generating metadata:", error)
    return {
      title: "Service",
      description: "Sixthgear Moto Supply Services",
    }
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  try {
    const { slug } = await params

    // Fetch service data with error handling
    const service = await getService(slug)

    if (!service) {
      console.log(`[Services] Service not found: ${slug}`)
      notFound()
    }

    // Fetch other services with error handling
    let otherServices = await getAllServices()

    // Filter out current service and handle empty array
    if (otherServices && Array.isArray(otherServices)) {
      otherServices = otherServices.filter((s) => s.slug !== slug)
    } else {
      otherServices = []
    }

    return (
      <ServiceDetailTemplate service={service} otherServices={otherServices} />
    )
  } catch (error) {
    console.error("[Services] Error rendering service page:", error)
    // Return 404 instead of 500 for any errors
    notFound()
  }
}
