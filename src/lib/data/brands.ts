import { sdk } from "@lib/config"

export interface Brand {
  id: string
  name: string
  handle: string
}

/**
 * Fetch all unique brands (collections) from Medusa
 * Brands are stored as product collections in Medusa
 */
export async function listBrands(): Promise<Brand[]> {
  try {
    const { collections } = await sdk.store.collection.list({
      fields: "id,title,handle",
      limit: 100,
    })

    return collections.map((collection) => ({
      id: collection.id,
      name: collection.title,
      handle: collection.handle,
    }))
  } catch (error) {
    console.error("Error fetching brands:", error)
    return []
  }
}
