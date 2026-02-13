import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Scheduled Maintenance | SixthGear",
  description:
    "We're currently performing maintenance to improve your experience.",
  robots: "noindex, nofollow",
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        {/* Simple Icon */}
        <div className="mb-8 flex justify-center">
          <svg
            className="w-16 h-16 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
            />
          </svg>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            We'll be back soon
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            We're currently performing scheduled maintenance to improve your
            experience. This should only take a few hours. We appreciate your
            patience.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Contact Section */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">Need immediate assistance?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:support@sixthgearmoto.com"
              className="text-sm text-gray-700 hover:text-[#F16D34] underline underline-offset-4 transition-colors"
            >
              support@sixthgearmoto.com
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a
              href="tel:+639123456789"
              className="text-sm text-gray-700 hover:text-[#F16D34] underline underline-offset-4 transition-colors"
            >
              +63 912 345 6789
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            SixthGear — Premium Motorcycle Parts & Accessories
          </p>
        </div>
      </div>
    </div>
  )
}
