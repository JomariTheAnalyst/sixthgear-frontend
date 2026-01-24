import localFont from "next/font/local"

export const hendrix = localFont({
    src: [
        {
            path: "../../public/fonts/BRHendrix.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts/BRHendrix_Semibold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/fonts/BRHendrix-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-hendrix",
    display: "swap",
})
