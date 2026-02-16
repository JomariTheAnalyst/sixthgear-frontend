import { listProducts, getProductInventory } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import ProductPrice from "@modules/products/components/product-price"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  priceOnly = false,
}: {
  id: string
  region: HttpTypes.StoreRegion
  priceOnly?: boolean
}) {
  const product = await listProducts({
    queryParams: { id: [id] },
    regionId: region.id,
  }).then(({ response }) => response.products[0])

  if (!product) {
    return null
  }

  // If priceOnly, just show the price
  if (priceOnly) {
    return <ProductPrice product={product} variant={product.variants?.[0]} />
  }

  // Fetch inventory data
  const inventoryMap = await getProductInventory(id)

  return (
    <ProductActions
      product={product}
      region={region}
      inventoryMap={inventoryMap || undefined}
    />
  )
}
