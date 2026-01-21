import { Metadata } from "next"
import MenuTemplate from "@modules/menu/templates/menu-template"

export const metadata: Metadata = {
  title: "Coffee Menu",
  description:
    "First Gear Coffee menu - Handcrafted espresso drinks, iced coffee, non-coffee beverages, and delicious food. Fuel your ride with great coffee at Sixthgear.",
  keywords: [
    "coffee menu",
    "espresso",
    "latte",
    "cold brew",
    "iced coffee",
    "cafe",
    "First Gear Coffee",
    "Sixthgear",
    "motorcycle cafe",
  ],
  openGraph: {
    title: "First Gear Coffee Menu | Sixthgear",
    description:
      "Handcrafted brews served with passion. Explore our full menu of hot coffee, iced coffee, non-coffee drinks, and food.",
    type: "website",
  },
}

export default function MenuPage() {
  return <MenuTemplate />
}
