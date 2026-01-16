import { listRegions } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"
import { StoreRegion, HttpTypes } from "@medusajs/types"
import NavClient from "./nav-client"
import { servicesData } from "@lib/services-data"

export default async function Nav() {
  const [regions, cart] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    retrieveCart().catch(() => null),
  ])

  return <NavClient regions={regions} cart={cart} servicesData={servicesData} />
}
