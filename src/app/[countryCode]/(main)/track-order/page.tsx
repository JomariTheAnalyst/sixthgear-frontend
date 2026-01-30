import { Metadata } from "next"
import TrackOrderTemplate from "@modules/order/templates/track-order-template"

export const metadata: Metadata = {
  title: "Track Your Order | Sixthgear Moto Supply",
  description: "Track your Sixthgear order status and delivery information.",
}

export default function TrackOrderPage() {
  return <TrackOrderTemplate />
}
