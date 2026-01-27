import { listRegions } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { StoreRegion, HttpTypes } from "@medusajs/types"
import NavClient from "./nav-client"
import { getAllServices } from "@lib/strapi/services"

export default async function Nav() {
  const [regions, cart, customer, services] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    retrieveCart().catch(() => null),
    retrieveCustomer().catch(() => null),
    getAllServices(), // Fetch from Strapi with fallback
  ])

  return (
    <NavClient
      regions={regions}
      cart={cart}
      servicesData={services}
      customer={customer}
    />
  )
}
