import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  console.log("=== ITEMS COMPONENT DEBUG ===")
  console.log("Order ID:", order.id)
  console.log("Items received:", items?.length || 0)
  console.log("Items array:", JSON.stringify(items, null, 2))

  return (
    <div className="divide-y divide-gray-100" data-testid="products-table">
      {items?.length
        ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item) => {
              return (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={order.currency_code}
                />
              )
            })
        : repeat(5).map((i) => {
            return <SkeletonLineItem key={i} />
          })}
    </div>
  )
}

export default Items
