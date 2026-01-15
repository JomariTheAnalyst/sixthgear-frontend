"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [openTab, setOpenTab] = useState<string | null>(null)

  const toggleTab = (tabId: string) => {
    setOpenTab(openTab === tabId ? null : tabId)
  }

  const tabs = [
    {
      id: "details",
      label: "Details",
      content: <ProductInfoTab product={product} />,
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      content: <ShippingInfoTab />,
    },
    {
      id: "authenticity",
      label: "Authenticity",
      content: <AuthenticityTab />,
    },
  ]

  return (
    <div className="flex flex-col divide-y divide-gray-200 border-t border-gray-200">
      {tabs.map((tab) => (
        <div key={tab.id}>
          <button
            onClick={() => toggleTab(tab.id)}
            className="w-full py-4 flex items-center justify-between text-left group"
          >
            <span className="text-sm font-bold uppercase tracking-wide text-gray-900 group-hover:text-[#F16D34] transition-colors">
              {tab.label}
            </span>
            <span className="text-gray-400 text-xl font-light">
              {openTab === tab.id ? "−" : "+"}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openTab === tab.id ? "max-h-[500px] pb-6" : "max-h-0"
            }`}
          >
            {tab.content}
          </div>
        </div>
      ))}
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-sm text-gray-600 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {product.material && (
          <div>
            <span className="font-semibold text-gray-900 block">Material</span>
            <span>{product.material}</span>
          </div>
        )}
        {product.origin_country && (
          <div>
            <span className="font-semibold text-gray-900 block">Country of Origin</span>
            <span>{product.origin_country}</span>
          </div>
        )}
        {product.type && (
          <div>
            <span className="font-semibold text-gray-900 block">Type</span>
            <span>{product.type.value}</span>
          </div>
        )}
        {product.weight && (
          <div>
            <span className="font-semibold text-gray-900 block">Weight</span>
            <span>{product.weight} g</span>
          </div>
        )}
        {product.length && product.width && product.height && (
          <div>
            <span className="font-semibold text-gray-900 block">Dimensions</span>
            <span>{product.length}L x {product.width}W x {product.height}H</span>
          </div>
        )}
      </div>
      {!product.material && !product.origin_country && !product.type && !product.weight && (
        <p className="text-gray-400 italic">No additional product details available.</p>
      )}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-sm text-gray-600 space-y-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-[#F16D34] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <div>
          <span className="font-semibold text-gray-900 block">Fast Delivery</span>
          <p>Your package will arrive in 3-5 business days at your pick up location or in the comfort of your home.</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-[#F16D34] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <div>
          <span className="font-semibold text-gray-900 block">Simple Exchanges</span>
          <p>Is the fit not quite right? No worries - we&apos;ll exchange your product for a new one.</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-[#F16D34] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        <div>
          <span className="font-semibold text-gray-900 block">Easy Returns</span>
          <p>Just return your product and we&apos;ll refund your money. No questions asked – we&apos;ll do our best to make sure your return is hassle-free.</p>
        </div>
      </div>
    </div>
  )
}

const AuthenticityTab = () => {
  return (
    <div className="text-sm text-gray-600 space-y-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-[#F16D34] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <span className="font-semibold text-gray-900 block">100% Authentic</span>
          <p>All products sold are guaranteed authentic. We source directly from authorized distributors and manufacturers.</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-[#F16D34] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <span className="font-semibold text-gray-900 block">Quality Guaranteed</span>
          <p>Every item undergoes quality checks before shipping to ensure you receive products in perfect condition.</p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
