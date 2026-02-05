import { HttpTypes } from "@medusajs/types"

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export function getStockStatus(item: HttpTypes.StoreCartLineItem): StockStatus {
  const variant = item.variant

  if (!variant) return "in_stock"

  // Check if inventory is managed
  // If manage_inventory is undefined or false, treat as always in stock
  if (
    variant.manage_inventory === false ||
    variant.manage_inventory === undefined
  ) {
    return "in_stock"
  }

  // If inventory_quantity is undefined, treat as in stock (data not loaded)
  const inventoryQuantity = variant.inventory_quantity
  if (inventoryQuantity === undefined || inventoryQuantity === null) {
    return "in_stock"
  }

  if (inventoryQuantity === 0) return "out_of_stock"
  if (inventoryQuantity <= 5) return "low_stock"

  return "in_stock"
}

export function getStockLabel(status: StockStatus, quantity?: number): string {
  switch (status) {
    case "out_of_stock":
      return "Out of Stock"
    case "low_stock":
      return `Only ${quantity || 0} left`
    default:
      return ""
  }
}

export function isItemOutOfStock(item: HttpTypes.StoreCartLineItem): boolean {
  return getStockStatus(item) === "out_of_stock"
}
