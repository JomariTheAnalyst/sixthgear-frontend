"use client"

import { HttpTypes } from "@medusajs/types"
import {
  getColorHexForValue,
  isOptionValueAvailable,
} from "@lib/util/variant-helpers"

type ColorSwatchProps = {
  option: HttpTypes.StoreProductOption
  variants: HttpTypes.StoreProductVariant[] | undefined
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  currentSelections: Record<string, string | undefined>
  disabled?: boolean
  inventoryMap?: Record<string, number>
}

export default function ColorSwatch({
  option,
  variants,
  current,
  updateOption,
  currentSelections,
  disabled,
  inventoryMap,
}: ColorSwatchProps) {
  const colorValues = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-semibold text-gray-900">
        {option.title}{" "}
        {current && (
          <span className="font-normal text-gray-500">{current}</span>
        )}
      </span>
      <div
        className="flex flex-wrap gap-3"
        role="radiogroup"
        aria-label={`Select ${option.title}`}
      >
        {colorValues.map((colorValue) => {
          const isSelected = colorValue === current
          const colorHex = getColorHexForValue(variants, option.id, colorValue)
          const isAvailable = isOptionValueAvailable(
            variants,
            option.id,
            colorValue,
            currentSelections,
            inventoryMap
          )

          // Determine if color is light (for border/check visibility)
          const isLightColor = colorHex ? isLightHex(colorHex) : false

          return (
            <button
              key={colorValue}
              type="button"
              onClick={() => updateOption(option.id, colorValue)}
              disabled={disabled}
              className={`
                relative w-10 h-10 rounded-full transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                ${isSelected ? "ring-2 ring-offset-2 ring-gray-900" : ""}
                ${
                  !isAvailable
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:scale-110"
                }
                ${disabled ? "cursor-not-allowed" : ""}
              `}
              style={{
                backgroundColor: colorHex || "#E5E7EB",
              }}
              aria-label={`${colorValue}${
                !isAvailable ? " (unavailable)" : ""
              }`}
              aria-checked={isSelected}
              role="radio"
              title={colorValue}
              data-testid="color-swatch-button"
            >
              {/* Border for light colors */}
              {(isLightColor || !colorHex) && (
                <span
                  className="absolute inset-0 rounded-full border border-gray-300"
                  aria-hidden="true"
                />
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <span
                  className={`
                    absolute inset-0 flex items-center justify-center
                    ${isLightColor ? "text-gray-900" : "text-white"}
                  `}
                  aria-hidden="true"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}

              {/* Unavailable strike-through */}
              {!isAvailable && (
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    className={`
                      w-full h-0.5 rotate-45 
                      ${isLightColor ? "bg-gray-500" : "bg-white/70"}
                    `}
                  />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Fallback: Show color name if no hex available */}
      {colorValues.some(
        (v) => !getColorHexForValue(variants, option.id, v)
      ) && (
        <p className="text-xs text-gray-500">
          Tip: Add color_hex to variant metadata for accurate swatches
        </p>
      )}
    </div>
  )
}

/**
 * Check if a hex color is light (for contrast purposes)
 */
function isLightHex(hex: string): boolean {
  // Remove # if present
  const cleanHex = hex.replace("#", "")

  // Parse RGB
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.6
}
