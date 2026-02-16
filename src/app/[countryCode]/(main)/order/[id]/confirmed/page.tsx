import { Metadata } from "next"
import OrderConfirmedClient from "@modules/order/templates/order-confirmed-client"
import CartRefresh from "@modules/order/components/cart-refresh"

type Props = {
  params: Promise<{ id: string; countryCode: string }>
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your purchase was successful",
}

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params

  return (
    <>
      <CartRefresh />
      <OrderConfirmedClient
        orderId={params.id}
        countryCode={params.countryCode}
      />
    </>
  )
}
