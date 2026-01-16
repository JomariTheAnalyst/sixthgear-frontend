import { draftMode, cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * GET /api/preview
 * Enable draft mode and redirect to preview page
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")
  const redirectPath = searchParams.get("redirect") || "/"

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 })
  }

  try {
    // Validate token with backend
    const response = await fetch(
      `${BACKEND_URL}/store/marketing/validate-preview?token=${token}`
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const data = await response.json()

    if (!data.valid) {
      return NextResponse.json(
        { error: data.error || "Invalid token" },
        { status: 401 }
      )
    }

    // Enable draft mode
    const draft = await draftMode()
    draft.enable()

    // Set preview token cookie for marketing fetches
    const cookieStore = await cookies()
    cookieStore.set("marketing_preview_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    })

    // Redirect to the preview page
    redirect(redirectPath)
  } catch (error) {
    console.error("[Preview] Error:", error)
    return NextResponse.json(
      { error: "Preview validation failed" },
      { status: 500 }
    )
  }
}
