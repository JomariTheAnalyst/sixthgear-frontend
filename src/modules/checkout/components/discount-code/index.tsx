"use client"

import React, { useState } from "react"
import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  compact?: boolean
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart, compact = false }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [inputValue, setInputValue] = useState("")

  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")
    
    try {
      const validPromotions = promotions.filter(
        (promotion) => promotion.code !== code
      )

      await applyPromotions(
        validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
      )
      setSuccessMessage("Discount removed")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (e: any) {
      setErrorMessage(e.message || "Failed to remove discount")
    } finally {
      setIsLoading(false)
    }
  }

  const addPromotionCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const code = inputValue.trim().toUpperCase()
    if (!code) {
      return
    }

    // Check if code is already applied
    const isAlreadyApplied = promotions.some((p) => p.code === code)
    if (isAlreadyApplied) {
      setSuccessMessage(`Code "${code}" is already active. You're getting the best deal!`)
      setInputValue("")
      setTimeout(() => setSuccessMessage(""), 5000)
      return
    }

    setErrorMessage("")
    setSuccessMessage("")
    setIsLoading(true)

    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code)

    try {
      await applyPromotions(codes)
      setInputValue("")
      setSuccessMessage(`Code "${code}" applied successfully!`)
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (e: any) {
      setErrorMessage(e.message || "Invalid or expired discount code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Input Form */}
      <form onSubmit={addPromotionCode} className="w-full">
        {!compact && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Code
          </label>
        )}
        <p className="text-xs text-gray-500 mb-2">
          Enter a promo code if you have one.
        </p>
        <div className="flex w-full gap-x-2">
          <input
            id="promotion-input"
            name="code"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter code"
            className={`flex-1 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F16D34] focus:border-transparent transition-all ${
              compact ? "h-10" : "h-12"
            }`}
            disabled={isLoading}
            data-testid="discount-input"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`px-5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              compact ? "h-10 text-sm" : "h-12"
            }`}
            data-testid="discount-apply-button"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Applied Promotions */}
      {promotions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Applied Discounts
          </p>
          <div className="space-y-2">
            {promotions.map((promotion) => {
              const discountValue =
                promotion.application_method?.value !== undefined &&
                promotion.application_method.currency_code !== undefined
                  ? promotion.application_method.type === "percentage"
                    ? `${promotion.application_method.value}%`
                    : convertToLocale({
                        amount: +promotion.application_method.value,
                        currency_code:
                          promotion.application_method.currency_code,
                      })
                  : null

              return (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  data-testid="discount-row"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        promotion.is_automatic
                          ? "bg-green-500 text-white"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {promotion.code}
                    </span>
                    {discountValue && (
                      <span className="text-sm text-green-700 font-medium">
                        -{discountValue}
                      </span>
                    )}
                    {promotion.is_automatic && (
                      <span className="text-xs text-green-600">
                        (Auto-applied)
                      </span>
                    )}
                  </div>
                  {!promotion.is_automatic && (
                    <button
                      onClick={() => {
                        if (promotion.code) {
                          removePromotionCode(promotion.code)
                        }
                      }}
                      disabled={isLoading}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      data-testid="remove-discount-button"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="sr-only">Remove discount code</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountCode
