import { Metadata } from "next"
import ForgotPasswordTemplate from "@modules/account/templates/forgot-password-template"

export const metadata: Metadata = {
  title: "Forgot Password | SixthGear",
  description: "Reset your SixthGear account password",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordTemplate />
}
