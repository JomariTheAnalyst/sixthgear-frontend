import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import ProductCard from "@modules/home/components/product-sections/product-card"
import { getProductsInventory } from "@lib/data/products"

type YouMayLikeProps = {
  productId: string
  countryCode: string
  region: HttpTypes.StoreRegion
}

export default async function YouMayLike({
  productId,
  countryCode,
  region,
}: YouMayLikeProps) {
  console.log(`[YouMayLike Component] Rendering for product: ${productId}`)

  // Fetch related products from our custom endpoint (uses Meilisearch for IDs)
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  let relatedProductIds: string[] = []

  try {
    const response = await fetch(
      `${backendUrl}/store/products/${productId}/related`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": apiKey || "",
        },
        next: {
          revalidate: 60,
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      relatedProductIds = data.related_products?.map((p: any) => p.id) || []
      console.log(
        `[YouMayLike Component] Got ${relatedProductIds.length} product IDs`
      )
    }
  } catch (error) {
    console.error(`[YouMayLike Component] Error fetching related IDs:`, error)
  }

  // If no related products, return empty state
  if (relatedProductIds.length === 0) {
    return (
      <div className="w-full">
        <h2
          className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-8"
          style={{ fontFamily: "BRHendrix, sans-serif" }}
        >
          You May Like
        </h2>
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            No related products found at the moment.
          </p>
        </div>
      </div>
    )
  }

  // Fetch full product details with calculated_price from Medusa
  const { products } = await sdk.store.product
    .list({
      id: relatedProductIds,
      region_id: region.id,
      fields: "*variants.calculated_price,+variants.inventory_quantity",
      limit: 3,
    })
    .catch(() => ({ products: [] }))

  console.log(
    `[YouMayLike Component] Fetched ${products?.length || 0} full products`
  )

  if (!products || products.length === 0) {
    return (
      <div className="w-full">
        <h2
          className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-8"
          style={{ fontFamily: "BRHendrix, sans-serif" }}
        >
          You May Like
        </h2>
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            No related products found at the moment.
          </p>
        </div>
      </div>
    )
  }

  // Get inventory data for stock status
  const inventoryByProduct = await getProductsInventory(
    products.map((p) => p.id!)
  )

  // Flatten inventory map: product_id -> variant_id -> quantity becomes variant_id -> quantity
  const inventoryMap: Record<string, number> = {}
  Object.values(inventoryByProduct).forEach((variantMap) => {
    Object.entries(variantMap).forEach(([variantId, quantity]) => {
      inventoryMap[variantId] = quantity
    })
  })

  return (
    <div className="w-full">
      {/* Section Header */}
      <h2
        className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-8"
        style={{ fontFamily: "BRHendrix, sans-serif" }}
      >
        You May Like
      </h2>

      {/* Product Grid - Wider cards (3 columns on desktop instead of 6) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            region={region}
            inventoryMap={inventoryMap}
          />
        ))}
      </div>
    </div>
  )
}
