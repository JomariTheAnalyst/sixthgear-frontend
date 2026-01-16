"use client"

import { HttpTypes } from "@medusajs/types"
import { isOptionValueAvailable } from "@lib/util/variant-helpers"

type GenericOptionSelectorProps = {
  option: HttpTypes.StoreProductOption
  variants: HttpTypes.StoreProductVariant[] | undefined
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  currentSelections: Record<string, string | undefined>
  disabled?: boolean
}

export default function GenericOptionSelector({
  option,
  variants,
  current,
  updateOption,
  currentSelections,
  disabled,
}: GenericOptionSelectorProps) {
  const optionValues = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-semibold text-gray-900">
        {option.title}{" "}
        {current && (
          <span className="font-normal text-gray-500">{current}</span>
        )}
      </span>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={`Select ${option.title}`}
      >
        {optionValues.map((value) => {
          const isSelected = value === current
          const isAvailable = isOptionValueAvailable(
            variants,
            option.id,
            value,
            currentSelections
          )

          return (
            <button
              key={value}
              type="button"
              onClick={() => updateOption(option.id, value)}
              disabled={disabled || !isAvailable}
              className={`
                min-w-[60px] px-4 py-3 text-sm font-semibold border rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-900
                ${
                  isSelected
                    ? "bg-gray-900 text-white border-gray-900"
                    : isAvailable
                    ? "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                }
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
              `}
              aria-label={`${value}${!isAvailable ? " (unavailable)" : ""}`}
              aria-checked={isSelected}
              role="radio"
              data-testid="option-button"
            >
              {value}
            </button>
          )
        })}
      </div>
    </div>
  )
}
