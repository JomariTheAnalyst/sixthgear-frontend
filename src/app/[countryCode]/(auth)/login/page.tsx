import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import LoginTemplate from "@modules/account/templates/login-template"
import CTABanner from "@modules/home/components/cta-banner"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Sixthgear account.",
}

export default async function LoginPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (customer) {
    redirect("/account")
  }

  return (
    <>
      <LoginTemplate />
    </>
  )
}
