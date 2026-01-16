import { Metadata } from "next"
import ServicesListTemplate from "@modules/services/templates/services-list"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Professional motorcycle services including maintenance, repairs, diagnostics, detailing, and performance upgrades. Expert care for your ride at Sixthgear.",
}

export default function ServicesPage() {
  return <ServicesListTemplate />
}
