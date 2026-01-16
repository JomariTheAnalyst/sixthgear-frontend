"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"
import { isColorOption, isSizeOption } from "@lib/util/variant-helpers"
import ColorSwatch from "./color-swatch"
import SizeSelector from "./size-selector"
import GenericOptionSelector from "./generic-option-selector"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (optionId: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  // Render the appropriate selector based on option type
  const renderOptionSelector = (option: HttpTypes.StoreProductOption) => {
    const commonProps = {
      option,
      variants: product.variants,
      current: options[option.id],
      updateOption: updateOptions,
      currentSelections: options,
      disabled: optionsDisabled,
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
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-white flex flex-col gap-y-3 justify-center items-center text-large-regular p-4 h-full w-full border-t border-gray-200 shadow-lg"
            data-testid="mobile-actions"
          >
            <div className="flex items-center gap-x-2">
              <span className="font-medium" data-testid="mobile-title">
                {product.title}
              </span>
              <span>—</span>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2 text-ui-fg-base">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-small-regular text-gray-400">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx("font-semibold", {
                      "text-red-600": selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div
              className={clx("grid grid-cols-2 w-full gap-x-4", {
                "!grid-cols-1": isSimple,
              })}
            >
              {!isSimple && (
                <Button
                  onClick={open}
                  variant="secondary"
                  className="w-full"
                  data-testid="mobile-actions-button"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>
                      {variant
                        ? Object.values(options).filter(Boolean).join(" / ")
                        : "Select Options"}
                    </span>
                    <ChevronDown />
                  </div>
                </Button>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !variant}
                className="w-full bg-gray-900 hover:bg-[#F16D34]"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!variant
                  ? "Select variant"
                  : !inStock
                  ? "Out of stock"
                  : "Add to cart"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>

      {/* Options Modal */}
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center shadow-lg"
                      data-testid="close-modal-button"
                      aria-label="Close options"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-8 rounded-t-2xl max-h-[70vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Select Options
                    </h3>
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) =>
                          renderOptionSelector(option)
                        )}
                      </div>
                    )}

                    {/* Selected summary */}
                    {Object.values(options).some(Boolean) && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Selected:{" "}
                          <span className="font-medium text-gray-900">
                            {Object.values(options).filter(Boolean).join(" • ")}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Done button */}
                    <div className="mt-6">
                      <Button
                        onClick={close}
                        className="w-full bg-gray-900 hover:bg-[#F16D34]"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
