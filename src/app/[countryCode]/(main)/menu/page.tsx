import { Metadata } from "next"
import MenuTemplate from "@modules/menu/templates/menu-template"
import { getCoffeeMenuHero, getMenuCategories } from "@lib/strapi/coffee-menu"

// ISR revalidation - same as other pages
export const revalidate = 60

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

export default async function MenuPage() {
  console.log("==========================================================")
  console.log("[Menu Page] COFFEE MENU PAGE RENDER")
  console.log("[Menu Page] Timestamp:", new Date().toISOString())
  console.log("[Menu Page] Environment:", process.env.NODE_ENV)
  console.log("[Menu Page] Strapi URL:", process.env.STRAPI_URL)
  console.log("==========================================================")

  // Fetch hero and categories from Strapi
  const heroData = await getCoffeeMenuHero()
  const categories = await getMenuCategories()

  console.log("==========================================================")
  console.log("[Menu Page] FETCH RESULTS:")
  console.log("[Menu Page] Hero data received:", !!heroData)
  if (heroData) {
    console.log("[Menu Page] Hero title:", heroData.pageTitle)
    console.log("[Menu Page] Hero subtitle:", heroData.pageSubtitle)
    console.log("[Menu Page] Hero image:", heroData.backgroundImage)
  } else {
    console.log("[Menu Page] ⚠️ No hero data - will use fallback")
  }
  console.log(
    "[Menu Page] Categories:",
    categories.length > 0
      ? `${categories.length} categories from CMS`
      : "Using fallback"
  )
  console.log("==========================================================")

  return <MenuTemplate heroData={heroData} categories={categories} />
}
