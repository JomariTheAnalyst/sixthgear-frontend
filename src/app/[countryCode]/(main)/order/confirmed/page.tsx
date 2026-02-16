import { Metadata } from "next"
import OrderConfirmedTemplate from "@modules/order/templates/order-confirmed-template"
import CartRefresh from "@modules/order/components/cart-refresh"
import { retrieveOrder } from "@lib/data/orders"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    order_id?: string
  }>
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your order has been successfully placed",
}

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  const orderId = searchParams.order_id

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No order ID provided</p>
      </div>
    )
  }

  // Fetch order data server-side
  const order = await retrieveOrder(orderId).catch(() => null)

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found</p>
      </div>
    )
  }

  return (
    <>
      <CartRefresh />
      <OrderConfirmedTemplate order={order} countryCode={params.countryCode} />
    </>
  )
}
