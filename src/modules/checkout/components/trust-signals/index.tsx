"use client"

import { ShieldCheck, CreditCard, ArrowUturnLeft, Users } from "@medusajs/icons"

interface TrustSignalsProps {
  variant?: "compact" | "full"
  className?: string
}

/**
 * Trust Signals Component
 *
 * Displays security badges, payment logos, guarantees, and social proof
 * to build trust and reduce checkout anxiety
 */
const TrustSignals = ({
  variant = "full",
  className = "",
}: TrustSignalsProps) => {
  if (variant === "compact") {
    return (
      <div
        className={`flex items-center justify-center gap-4 text-xs text-gray-500 ${className}`}
      >
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowUturnLeft className="w-4 h-4 text-blue-600" />
          <span>30-Day Returns</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Security Badge */}
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-900">
            Secure Checkout
          </p>
          <p className="text-xs text-green-700">256-bit SSL encryption</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <p className="text-sm font-medium text-gray-900">We Accept</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700">
            VISA
          </div>
          <div className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700">
            Mastercard
          </div>
          <div className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700">
            AMEX
          </div>
          <div className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700">
            Discover
          </div>
        </div>
      </div>

      {/* Money-Back Guarantee */}
      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <ArrowUturnLeft className="w-6 h-6 text-blue-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">30-Day Returns</p>
          <p className="text-xs text-blue-700">Money-back guarantee</p>
        </div>
      </div>

      {/* Social Proof */}
      <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <Users className="w-6 h-6 text-[#F16D34] flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Join 50,000+ Customers
          </p>
          <p className="text-xs text-gray-600">
            Trusted by coffee lovers worldwide
          </p>
        </div>
      </div>
    </div>
  )
}

export default TrustSignals
