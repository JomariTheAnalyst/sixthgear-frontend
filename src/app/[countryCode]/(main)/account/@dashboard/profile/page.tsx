import { Metadata } from "next"

import ProfilePhone from "@modules/account/components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Medusa Store profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="space-y-6" data-testid="profile-page-wrapper">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
            {customer.first_name?.charAt(0) || "U"}
            {customer.last_name?.charAt(0) || ""}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your personal information and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="space-y-4">
        <SectionHeader
          title="Personal Information"
          description="Update your name and contact details"
        />
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
        <ProfilePhone customer={customer} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Billing Address"
          description="Your default billing address for orders"
        />
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  )
}

const SectionHeader = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="pt-2">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}
