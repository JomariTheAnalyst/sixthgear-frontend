import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getServiceBySlug,
  servicesData,
  getAllServiceSlugs,
} from "@lib/services-data"
import ServiceDetailTemplate from "@modules/services/templates/service-detail"

interface ServicePageProps {
  params: Promise<{
    countryCode: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: service.title,
    description: service.description,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  return (
    <ServiceDetailTemplate service={service} otherServices={servicesData} />
  )
}
