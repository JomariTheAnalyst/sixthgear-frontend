import { redirect } from "next/navigation"
import { Metadata } from "next"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ session_id?: string }>
}

export const metadata: Metadata = {
  title: "Payment Processing",
  description: "Processing your payment",
}

/**
 * Stripe Checkout Success Page
 *
 * Handles the redirect from Stripe Checkout after successful payment
 * Creates order in Medusa and redirects to thank you page
 *
 * @see https://stripe.com/docs/payments/checkout/how-checkout-works
 */
export default async function CheckoutSuccessPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { session_id } = searchParams

  console.log("[Checkout Success] ===== PROCESSING PAYMENT SUCCESS =====")

  if (!session_id) {
    console.error("[Checkout Success] ❌ No session_id provided")
    redirect(`/${params.countryCode}/checkout`)
  }

  console.log("[Checkout Success] Session ID:", session_id)

  // Create order from Stripe payment
  try {
    // Get cart ID from Stripe session
    console.log("[Checkout Success] Fetching Stripe session...")
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_API_KEY}`,
        },
      }
    )

    if (!stripeResponse.ok) {
      console.error(
        "[Checkout Success] ❌ Failed to fetch Stripe session:",
        stripeResponse.status
      )
      throw new Error("Failed to fetch Stripe session")
    }

    const session = await stripeResponse.json()
    console.log("[Checkout Success] Stripe session:", {
      id: session.id,
      payment_status: session.payment_status,
      cart_id: session.metadata?.cart_id,
    })

    const cartId = session.metadata?.cart_id

    if (!cartId) {
      console.error("[Checkout Success] ❌ No cart_id in session metadata")
      redirect(
        `/${params.countryCode}/order/confirmed?session_id=${session_id}`
      )
    }

    console.log("[Checkout Success] Creating order for cart:", cartId)

    // Create order from cart
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
      process.env.MEDUSA_BACKEND_URL
    const orderResponse = await fetch(
      `${backendUrl}/store/orders/create-from-stripe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          cart_id: cartId,
          stripe_session_id: session_id,
        }),
      }
    )

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error("[Checkout Success] ❌ Failed to create order:", {
        status: orderResponse.status,
        error: errorData,
      })
      // Still redirect to thank you page even if order creation fails
      redirect(
        `/${params.countryCode}/order/confirmed?session_id=${session_id}&cart_id=${cartId}`
      )
    }

    const { order_id, order } = await orderResponse.json()
    console.log(
      "[Checkout Success] ✅✅✅ Order created successfully:",
      order_id
    )
    console.log("[Checkout Success] Order details:", {
      id: order_id,
      email: order?.email,
      total: order?.total,
    })

    // Clear cart cookie since order is complete
    console.log("[Checkout Success] Clearing cart cookie...")
    const { removeCartId } = await import("@lib/data/cookies")
    await removeCartId()

    // Revalidate cart cache to force refresh
    const { revalidateTag } = await import("next/cache")
    revalidateTag("carts")
    console.log(
      "[Checkout Success] ✅ Cart cookie cleared and cache revalidated"
    )

    // Redirect to order confirmation with order ID
    redirect(
      `/${params.countryCode}/order/confirmed?session_id=${session_id}&order_id=${order_id}`
    )
  } catch (error: any) {
    console.error("[Checkout Success] ❌ Error:", error.message)
    console.error("[Checkout Success] Stack:", error.stack)
    // Fallback: redirect to generic thank you page
    redirect(`/${params.countryCode}/order/confirmed?session_id=${session_id}`)
  }
}
