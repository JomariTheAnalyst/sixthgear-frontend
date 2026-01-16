import { draftMode, cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

/**
 * GET /api/exit-preview
 * Disable draft mode and clear preview cookies
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const redirectPath = searchParams.get("redirect") || "/"

  // Disable draft mode
  const draft = await draftMode()
  draft.disable()

  // Clear preview token cookie
  const cookieStore = await cookies()
  cookieStore.delete("marketing_preview_token")

  // Redirect to home or specified path
  redirect(redirectPath)
}
