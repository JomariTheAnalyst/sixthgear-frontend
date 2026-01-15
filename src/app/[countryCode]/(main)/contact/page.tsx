import { Metadata } from "next"
import ContactPage from "@modules/contact"

export const metadata: Metadata = {
  title: "Contact Us | Sixth Gear Moto Supply",
  description:
    "Get in touch with Sixth Gear Moto Supply. We're here to help with your motorcycle gear, parts, and service needs.",
}

export default function Contact() {
  return <ContactPage />
}
