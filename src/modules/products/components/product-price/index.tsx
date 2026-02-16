import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse rounded" />
  }

  const isOnSale = selectedPrice.price_type === "sale"

  return (
    <div className="flex flex-col gap-y-2">
      {/* Sale Badge */}
      {isOnSale && (
        <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider w-fit">
          On Sale Price
        </span>
      )}

      {/* Price Display */}
      <div className="flex items-baseline gap-3 flex-wrap">
        {/* Current/Sale Price */}
        <span
          className={clx(
            "text-2xl md:text-3xl font-bold",
            isOnSale ? "text-red-600" : "text-gray-900"
          )}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {!variant && "From "}
          {selectedPrice.calculated_price}
        </span>

        {/* Original Price (strikethrough) */}
        {isOnSale && selectedPrice.original_price && (
          <span
            className="text-lg text-gray-400 line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
        )}

        {/* Discount Percentage */}
        {isOnSale && selectedPrice.percentage_diff && (
          <span className="text-sm font-semibold text-gray-500">
            (-{selectedPrice.percentage_diff}%)
          </span>
        )}
      </div>
    </div>
  )
}
