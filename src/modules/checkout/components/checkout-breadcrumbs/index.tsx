"use client"

import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

type CheckoutBreadcrumbsProps = {
  cart: HttpTypes.StoreCart
}

const CheckoutBreadcrumbs = ({ cart }: CheckoutBreadcrumbsProps) => {
  const searchParams = useSearchParams()
  const currentStep = searchParams.get("step") || "address"

  const steps = [
    {
      id: "address",
      label: "Information",
      completed: !!cart.shipping_address,
    },
    {
      id: "delivery",
      label: "Shipping",
      completed: (cart.shipping_methods?.length ?? 0) > 0,
    },
    {
      id: "payment",
      label: "Payment",
      completed: !!cart.payment_collection?.payment_sessions?.find(
        (ps: any) => ps.status === "pending"
      ),
    },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="mb-8">
      <nav aria-label="Checkout progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = step.completed
            const isPast = index < currentStepIndex
            const isAccessible = isPast || isActive

            return (
              <li
                key={step.id}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex items-center gap-3">
                  {/* Step Circle */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                      isCompleted || isPast
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-[#F16D34] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted || isPast ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      isActive
                        ? "text-gray-900"
                        : isCompleted || isPast
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-colors ${
                      isCompleted || isPast ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export default CheckoutBreadcrumbs
