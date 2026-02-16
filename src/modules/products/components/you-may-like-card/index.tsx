import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export default function YouMayLikeCard({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  const hasDiscount = cheapestPrice?.price_type === "sale"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div className="relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#F16D34] transition-all duration-300 hover:shadow-xl">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Sale Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                SALE
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick View Text */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
              View Details →
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#F16D34] transition-colors duration-200 min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2 flex-wrap">
            {hasDiscount && cheapestPrice?.original_price ? (
              <>
                {/* Sale Price */}
                <span className="text-lg font-bold text-red-600">
                  {cheapestPrice.calculated_price}
                </span>
                {/* Original Price */}
                <span className="text-sm text-gray-400 line-through">
                  {cheapestPrice.original_price}
                </span>
              </>
            ) : (
              /* Regular Price */
              <span className="text-lg font-bold text-gray-900">
                {cheapestPrice?.calculated_price}
              </span>
            )}
          </div>

          {/* Discount Percentage */}
          {hasDiscount &&
            cheapestPrice?.original_price &&
            cheapestPrice?.calculated_price && (
              <div className="mt-2">
                <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                  Save{" "}
                  {Math.round(
                    ((parseFloat(
                      cheapestPrice.original_price.replace(/[^0-9.]/g, "")
                    ) -
                      parseFloat(
                        cheapestPrice.calculated_price.replace(/[^0-9.]/g, "")
                      )) /
                      parseFloat(
                        cheapestPrice.original_price.replace(/[^0-9.]/g, "")
                      )) *
                      100
                  )}
                  %
                </span>
              </div>
            )}
        </div>

        {/* Bottom Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#F16D34] to-[#ff8c5a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </LocalizedClientLink>
  )
}
