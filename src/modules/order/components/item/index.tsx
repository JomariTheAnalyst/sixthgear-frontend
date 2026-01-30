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
    <div
      className="flex items-start gap-4 p-6 hover:bg-gray-50/50 transition-colors"
      data-testid="product-row"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-24 h-24 bg-white rounded-xl overflow-hidden border border-gray-200">
        <Thumbnail thumbnail={item.thumbnail} size="square" />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-gray-900 mb-2 leading-tight"
          style={{ fontFamily: "BRHendrix, sans-serif" }}
          data-testid="product-name"
        >
          {item.product_title}
        </h3>
        <div
          className="text-sm text-gray-500 mb-3"
          data-testid="product-variant"
        >
          <LineItemOptions variant={item.variant} />
        </div>

        {/* Quantity Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
          <span className="text-xs font-medium text-gray-600">Qty:</span>
          <span
            className="text-xs font-bold text-gray-900"
            data-testid="product-quantity"
          >
            {item.quantity}
          </span>
        </div>
      </div>

      {/* Price Info */}
      <div className="flex flex-col items-end text-right flex-shrink-0">
        <div className="text-xs text-gray-500 mb-1">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
          {" each"}
        </div>
        <div
          className="text-lg font-bold text-gray-900"
          style={{ fontFamily: "BRHendrix, sans-serif" }}
        >
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
