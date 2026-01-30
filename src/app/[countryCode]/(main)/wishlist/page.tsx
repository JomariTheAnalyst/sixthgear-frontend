import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getWishlist } from "@lib/data/wishlist"
import { retrieveCustomer } from "@lib/data/customer"
import { sdk } from "@lib/config"
import WishlistPage from "@modules/wishlist/templates/wishlist-page"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "My Wishlist - Sixthgear",
  description: "View and manage your saved items",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Wishlist({ params }: Props) {
  const { countryCode } = await params

  // Check if customer is logged in
  const customer = await retrieveCustomer()

  if (!customer) {
    redirect(`/${countryCode}/login?redirect=/${countryCode}/wishlist`)
  }

  // Get wishlist
  const wishlist = await getWishlist()

  console.log("📋 Wishlist:", wishlist)

  // Fetch product details by variant IDs (more reliable than product_id)
  const productMap = new Map<string, HttpTypes.StoreProduct>()

  if (wishlist && wishlist.items.length > 0) {
    console.log("🔍 Fetching products for", wishlist.items.length, "items")

    // Get all variant IDs
    const variantIds = wishlist.items.map((item) => item.variant_id)
    console.log("🔍 Variant IDs:", variantIds)

    try {
      // Fetch all products with their variants
      const allProductsResponse = await sdk.store.product.list({
        fields:
          "+variants.calculated_price,+variants,+images,+thumbnail,+collection",
        region_id: "reg_01KERKK0FWDKFAQFTTR9E86R8Z",
        limit: 100,
      })

      console.log("📦 Fetched", allProductsResponse.products.length, "products")

      // For each wishlist item, find the product that contains its variant
      wishlist.items.forEach((item) => {
        const product = allProductsResponse.products.find((p) =>
          p.variants?.some((v) => v.id === item.variant_id)
        )

        if (product && item.product_id) {
          console.log(
            `✅ Found product for variant ${item.variant_id}: ${product.title}`
          )
          // Store using the wishlist item's product_id as key
          productMap.set(item.product_id, product)
        } else {
          console.log(`❌ No product found for variant ${item.variant_id}`)
        }
      })

      console.log("📦 Final product map size:", productMap.size)
      console.log("📦 Product map keys:", Array.from(productMap.keys()))
    } catch (error) {
      console.error("❌ Error fetching products:", error)
    }
  }

  return (
    <WishlistPage
      wishlist={wishlist}
      products={productMap}
      countryCode={countryCode}
    />
  )
}
