"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface TermsSectionProps {
  agreed: boolean
  onAgreeChange: (agreed: boolean) => void
}

/**
 * Terms & Conditions Section Component
 *
 * Checkbox for agreeing to terms, privacy policy, and refund policy
 * Required before order can be placed
 */
const TermsSection = ({ agreed, onAgreeChange }: TermsSectionProps) => {
  return (
    <div className="space-y-3">
      {/* Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreeChange(e.target.checked)}
          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#F16D34] focus:ring-[#F16D34] focus:ring-offset-0 transition-colors cursor-pointer"
        />
        <span className="text-sm text-gray-700 leading-relaxed">
          I agree to Sixthgear's{" "}
          <LocalizedClientLink
            href="/terms"
            className="font-medium text-[#F16D34] hover:underline"
            target="_blank"
          >
            Terms of Service
          </LocalizedClientLink>
          ,{" "}
          <LocalizedClientLink
            href="/privacy"
            className="font-medium text-[#F16D34] hover:underline"
            target="_blank"
          >
            Privacy Policy
          </LocalizedClientLink>
          , and{" "}
          <LocalizedClientLink
            href="/refund-policy"
            className="font-medium text-[#F16D34] hover:underline"
            target="_blank"
          >
            Refund Policy
          </LocalizedClientLink>
          .
        </span>
      </label>

      {/* Helper Text */}
      {!agreed && (
        <p className="text-xs text-gray-500 pl-8">
          You must agree to the terms and policies to complete your order.
        </p>
      )}
    </div>
  )
}

export default TermsSection
