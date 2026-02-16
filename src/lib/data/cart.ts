"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { getLocale } from "@lib/data/locale-actions"

/**
 * Checks if a cart has a succeeded payment session that blocks operations
 * @param cart - The cart to check
 * @returns true if cart is stuck with succeeded payment
 */
function isCartStuckWithSucceededPayment(cart: any): boolean {
  if (!cart?.payment_collection?.payment_sessions) {
    return false
  }

  // Check if any payment session has succeeded status
  const hasSucceededPayment = cart.payment_collection.payment_sessions.some(
    (session: any) =>
      session.status === "authorized" ||
      session.data?.status === "succeeded" ||
      session.data?.status === "processing"
  )

  return hasSucceededPayment
}

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * If the cart is stuck with a succeeded payment or completed, it creates a new cart automatically.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields?: string) {
  const id = cartId || (await getCartId())
  fields ??=
    "*items.variant, *items.product.images, *region, +items.total, *promotions, +shipping_methods.name, *payment_collection.payment_sessions, +completed_at"

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  try {
    const cart = await sdk.client
      .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
        method: "GET",
        query: {
          fields,
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ cart }: { cart: HttpTypes.StoreCart }) => cart)

    // Check if cart is completed (order was placed)
    if (cart && cart.completed_at) {
      console.log(
        "[Cart] Detected completed cart (order placed). Creating new cart..."
      )

      // Remove the completed cart ID
      await removeCartId()

      // Revalidate cart cache
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      // Return null to trigger new cart creation
      return null
    }

    // Check if cart is stuck with succeeded payment
    if (cart && isCartStuckWithSucceededPayment(cart)) {
      console.log(
        "[Cart] Detected stuck cart with succeeded payment. Creating new cart..."
      )

      // Remove the stuck cart ID
      await removeCartId()

      // Revalidate cart cache
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      // Return null to trigger new cart creation
      return null
    }

    return cart
  } catch (error: any) {
    console.error("[Cart] Error retrieving cart:", error)

    // If cart not found or any error, remove the cart ID cookie
    if (
      error.message?.includes("not found") ||
      error.message?.includes("404")
    ) {
      console.log("[Cart] Cart not found, removing cart ID cookie...")
      await removeCartId()

      // Revalidate cart cache
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    }

    return null
  }
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart(undefined, "id,region_id")

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const locale = await getLocale()
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id, locale: locale || undefined },
      {},
      headers
    )
    cart = cartResp.cart

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

/**
 * Forces creation of a new cart by removing the old cart ID
 * Useful when the current cart is stuck (e.g., after failed payment cleanup)
 */
export async function forceNewCart(countryCode: string) {
  try {
    // Remove the old cart ID
    await removeCartId()

    // Create a new cart
    const newCart = await getOrSetCart(countryCode)

    console.log("[Cart] Forced new cart creation:", newCart.id)

    return newCart
  } catch (error: any) {
    console.error("[Cart] Failed to force new cart:", error)
    throw error
  }
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  // Check cart limit (49 items)
  const CART_LIMIT = 49
  const currentItemCount =
    cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  if (currentItemCount + quantity > CART_LIMIT) {
    throw new Error(`CART_LIMIT_EXCEEDED:${currentItemCount}:${CART_LIMIT}`)
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.store.cart
      .createLineItem(
        cart.id,
        {
          variant_id: variantId,
          quantity,
        },
        {},
        headers
      )
      .then(async () => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
      })
  } catch (error: any) {
    // If cart is completed, create a new cart and retry
    if (error.message?.includes("already completed")) {
      console.log("[Cart] Cart is completed, creating new cart and retrying...")

      // Remove the completed cart ID
      await removeCartId()

      // Create a new cart
      const newCart = await getOrSetCart(countryCode)

      if (!newCart) {
        throw new Error("Failed to create new cart")
      }

      // Retry adding to the new cart
      await sdk.store.cart
        .createLineItem(
          newCart.id,
          {
            variant_id: variantId,
            quantity,
          },
          {},
          headers
        )
        .then(async () => {
          const cartCacheTag = await getCacheTag("carts")
          revalidateTag(cartCacheTag)
        })

      return
    }

    // For other errors, use standard error handler
    throw medusaError(error)
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function changeLineItemVariant({
  lineId,
  newVariantId,
  quantity,
}: {
  lineId: string
  newVariantId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when changing variant")
  }

  if (!newVariantId) {
    throw new Error("Missing new variant ID when changing variant")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when changing variant")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Delete the old line item
  await sdk.store.cart.deleteLineItem(cartId, lineId, {}, headers)

  // Add the new line item with the new variant
  await sdk.store.cart.createLineItem(
    cartId,
    {
      variant_id: newVariantId,
      quantity,
    },
    {},
    headers
  )

  // Revalidate caches
  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  const fulfillmentCacheTag = await getCacheTag("fulfillment")
  revalidateTag(fulfillmentCacheTag)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const waitForPaymentCollection = async (
    cartId: string,
    maxAttempts: number = 8
  ): Promise<HttpTypes.StoreCart | null> => {
    let delayMs = 150

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const freshCart = await sdk.client
        .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}`, {
          method: "GET",
          query: {
            fields: "id,*payment_collection.payment_sessions",
          },
          headers,
          cache: "no-store",
        })
        .then(({ cart }) => cart)
        .catch(() => null)

      if (freshCart?.payment_collection?.id) {
        return freshCart
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        delayMs = Math.min(Math.floor(delayMs * 1.6), 1000)
      }
    }

    return null
  }

  // Check if cart has payment collection
  if (!cart.payment_collection) {
    console.log("[Cart] No payment collection found, creating one...")

    try {
      const paymentCollectionResponse = await sdk.client.fetch(
        `/store/payment-collections`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: {
            cart_id: cart.id,
          },
        }
      )

      console.log(
        "[Cart] Payment collection created:",
        paymentCollectionResponse
      )

      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      // Poll until visible instead of using a fixed sleep.
      const updatedCart = await waitForPaymentCollection(cart.id)
      if (!updatedCart?.payment_collection) {
        throw new Error("Payment collection not available yet")
      }

      cart = updatedCart
      console.log("[Cart] Cart updated with payment collection")
    } catch (error: any) {
      console.error("[Cart] Failed to create payment collection:", error)
      throw new Error(
        "Failed to create payment collection. Please ensure shipping method is selected."
      )
    }
  }

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * Supports filtering by selected items for COD and other payment methods.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @param selectedItemIds - optional - Array of selected item IDs to include in order
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string, selectedItemIds?: string[]) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // If selected items provided, use custom endpoint
    if (selectedItemIds && selectedItemIds.length > 0) {
      console.log("[Cart] Completing cart with selected items:", {
        cart_id: id,
        selected_items: selectedItemIds.length,
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/complete-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            ...headers,
          },
          body: JSON.stringify({
            cart_id: id,
            selected_item_ids: selectedItemIds,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to complete cart")
      }

      const cartRes = await response.json()

      if (cartRes?.type === "order") {
        const countryCode =
          cartRes.order.shipping_address?.country_code?.toLowerCase()

        const orderCacheTag = await getCacheTag("orders")
        revalidateTag(orderCacheTag)

        removeCartId()
        redirect(
          `/${countryCode}/order/confirmed?order_id=${cartRes?.order.id}`
        )
      }

      return cartRes.cart
    }

    // Standard flow without item filtering
    const cartRes = await sdk.store.cart
      .complete(id, {}, headers)
      .then(async (cartRes) => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
        return cartRes
      })

    if (cartRes?.type === "order") {
      const countryCode =
        cartRes.order.shipping_address?.country_code?.toLowerCase()

      const orderCacheTag = await getCacheTag("orders")
      revalidateTag(orderCacheTag)

      removeCartId()
      redirect(`/${countryCode}/order/confirmed?order_id=${cartRes?.order.id}`)
    }

    return cartRes.cart
  } catch (error: any) {
    console.error("[Cart] Order placement failed:", error)

    // If error is related to payment session cleanup (common with Stripe succeeded payments)
    // Log the error but don't throw - let the calling code handle it
    if (
      error.message?.toLowerCase().includes("payment") ||
      error.message?.toLowerCase().includes("session") ||
      error.message?.toLowerCase().includes("cancel") ||
      error.message?.toLowerCase().includes("succeeded")
    ) {
      console.error(
        "[Cart] Payment session cleanup failed - this is expected for succeeded Stripe payments"
      )
      console.error("[Cart] Cart ID:", id)
      console.error("[Cart] Error details:", error.message)

      // Throw a more specific error that the frontend can handle
      throw new Error(
        `ORDER_CREATION_FAILED:${id}:Payment succeeded but order creation failed due to payment session cleanup`
      )
    }

    // For other errors, use the standard error handler
    throw medusaError(error)
  }
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}

/**
 * Create a checkout cart from selected items
 * This creates a new temporary cart containing ONLY the selected items
 * for checkout, ensuring the order only includes selected items.
 *
 * @param cartId - Original cart ID
 * @param selectedLineItemIds - Array of selected line item IDs
 * @returns Checkout cart ID and cart object
 */
export async function createCheckoutCartFromSelection(
  cartId: string,
  selectedLineItemIds: string[]
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/checkout/from-cart-selection`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          ...headers,
        },
        credentials: "include",
        body: JSON.stringify({
          cart_id: cartId,
          selected_line_item_ids: selectedLineItemIds,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create checkout cart")
    }

    const data = await response.json()

    console.log("[Cart] ✅ Checkout cart created:", {
      checkout_cart_id: data.checkout_cart_id,
      items: data.checkout_cart.items?.length,
      total: data.checkout_cart.total,
    })

    return data
  } catch (error: any) {
    console.error("[Cart] Failed to create checkout cart:", error)
    throw error
  }
}
