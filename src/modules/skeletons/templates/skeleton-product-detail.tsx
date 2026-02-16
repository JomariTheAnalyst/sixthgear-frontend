/**
 * Product Detail Page Skeleton
 * Loading state for entire product detail page
 * Mobile, tablet, and desktop responsive
 */

export default function SkeletonProductDetail() {
  return (
    <div className="bg-white pt-28 animate-pulse">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8 lg:py-12">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery Skeleton */}
          <div className="order-1">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-gray-200 rounded mb-4" />

            {/* Thumbnails */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          {/* Right Column - Product Info Skeleton */}
          <div className="order-2 flex flex-col gap-y-6">
            {/* Brand */}
            <div className="h-4 w-24 bg-gray-200 rounded" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-gray-200 rounded" />
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>

            {/* Price */}
            <div className="h-10 w-32 bg-gray-200 rounded" />

            {/* Variant Options */}
            <div className="space-y-4">
              <div className="h-6 w-20 bg-gray-200 rounded" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 bg-gray-200 rounded" />
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4">
              <div className="w-36 h-12 bg-gray-200 rounded" />
              <div className="flex-1 h-12 bg-gray-200 rounded" />
            </div>

            {/* Secured Checkout */}
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto" />

            {/* Trust Badges */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded p-4 h-14 bg-gray-50"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="space-y-4">
              <div className="h-16 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                    <div className="flex-1 h-2 bg-gray-200 rounded" />
                    <div className="h-4 w-8 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="md:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-gray-200 rounded" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="h-8 w-64 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
