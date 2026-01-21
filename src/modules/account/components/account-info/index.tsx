"use client"

import { Disclosure } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import { useEffect } from "react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div
      className="bg-white rounded-lg border border-gray-200/60 overflow-hidden"
      data-testid={dataTestid}
    >
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {label}
          </p>
          <div className="text-gray-900 font-medium text-base leading-relaxed" data-testid="current-info">
            {typeof currentInfo === "string" ? (
              <span>{currentInfo}</span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <button
          type={state ? "reset" : "button"}
          onClick={handleToggle}
          className={clx(
            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            state
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          )}
          data-testid="edit-button"
          data-active={state}
        >
          {state ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Success Message */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-all duration-300 ease-in-out overflow-hidden",
            {
              "max-h-20 opacity-100": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
          data-testid="success-message"
        >
          <div className="px-6 pb-5">
            <div className="flex items-center gap-2 text-green-700 bg-green-50/50 px-3 py-2 rounded-md border border-green-100">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                {label} updated successfully
              </span>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error Message */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-all duration-300 ease-in-out overflow-hidden",
            {
              "max-h-20 opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
          data-testid="error-message"
        >
          <div className="px-6 pb-5">
            <div className="flex items-center gap-2 text-red-700 bg-red-50/50 px-3 py-2 rounded-md border border-red-100">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Edit Form */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-all duration-300 ease-in-out overflow-visible",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0": !state,
            }
          )}
        >
          <div className="px-6 pb-6 border-t border-gray-100/60 pt-6">
            <div className="space-y-6">
              {children}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={pending}
                  className={clx(
                    "px-6 py-2.5 rounded-md text-sm font-medium transition-all shadow-sm",
                    "bg-gray-900 text-white hover:bg-gray-800",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center gap-2"
                  )}
                  data-testid="save-button"
                >
                  {pending && (
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
