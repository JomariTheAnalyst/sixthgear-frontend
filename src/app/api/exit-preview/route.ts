import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Exit Preview API Route
 *
 * Disables Next.js Draft Mode and redirects to the homepage.
 * Called when user clicks "Exit Preview" link.
 */
export async function GET() {
  console.log("[ExitPreview] Disabling draft mode")

  // Disable Draft Mode (await in Next.js 15+)
  const draft = await draftMode()
  draft.disable()

  console.log("[ExitPreview] Draft mode disabled, redirecting to homepage")

  // Redirect to homepage
  redirect("/ph")
}
