import React from "react"

import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses } = customer

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Saved Addresses
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your delivery addresses
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {addresses.length} {addresses.length === 1 ? "address" : "addresses"}
        </span>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AddAddress region={region} addresses={addresses} />
        {addresses.map((address) => (
          <EditAddress region={region} address={address} key={address.id} />
        ))}
      </div>

      {/* Empty State Info */}
      {addresses.length === 0 && (
        <div className="text-center py-6 text-gray-500 text-sm">
          Add your first address to make checkout faster
        </div>
      )}
    </div>
  )
}

export default AddressBook
