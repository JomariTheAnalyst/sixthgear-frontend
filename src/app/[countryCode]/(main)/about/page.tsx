import { Metadata } from "next"
import AboutTemplate from "@modules/about/templates"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Sixth Gear Moto Supply Café + Lounge - Built by riders, for riders. Premium motorcycle service hub with professional workshop expertise and a relaxed café experience.",
}

export default function AboutPage() {
  return <AboutTemplate />
}
