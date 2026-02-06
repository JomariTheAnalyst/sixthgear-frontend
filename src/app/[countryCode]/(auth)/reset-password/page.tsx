import { Metadata } from "next"
import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"

export const metadata: Metadata = {
  title: "Reset Password | SixthGear",
  description: "Create a new password for your SixthGear account",
}

export default function ResetPasswordPage() {
  return <ResetPasswordTemplate />
}
