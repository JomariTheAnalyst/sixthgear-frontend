import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import StarRating from "@modules/products/components/star-rating"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  averageRating?: number
  reviewCount?: number
}

const ProductInfo = ({
  product,
  averageRating = 0,
  reviewCount = 0,
}: ProductInfoProps) => {
  // Read rating from metadata (precomputed)
  const metadataRating =
    (product.metadata?.rating_average as number) || averageRating
  const metadataCount =
    (product.metadata?.rating_count as number) || reviewCount

  return (
    <div className="flex items-center gap-2">
      <StarRating
        rating={metadataRating}
        count={metadataCount}
        size="md"
        showCount={false}
      />
      {metadataCount > 0 && (
        <a
          href="#reviews"
          className="text-sm text-gray-600 hover:text-[#F16D34] transition-colors underline"
        >
          {metadataCount} Review{metadataCount !== 1 ? "s" : ""}
        </a>
      )}
    </div>
  )
}

export default ProductInfo
