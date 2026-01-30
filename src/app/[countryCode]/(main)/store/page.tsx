import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getWishlist } from "@lib/data/wishlist"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

// Revalidate page every 60 seconds in production
export const revalidate = 60

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    tag?: string
    category?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, tag, category } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      tagValue={tag}
      categoryHandle={category}
    />
  )
}
