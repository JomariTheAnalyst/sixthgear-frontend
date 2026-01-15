import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-3">
      {/* Brand/Collection Link */}
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-[#F16D34] transition-colors"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}

      {/* Product Title */}
      <h1
        className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight uppercase"
        data-testid="product-title"
        style={{ fontFamily: "BRHendrix, sans-serif" }}
      >
        {product.title}
      </h1>

      {/* Categories/Tags (if available) */}
      {product.categories && product.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.categories.map((category) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {category.name}
            </LocalizedClientLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductInfo
