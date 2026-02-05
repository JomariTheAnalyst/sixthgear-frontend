"use client"

import { CheckCircleSolid } from "@medusajs/icons"

interface CheckoutProgressProps {
  currentStep: "contact" | "shipping" | "delivery" | "payment"
  completedSteps: Set<string>
}

const steps = [
  { id: "contact", label: "Contact", number: 1 },
  { id: "shipping", label: "Shipping", number: 2 },
  { id: "delivery", label: "Delivery", number: 3 },
  { id: "payment", label: "Payment", number: 4 },
]

/**
 * Checkout Progress Indicator
 *
 * Visual progress bar showing checkout steps with completion status
 */
const CheckoutProgress = ({
  currentStep,
  completedSteps,
}: CheckoutProgressProps) => {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="w-full py-6">
      {/* Mobile: Simple dots */}
      <div className="md:hidden flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = step.id === currentStep
          const isPast = index < currentStepIndex

          return (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all ${
                isCompleted || isPast
                  ? "w-8 bg-green-500"
                  : isCurrent
                  ? "w-8 bg-[#F16D34]"
                  : "w-2 bg-gray-300"
              }`}
            />
          )
        })}
      </div>

      {/* Desktop: Full progress bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id)
            const isCurrent = step.id === currentStep
            const isPast = index < currentStepIndex
            const isActive = isCompleted || isCurrent || isPast

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isCompleted || isPast
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-[#F16D34] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted || isPast ? (
                      <CheckCircleSolid className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 -mt-6">
                    <div
                      className={`h-full rounded transition-all ${
                        isPast || isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CheckoutProgress
