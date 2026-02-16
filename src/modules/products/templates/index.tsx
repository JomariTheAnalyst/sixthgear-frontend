import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductReviews from "@modules/products/components/product-reviews"
import YouMayLike from "@modules/products/components/you-may-like"
import ProductInfo from "@modules/products/templates/product-info"
import Breadcrumb from "@modules/products/components/breadcrumb"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { getProductReviews } from "@lib/data/products"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Fetch reviews
  const reviewData = await getProductReviews(product.id)

  return (
    <>
      {/* Main Product Section */}
      <div className="bg-white pt-28">
        <div
          className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12"
          data-testid="product-container"
        >
          {/* Breadcrumb Navigation */}
          <Breadcrumb product={product} />

          {/* Two Column Layout: Images Left, Info Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mt-6">
            {/* Left Column - Product Images */}
            <div className="order-1">
              <div className="lg:sticky lg:top-32">
                <ImageGallery images={images} />
              </div>
            </div>

            {/* Right Column - Product Info & Actions */}
            <div className="order-2 flex flex-col gap-y-6">
              {/* Top Section: Title with Stock Badge on Right */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1
                    className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight"
                    data-testid="product-title"
                    style={{ fontFamily: "BRHendrix, sans-serif" }}
                  >
                    {product.title}
                  </h1>
                </div>

                {/* Stock Badge on Right */}
                <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded">
                  In Stock
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              )}

              {/* Star Rating with Review Count Link */}
              <div className="flex items-center gap-2 pb-6 border-b border-gray-200">
                <ProductInfo
                  product={product}
                  averageRating={reviewData?.average_rating}
                  reviewCount={reviewData?.count}
                />
              </div>

              {/* Variant Selection & Add to Cart */}
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>

              {/* Collapsible Information Sections */}
              <div className="mt-6">
                <ProductTabs product={product} />
              </div>

              {/* Onboarding CTA (if applicable) */}
              <ProductOnboardingCta />
            </div>
          </div>

          {/* Product Reviews Section */}
          {reviewData && reviewData.count > 0 && (
            <div className="mt-12 md:mt-16 border-t border-gray-200 pt-8 md:pt-12">
              <ProductReviews
                productId={product.id}
                reviews={reviewData.reviews}
                count={reviewData.count}
                averageRating={reviewData.average_rating}
              />
            </div>
          )}

          {/* You May Like Section - Meilisearch Powered */}
          <div className="mt-12 md:mt-16 border-t border-gray-200 pt-8 md:pt-12">
            <Suspense
              fallback={
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-200 aspect-square rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              }
            >
              <YouMayLike
                productId={product.id}
                countryCode={countryCode}
                region={region}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

// Trust Badge Component - Enhanced
const TrustBadge = ({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) => (
  <div className="flex flex-col items-center text-center gap-1.5 md:gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="text-gray-400 hover:text-[#F16D34] transition-colors">
      {icon}
    </div>
    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-600 leading-tight">
      {label}
    </span>
  </div>
)

export default ProductTemplate
