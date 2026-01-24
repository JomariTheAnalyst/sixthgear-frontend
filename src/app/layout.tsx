import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { PreviewIndicator } from "../components/preview-indicator"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Sixthgear | Moto Supply & Café",
    template: "%s - Sixthgear",
  },
  description:
    "Your one-stop shop for motorcycle gear, parts, and great coffee in the Philippines.",
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico" },
      {
        url: "/images/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [{ url: "/images/favicon/apple-touch-icon.png" }],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/images/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/images/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/images/favicon/site.webmanifest",
}

import { hendrix } from "@lib/fonts"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${hendrix.variable} font-sans`}>
        <PreviewIndicator />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
