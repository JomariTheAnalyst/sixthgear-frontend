"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table, clx } from "@medusajs/ui"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const { selectedItems, isLoading } = useSelectedItems()

  // Filter to show only selected items
  const allItems = cart.items || []
  const items = allItems.filter((item) => selectedItems.has(item.id))
  const hasOverflow = items && items.length > 4

  console.log("ItemsPreviewTemplate - isLoading:", isLoading)
  console.log(
    "ItemsPreviewTemplate - selectedItems:",
    Array.from(selectedItems)
  )
  console.log("ItemsPreviewTemplate - allItems count:", allItems.length)
  console.log("ItemsPreviewTemplate - filtered items count:", items.length)

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <Table>
        <Table.Body data-testid="items-table">
          {isLoading ? (
            repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })
          ) : allItems.length > 0 ? (
            items.length > 0 ? (
              items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      type="preview"
                      currencyCode={cart.currency_code}
                    />
                  )
                })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-ui-fg-subtle">
                  No items selected for checkout
                </td>
              </tr>
            )
          ) : (
            repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsPreviewTemplate
