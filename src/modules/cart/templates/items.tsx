import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table, Checkbox } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { useSelectedItems } from "@lib/context/selected-cart-items-context"
import { isItemOutOfStock } from "@lib/util/cart-helpers"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const { selectAll, deselectAll, selectedItems } = useSelectedItems()

  // Get only in-stock items for selection
  const inStockItems = items?.filter((item) => !isItemOutOfStock(item)) || []
  const inStockItemIds = inStockItems.map((item) => item.id)

  // Check if all in-stock items are selected
  const allSelected =
    inStockItemIds.length > 0 &&
    inStockItemIds.every((id) => selectedItems.has(id))

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll()
    } else {
      selectAll(inStockItemIds)
    }
  }

  return (
    <div>
      <div className="pb-3 flex items-center justify-between">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
        {items && items.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              disabled={inStockItems.length === 0}
            />
            <span className="text-sm text-ui-fg-subtle">
              {allSelected ? "Deselect All" : "Select All"}
            </span>
          </div>
        )}
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0 w-12"></Table.HeaderCell>
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
