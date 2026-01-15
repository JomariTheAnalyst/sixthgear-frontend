import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      {/* Main Product Section */}
      <div className="bg-white pt-28">
        <div
          className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8 lg:py-12"
          data-testid="product-container"
        >
          {/* Two Column Layout: Images Left, Info Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Product Images */}
            <div className="order-1">
              <div className="sticky top-32">
                <ImageGallery images={images} />
              </div>
            </div>

            {/* Right Column - Product Info & Actions */}
            <div className="order-2 flex flex-col gap-y-6">
              {/* Product Info (Brand, Title) */}
              <ProductInfo product={product} />

              {/* Product Actions (Price, Variants, Add to Cart) */}
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

              {/* Trust Badges */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TrustBadge
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    }
                    label="Fully Authentic"
                  />
                  <TrustBadge
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    }
                    label="New & Unused"
                  />
                  <TrustBadge
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    }
                    label="Easy Returns"
                  />
                  <TrustBadge
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    label="No Hidden Fees"
                  />
                </div>
              </div>

              {/* Product Description & Tabs (Accordions) */}
              <div className="border-t border-gray-200 pt-6">
                {/* Description Section */}
                {product.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Product Tabs (Details, Shipping, etc.) */}
                <ProductTabs product={product} />
              </div>

              {/* Onboarding CTA (if applicable) */}
              <ProductOnboardingCta />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div
        className="bg-gray-50 py-16"
        data-testid="related-products-container"
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900 uppercase mb-8"
            style={{ fontFamily: "BRHendrix, sans-serif" }}
          >
            Perfectly Pair With
          </h2>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

// Trust Badge Component
const TrustBadge = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center text-center gap-2">
    <div className="text-gray-400">{icon}</div>
    <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
      {label}
    </span>
  </div>
)

export default ProductTemplate
