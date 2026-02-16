"use client"

import { useState } from "react"

interface InvoiceDownloadProps {
  orderId: string
}

/**
 * Invoice Download Component
 *
 * Handles invoice download for orders
 */
export default function InvoiceDownload({ orderId }: InvoiceDownloadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    try {
      setLoading(true)
      setError(null)

      // Sanitize order ID - remove any whitespace/newlines and encode
      const cleanOrderId = orderId.trim()
      console.log(
        "[Invoice Download] Starting download for order:",
        cleanOrderId
      )
      console.log("[Invoice Download] Raw order ID:", JSON.stringify(orderId))

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
        }/store/orders/${encodeURIComponent(cleanOrderId)}/invoice/download`,
        {
          credentials: "include",
          headers: {
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      )

      console.log("[Invoice Download] Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[Invoice Download] Error response:", errorText)
        throw new Error(`Failed to download invoice: ${response.status}`)
      }

      // Get the PDF URL from redirect or response
      const blob = await response.blob()
      console.log("[Invoice Download] Blob size:", blob.size)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log("[Invoice Download] Download completed successfully")
    } catch (err: any) {
      console.error("[Invoice Download] Error:", err)
      setError("Failed to download invoice. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Invoice
          </>
        )}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
