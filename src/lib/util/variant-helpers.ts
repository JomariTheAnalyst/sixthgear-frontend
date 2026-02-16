import { HttpTypes } from "@medusajs/types"

/**
 * Common color name to hex mapping for fallback
 * Used when variant metadata doesn't have color_hex
 */
export const COLOR_NAME_TO_HEX: Record<string, string> = {
  // Basic colors
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#22C55E",
  yellow: "#EAB308",
  orange: "#F97316",
  purple: "#A855F7",
  pink: "#EC4899",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#6B7280",
  grey: "#6B7280",
  brown: "#92400E",
  navy: "#1E3A5A",
  beige: "#D4C4A8",
  cream: "#FFFDD0",
  gold: "#D4AF37",
  silver: "#C0C0C0",
  // Extended colors
  maroon: "#800000",
  olive: "#808000",
  teal: "#008080",
  aqua: "#00FFFF",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  lime: "#00FF00",
  indigo: "#4B0082",
  violet: "#8B00FF",
  coral: "#FF7F50",
  salmon: "#FA8072",
  khaki: "#C3B091",
  tan: "#D2B48C",
  burgundy: "#800020",
  charcoal: "#36454F",
  slate: "#708090",
  ivory: "#FFFFF0",
  mint: "#98FF98",
  lavender: "#E6E6FA",
  turquoise: "#40E0D0",
  // Motorcycle/auto specific
  matte: "#2D2D2D",
  "matte black": "#1A1A1A",
  "gloss black": "#0A0A0A",
  chrome: "#E8E8E8",
  carbon: "#1C1C1C",
  titanium: "#878681",
  gunmetal: "#2C3539",
  racing: "#FF0000",
  "racing red": "#FF0000",
  "racing blue": "#0000FF",
  neon: "#39FF14",
  "hi-vis": "#FFFF00",
  "high visibility": "#FFFF00",
  fluorescent: "#CCFF00",
}

/**
 * Find option by title (case-insensitive)
 */
export function findOptionByTitle(
  options: HttpTypes.StoreProductOption[] | undefined,
  title: string
): HttpTypes.StoreProductOption | undefined {
  if (!options) return undefined
  const lowerTitle = title.toLowerCase()
  return options.find((o) => o.title?.toLowerCase() === lowerTitle)
}

/**
 * Check if an option is a color option
 */
export function isColorOption(option: HttpTypes.StoreProductOption): boolean {
  const title = option.title?.toLowerCase() || ""
  return title === "color" || title === "colour" || title.includes("color")
}

/**
 * Check if an option is a size option
 */
export function isSizeOption(option: HttpTypes.StoreProductOption): boolean {
  const title = option.title?.toLowerCase() || ""
  return title === "size" || title.includes("size")
}

/**
 * Get unique option values from variants
 */
export function getUniqueOptionValues(
  variants: HttpTypes.StoreProductVariant[] | undefined,
  optionId: string
): string[] {
  if (!variants) return []

  const values = new Set<string>()
  variants.forEach((variant) => {
    const opt = variant.options?.find((o: any) => o.option_id === optionId)
    if (opt?.value) {
      values.add(opt.value)
    }
  })

  return Array.from(values)
}

/**
 * Get color hex from variant metadata or fallback to color name mapping
 */
export function getColorHex(
  variant: HttpTypes.StoreProductVariant | undefined,
  colorValue: string
): string | null {
  // First try to get from variant metadata
  const metadata = variant?.metadata as Record<string, any> | undefined
  if (metadata?.color_hex) {
    return metadata.color_hex as string
  }

  // Fallback: try to match color name
  const normalizedColor = colorValue.toLowerCase().trim()

  // Direct match
  if (COLOR_NAME_TO_HEX[normalizedColor]) {
    return COLOR_NAME_TO_HEX[normalizedColor]
  }

  // Partial match (e.g., "Matte Black" contains "black")
  for (const [colorName, hex] of Object.entries(COLOR_NAME_TO_HEX)) {
    if (
      normalizedColor.includes(colorName) ||
      colorName.includes(normalizedColor)
    ) {
      return hex
    }
  }

  return null
}

/**
 * Get color hex for a specific color value from all variants
 * Searches through variants to find one with matching color and extract hex
 */
export function getColorHexForValue(
  variants: HttpTypes.StoreProductVariant[] | undefined,
  colorOptionId: string,
  colorValue: string
): string | null {
  if (!variants) return null

  // Find a variant with this color value
  const matchingVariant = variants.find((v) => {
    const colorOpt = v.options?.find((o: any) => o.option_id === colorOptionId)
    return colorOpt?.value === colorValue
  })

  return getColorHex(matchingVariant, colorValue)
}

/**
 * Check if a variant combination is available (in stock)
 */
export function isVariantAvailable(
  variant: HttpTypes.StoreProductVariant | undefined,
  inventoryMap?: Record<string, number>
): boolean {
  if (!variant) return false

  // If we have inventory data from custom endpoint, use it
  if (inventoryMap && variant.id in inventoryMap) {
    const quantity = inventoryMap[variant.id]
    return quantity > 0
  }

  // Fallback to variant properties
  if (!variant.manage_inventory) return true
  if (variant.allow_backorder) return true

  // Check inventory_quantity (may be null in Medusa v2)
  return (variant.inventory_quantity || 0) > 0
}

/**
 * Find variant by selected options
 */
export function findVariantByOptions(
  variants: HttpTypes.StoreProductVariant[] | undefined,
  selectedOptions: Record<string, string | undefined>
): HttpTypes.StoreProductVariant | undefined {
  if (!variants) return undefined

  return variants.find((v) => {
    const variantOptions = v.options?.reduce(
      (acc: Record<string, string>, opt: any) => {
        acc[opt.option_id] = opt.value
        return acc
      },
      {}
    )

    return Object.entries(selectedOptions).every(
      ([optionId, value]) => variantOptions?.[optionId] === value
    )
  })
}

/**
 * Check if a specific option value is available given current selections
 */
export function isOptionValueAvailable(
  variants: HttpTypes.StoreProductVariant[] | undefined,
  optionId: string,
  value: string,
  currentSelections: Record<string, string | undefined>,
  inventoryMap?: Record<string, number>
): boolean {
  if (!variants) return false

  // Find variants that match this option value and all other current selections
  return variants.some((v) => {
    const variantOptions = v.options?.reduce(
      (acc: Record<string, string>, opt: any) => {
        acc[opt.option_id] = opt.value
        return acc
      },
      {}
    )

    if (!variantOptions) return false

    // Check if this variant has the target option value
    if (variantOptions[optionId] !== value) return false

    // Check if this variant matches all other current selections
    for (const [selOptId, selValue] of Object.entries(currentSelections)) {
      if (
        selOptId !== optionId &&
        selValue &&
        variantOptions[selOptId] !== selValue
      ) {
        return false
      }
    }

    // Check if variant is in stock
    return isVariantAvailable(v, inventoryMap)
  })
}
