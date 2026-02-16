"use client"

import { useState, useMemo } from "react"
import ReviewModal from "./review-modal"

type Review = {
  id: string
  title?: string
  content: string
  rating: number
  first_name: string
  last_name: string
  created_at: string
}

type ProductReviewsProps = {
  productId: string
  reviews: Review[]
  count: number
  averageRating: number
}

export default function ProductReviews({
  productId,
  reviews,
  count,
  averageRating,
}: ProductReviewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++
      }
    })
    return distribution
  }, [reviews])

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-[#F16D34] fill-current" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <>
      <div id="reviews">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Reviews & Ratings
        </h2>

        {count > 0 ? (
          <>
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left: Rating Summary */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-start">
                  <div className="text-6xl font-bold text-gray-900 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="mb-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on {count} review{count !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const starCount =
                      ratingDistribution[star as 1 | 2 | 3 | 4 | 5]
                    const percentage =
                      count > 0 ? Math.round((starCount / count) * 100) : 0

                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 w-12">
                          {star} star
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#F16D34] transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-10 text-right">
                          {percentage}%
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Write Review Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 w-full px-6 py-3 border border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors font-medium text-sm"
                >
                  Write a Review
                </button>
              </div>

              {/* Right: Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    {/* Review Header - Stars and Date on same row */}
                    <div className="flex items-center justify-between mb-3">
                      {renderStars(review.rating)}
                      <div className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    {/* Review Title (if exists) */}
                    {review.title && (
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">
                        {review.title}
                      </h3>
                    )}

                    {/* Review Content */}
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {review.content}
                    </p>

                    {/* Reviewer Name */}
                    <div className="text-sm font-semibold text-gray-900">
                      {review.first_name} {review.last_name.charAt(0)}.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Be the first to write a review
            </h3>
            <p className="text-gray-600 mb-6">
              Share your experience with this product
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium"
            >
              Write a review
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        productId={productId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          window.location.reload()
        }}
      />
    </>
  )
}
