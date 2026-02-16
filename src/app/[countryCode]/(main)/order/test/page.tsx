"use client"

import { useEffect, useState } from "react"

export default function TestOrderPage() {
  const [data, setData] = useState<any>(null)
  const orderId = "order_01KHJMZRFS7EJ1QYECYJQDWFGB" // Latest order

  useEffect(() => {
    fetch(
      `http://localhost:9000/store/orders/${orderId}?fields=*items,*items.variant,*items.product,*shipping_address,*billing_address,*payment_collections,*payment_collections.payment_sessions`,
      {
        credentials: "include",
        headers: {
          "x-publishable-api-key":
            "pk_a8afb55768f5ef3e1c83c7cc8d69185b5314906196df52fea4fca5ce199343a6",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW DATA:", data)
        setData(data)
      })
  }, [])

  if (!data) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Order Data Test</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
