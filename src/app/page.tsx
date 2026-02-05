import { redirect } from "next/navigation"

export default function RootPage() {
  // Server-side redirect to default country route
  redirect("/ph")
}
