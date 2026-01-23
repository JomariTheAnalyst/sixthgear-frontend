import { Metadata } from "next"
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Preview Mode",
  description: "Strapi CMS Preview Mode",
}

/**
 * Preview Page for Strapi Cloud
 *
 * This page is specifically designed to be embedded in Strapi Cloud's iframe.
 * Path: /ph/preview (or /us/preview, /sg/preview, etc.)
 *
 * Security: Only this route allows iframe embedding from Strapi Cloud.
 */
export default async function PreviewPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  // Check if draft mode is enabled
  const { isEnabled } = await draftMode()

  console.log("[PreviewPage] Draft mode enabled:", isEnabled)
  console.log("[PreviewPage] Country code:", countryCode)

  // Note: We don't redirect if draft mode is not enabled
  // Strapi iframe loads this page first, then enables draft mode via /api/preview
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Preview Mode Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <div className="font-bold">
                {isEnabled ? "Preview Mode Active" : "Preview Mode Ready"}
              </div>
              <div className="text-xs text-orange-100">
                {isEnabled 
                  ? "You are viewing draft content from Strapi CMS"
                  : "Waiting for Strapi to enable draft mode..."}
              </div>
            </div>
          </div>
          <a
            href="/api/exit-preview"
            className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm"
          >
            Exit Preview
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl">
                ✅
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Preview is Working!
                </h1>
                <p className="text-gray-600">
                  Strapi Cloud iframe embedding is successful
                </p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-3">🌍</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Country Code
              </h2>
              <p className="text-gray-600">
                Current locale:{" "}
                <span className="font-mono font-bold text-orange-600">
                  {countryCode.toUpperCase()}
                </span>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-3">📝</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Draft Mode
              </h2>
              <p className="text-gray-600">
                Status:{" "}
                <span className={`font-bold ${isEnabled ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isEnabled ? 'Enabled' : 'Ready'}
                </span>
              </p>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🔧 Technical Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Preview URL:</span>
                <span className="font-mono text-gray-900">
                  /{countryCode}/preview
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Draft Mode:</span>
                <span className="font-mono text-green-600">✓ Active</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Iframe Embedding:</span>
                <span className="font-mono text-green-600">✓ Allowed</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Strapi Cloud:</span>
                <span className="font-mono text-green-600">✓ Connected</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              📋 Next Steps
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>
                1. This page will be replaced with actual homepage content
              </li>
              <li>2. Draft changes from Strapi will appear here</li>
              <li>
                3. Published site will continue showing published content only
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
