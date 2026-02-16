import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { MeiliSearch } from "meilisearch"

// Initialize Meilisearch client for InstantSearch
export const { searchClient } = instantMeiliSearch(
  process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700",
  process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "",
  {
    primaryKey: "id",
  }
)

// Native Meilisearch client for direct API calls
export const meilisearchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "",
})

// Index name for products
export const PRODUCT_INDEX_NAME =
  process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME || "sixthgear_products"
