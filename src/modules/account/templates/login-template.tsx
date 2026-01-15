"use client"

import { useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Panel - Image Section */}
      <div className="hidden lg:block lg:w-1/2 h-screen relative">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <LocalizedClientLink
            href="/"
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-all"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </LocalizedClientLink>
        </div>
        <Image
          src="/images/sixthgearleftsideimg.jpg"
          alt="Sixthgear"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Panel - Form Section */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          {/* Mobile back button */}
          <LocalizedClientLink
            href="/"
            className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to store</span>
          </LocalizedClientLink>

          {currentView === "sign-in" ? (
            <Login setCurrentView={setCurrentView} />
          ) : (
            <Register setCurrentView={setCurrentView} />
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
