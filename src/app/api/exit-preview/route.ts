import { draftMode } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Exit Preview API Route
 *
 * Disables Next.js Draft Mode and redirects to the homepage.
 * Can be called manually or via a button in the preview UI.
 */
export async function GET() {
  console.log("[Preview] Disabling draft mode")

  // Disable Draft Mode (await in Next.js 15+)
  const draft = await draftMode()
  draft.disable()

  console.log("[Preview] Draft mode disabled successfully")

  // Redirect to homepage
  redirect("/")
}
