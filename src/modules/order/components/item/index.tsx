import { HttpTypes } from "@medusajs/types"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <div className="flex items-start gap-4 p-6 border-b border-gray-100 last:border-0" data-testid="product-row">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
        <Thumbnail thumbnail={item.thumbnail} size="square" />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-medium text-gray-900 mb-1 leading-tight"
          data-testid="product-name"
        >
          {item.product_title}
        </h3>
        <div className="text-sm text-gray-500" data-testid="product-variant">
          <LineItemOptions variant={item.variant} />
        </div>
      </div>

      {/* Price Info */}
      <div className="flex flex-col items-end text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
          <span data-testid="product-quantity">{item.quantity}</span>
          <span>×</span>
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
        <div className="font-semibold text-gray-900">
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </div>
  )
}

export default Item
