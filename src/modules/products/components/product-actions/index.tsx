"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import { useCartDrawer } from "@lib/context/cart-drawer-context"
import { isColorOption, isSizeOption } from "@lib/util/variant-helpers"
import ColorSwatch from "./color-swatch"
import SizeSelector from "./size-selector"
import GenericOptionSelector from "./generic-option-selector"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    if (selectedVariant?.allow_backorder) {
      return true
    }

    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")
  const { openCart } = useCartDrawer()

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })

    setIsAdding(false)
    openCart()
  }

  // Quantity handlers
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    const maxQty = selectedVariant?.inventory_quantity || 99
    if (quantity < maxQty) setQuantity(quantity + 1)
  }

  // Render the appropriate selector based on option type
  const renderOptionSelector = (option: HttpTypes.StoreProductOption) => {
    const commonProps = {
      option,
      variants: product.variants,
      current: options[option.id],
      updateOption: setOptionValue,
      currentSelections: options,
      disabled: disabled || isAdding,
    }

    if (isColorOption(option)) {
      return <ColorSwatch key={option.id} {...commonProps} />
    }

    if (isSizeOption(option)) {
      return <SizeSelector key={option.id} {...commonProps} />
    }

    return <GenericOptionSelector key={option.id} {...commonProps} />
  }

  return (
    <>
      <div className="flex flex-col gap-y-6" ref={actionsRef}>
        {/* Price Section */}
        <ProductPrice product={product} variant={selectedVariant} />

        {/* Variant Options */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-5">
            {(product.options || []).map((option) =>
              renderOptionSelector(option)
            )}
          </div>
        )}

        {/* Selected Options Summary */}
        {Object.keys(options).length > 0 && (
          <div className="text-sm text-gray-600">
            Selected:{" "}
            <span className="font-medium text-gray-900">
              {Object.values(options).filter(Boolean).join(" • ")}
            </span>
          </div>
        )}

        {/* Quantity & Add to Cart Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || disabled || isAdding}
              className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="w-12 h-12 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-300">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              disabled={disabled || isAdding}
              className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            className={`
              flex-1 h-12 px-8 text-sm font-bold uppercase tracking-wider transition-all duration-200
              flex items-center justify-center gap-2
              ${
                !inStock || !selectedVariant || !isValidVariant
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-[#F16D34]"
              }
            `}
            data-testid="add-product-button"
          >
            {isAdding ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <>
                {!selectedVariant && !options
                  ? "Select variant"
                  : !inStock || !isValidVariant
                  ? "Out of stock"
                  : "Add to Cart"}
                {inStock && selectedVariant && isValidVariant && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                )}
              </>
            )}
          </button>
        </div>

        {/* Secured Checkout Text */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">100% Secured Checkout</span>
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
