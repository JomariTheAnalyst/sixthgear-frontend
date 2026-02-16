"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const retrieveOrder = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // Use Medusa v2 field syntax with + prefix for relations
    const fields = [
      "id",
      "display_id",
      "email",
      "currency_code",
      "created_at",
      "subtotal",
      "shipping_total",
      "tax_total",
      "discount_total",
      "total",
      "payment_status",
      "fulfillment_status",
      "+items",
      "+items.variant",
      "+items.product",
      "+shipping_address",
      "+billing_address",
      "+shipping_methods",
      "+payment_collections",
      "+payment_collections.payment_sessions",
      "+payment_collections.payments",
    ].join(",")

    console.log("[retrieveOrder] Fetching order:", id)
    console.log("[retrieveOrder] Fields:", fields)

    const response = await sdk.client.fetch<HttpTypes.StoreOrderResponse>(
      `/store/orders/${id}?fields=${fields}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    console.log("[retrieveOrder] Response:", response)
    console.log("[retrieveOrder] Order items:", response.order?.items)
    console.log(
      "[retrieveOrder] Items count:",
      response.order?.items?.length || 0
    )

    return response.order
  } catch (err) {
    console.error("[retrieveOrder] Error:", err)
    throw err
  }
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // Don't use auth headers if not available
  if (!headers || Object.keys(headers).length === 0) {
    return []
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
        ...filters,
      },
      headers,
      next,
      cache: "default", // Use default caching behavior
    })
    .then(({ orders }) => orders || [])
    .catch((err) => {
      console.error("Error fetching orders:", err)
      return []
    })
}

export const createTransferRequest = async (
  state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const id = formData.get("order_id") as string

  if (!id) {
    return { success: false, error: "Order ID is required", order: null }
  }

  const headers = await getAuthHeaders()

  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: "id, email",
      },
      headers
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}
