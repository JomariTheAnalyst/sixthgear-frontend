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

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)

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
  const service = await getService(slug)

  if (!service) {
    notFound()
  }

  const otherServices = await getAllServices()

  return (
    <ServiceDetailTemplate service={service} otherServices={otherServices} />
  )
}
