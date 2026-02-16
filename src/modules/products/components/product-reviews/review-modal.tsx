"use client"

import { useState, useEffect } from "react"
import { submitProductReview, checkProductPurchased } from "@lib/data/products"
import { retrieveCustomer } from "@lib/data/customer"
import { X } from "@medusajs/icons"

type ReviewModalProps = {
  productId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const QUICK_TAGS = [
  "Great quality",
  "Value for money",
  "Fast delivery",
  "Highly recommend",
  "Perfect fit",
  "Exceeded expectations",
]

export default function ReviewModal({
  productId,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info"
    text: string
  } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    if (isOpen) {
      checkAuthAndPurchase()
    }
  }, [isOpen, productId])

  const checkAuthAndPurchase = async () => {
    setCheckingAuth(true)
    try {
      const customer = await retrieveCustomer()
      const authenticated = !!customer

      setIsAuthenticated(authenticated)

      if (authenticated) {
        setFirstName(customer.first_name || "")
        setLastName(customer.last_name || "")

        const purchased = await checkProductPurchased(productId)
        setHasPurchased(purchased)
      }
    } catch (error) {
      console.error("Error checking auth/purchase:", error)
      setIsAuthenticated(false)
      setHasPurchased(false)
    } finally {
      setCheckingAuth(false)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setMessage({
        type: "error",
        text: "Please log in to submit a review",
      })
      return
    }

    if (!hasPurchased) {
      setMessage({
        type: "error",
        text: "You must purchase this product before reviewing it",
      })
      return
    }

    setLoading(true)
    setMessage(null)

    // Combine selected tags with custom content
    const reviewContent =
      selectedTags.length > 0
        ? `${selectedTags.join(", ")}. ${content}`.trim()
        : content

    const result = await submitProductReview({
      product_id: productId,
      content: reviewContent,
      rating,
      first_name: firstName,
      last_name: lastName,
    })

    setLoading(false)

    if (result.success) {
      setMessage({ type: "success", text: result.message })
      setContent("")
      setSelectedTags([])
      setRating(5)
      setTimeout(() => {
        onClose()
        onSuccess?.()
      }, 2000)
    } else {
      setMessage({ type: "error", text: result.message })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Write a Review
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {checkingAuth ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Checking eligibility...</p>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please log in to your account to write a review
              </p>
              <a
                href="/login"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Go to Login
              </a>
            </div>
          ) : !hasPurchased ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Purchase Required
              </h3>
              <p className="text-gray-600">
                You need to purchase this product before you can write a review
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl focus:outline-none transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || rating) ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-300">★</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Quick feedback (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your Review
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  placeholder="Share your experience with this product..."
                  minLength={10}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 10 characters
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-4 rounded-md ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : message.type === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
