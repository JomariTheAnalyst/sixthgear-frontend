/**
 * Strapi Coffee Menu Content Fetcher
 *
 * Fetches dynamic content for the First Gear Coffee Menu page from Strapi CMS.
 * Uses dynamic zone with blocks (similar to Home/About pages)
 */

import { fetchStrapi } from "../strapi"
import { StrapiImage } from "./home"

// ============================================================================
// TYPE DEFINITIONS - Strapi Response Structure
// ============================================================================

export interface CoffeeMenuHeroBlock {
  __component: string // Flexible to match any component name
  id: number
  pageName: string
  heading: string
  subheading: string
  background_image: StrapiImage | null
  is_active: boolean
}

export interface CoffeeMenuPageContent {
  data: {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    blocks: Array<CoffeeMenuHeroBlock | any>
  }
}

export interface VariantComponent {
  id: number
  label: string
  price: number
  is_active: boolean
}

export interface MenuItemData {
  id: number
  documentId: string
  name: string
  description: string
  image: StrapiImage | null
  isPopular: boolean
  sortOrder: number
  is_active: boolean
  variants: VariantComponent[]
}

export interface MenuCategoryData {
  id: number
  documentId: string
  name: string
  shortDescription: string
  slug: string
  sortOrder: number
  is_active: boolean
  menu_items: MenuItemData[]
}

export interface MenuCategoriesResponse {
  data: MenuCategoryData[]
}

// ============================================================================
// TYPE DEFINITIONS - Frontend UI Format
// ============================================================================

export interface CoffeeMenuHero {
  pageTitle: string
  pageSubtitle: string
  backgroundImage: string | null
}

export interface MenuVariant {
  id: number
  label: string
  price: number
}

export interface MenuItemUI {
  id: string
  name: string
  description: string
  image: string | null
  isPopular: boolean
  variants: MenuVariant[]
}

export interface MenuCategoryUI {
  id: string
  name: string
  description: string
  slug: string
  items: MenuItemUI[]
}

// ============================================================================
// FETCH FUNCTIONS
// ============================================================================

/**
 * Fetch Coffee Menu Page hero content from Strapi
 */
export async function fetchCoffeeMenuPage(): Promise<CoffeeMenuPageContent | null> {
  console.log(`[Coffee Menu] Fetching page content from Strapi`)

  return fetchStrapi<CoffeeMenuPageContent>("/api/coffee-menu-page", {
    params: {
      "populate[blocks][populate]": "*",
    },
  })
}

/**
 * Fetch Menu Categories with Items and Variants from Strapi
 */
export async function fetchMenuCategories(): Promise<MenuCategoriesResponse | null> {
  console.log(`[Coffee Menu] Fetching categories from Strapi`)

  return fetchStrapi<MenuCategoriesResponse>("/api/menu-categories", {
    params: {
      filters: {
        is_active: {
          $eq: true,
        },
      },
      sort: ["sortOrder:asc"],
      "populate[menu_items][populate]": "*",
    },
  })
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Resolve Strapi image URL to absolute URL
 */
function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
  return `${strapiUrl}${url.startsWith("/") ? "" : "/"}${url}`
}

// ============================================================================
// TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform Coffee Menu Page data to UI format
 */
export function transformCoffeeMenuHero(
  pageData: CoffeeMenuPageContent | null
): CoffeeMenuHero | null {
  console.log("[Coffee Menu Hero] ==========================================")
  console.log("[Coffee Menu Hero] Transform called")
  console.log("[Coffee Menu Hero] Has pageData:", !!pageData)
  console.log("[Coffee Menu Hero] Has pageData.data:", !!pageData?.data)
  console.log("[Coffee Menu Hero] Has blocks:", !!pageData?.data?.blocks)
  console.log(
    "[Coffee Menu Hero] Blocks count:",
    pageData?.data?.blocks?.length || 0
  )

  if (!pageData?.data?.blocks || pageData.data.blocks.length === 0) {
    console.log("[Coffee Menu Hero] ❌ No blocks found - using fallback")
    console.log("[Coffee Menu Hero] ==========================================")
    return null
  }

  // Log all blocks for debugging
  console.log("[Coffee Menu Hero] All blocks:")
  pageData.data.blocks.forEach((block: any, index: number) => {
    console.log(`  Block ${index}:`, {
      component: block.__component,
      id: block.id,
      is_active: block.is_active,
      fields: Object.keys(block),
    })
  })

  // Try to find the hero block - be flexible with component name
  // Look for any block that contains "menu" or "coffee" or "hero" or "first"
  const heroBlock = pageData.data.blocks.find(
    (block: any) =>
      block.__component &&
      (block.__component.toLowerCase().includes("menu") ||
        block.__component.toLowerCase().includes("coffee") ||
        block.__component.toLowerCase().includes("hero") ||
        block.__component.toLowerCase().includes("first"))
  ) as CoffeeMenuHeroBlock | undefined

  if (!heroBlock) {
    console.log("[Coffee Menu Hero] ❌ No matching hero block found")
    console.log(
      "[Coffee Menu Hero] Available components:",
      pageData.data.blocks.map((b: any) => b.__component)
    )
    console.log("[Coffee Menu Hero] ==========================================")
    return null
  }

  console.log("[Coffee Menu Hero] ✅ Found hero block!")
  console.log("[Coffee Menu Hero] Component:", heroBlock.__component)
  console.log("[Coffee Menu Hero] is_active:", heroBlock.is_active)
  console.log("[Coffee Menu Hero] heading:", heroBlock.heading)
  console.log("[Coffee Menu Hero] subheading:", heroBlock.subheading)
  console.log(
    "[Coffee Menu Hero] background_image:",
    heroBlock.background_image?.url
  )

  // Check if is_active is explicitly false (not just undefined/null)
  if (heroBlock.is_active === false) {
    console.log("[Coffee Menu Hero] ⚠️ Block is_active=false - using fallback")
    console.log("[Coffee Menu Hero] ==========================================")
    return null
  }

  const heroData = {
    pageTitle: heroBlock.heading || "Our Menu",
    pageSubtitle:
      heroBlock.subheading ||
      "Handcrafted brews served with passion. More than a pit stop—it's where riders refuel, relax, and reconnect.",
    backgroundImage: resolveImageUrl(heroBlock.background_image?.url),
  }

  console.log("[Coffee Menu Hero] ✅ Transformation successful!")
  console.log("[Coffee Menu Hero] Final data:")
  console.log("  pageTitle:", heroData.pageTitle)
  console.log("  pageSubtitle:", heroData.pageSubtitle)
  console.log("  backgroundImage:", heroData.backgroundImage)
  console.log("[Coffee Menu Hero] ==========================================")

  return heroData
}

/**
 * Transform Menu Categories data to UI format
 */
export function transformMenuCategories(
  categoriesData: MenuCategoriesResponse | null
): MenuCategoryUI[] {
  console.log("[Coffee Menu Categories] Transform called with:", {
    hasData: !!categoriesData?.data,
    categoriesCount: categoriesData?.data?.length || 0,
  })

  if (!categoriesData?.data) {
    console.log("[Coffee Menu Categories] No categories data")
    return []
  }

  const transformedCategories = categoriesData.data
    .filter((category) => category.is_active)
    .map((category) => ({
      id: category.slug || category.documentId,
      name: category.name,
      description: category.shortDescription || "",
      slug: category.slug,
      items: transformMenuItems(category.menu_items),
    }))
    .filter((category) => category.items.length > 0) // Hide empty categories

  console.log("[Coffee Menu Categories] Transformed:", {
    totalCategories: transformedCategories.length,
    categories: transformedCategories.map((c) => ({
      name: c.name,
      itemsCount: c.items.length,
    })),
  })

  return transformedCategories
}

/**
 * Transform Menu Items data to UI format
 */
function transformMenuItems(items: MenuItemData[] | undefined): MenuItemUI[] {
  if (!items) {
    console.log("[Coffee Menu Items] No items provided")
    return []
  }

  const transformedItems = items
    .filter((item) => item.is_active)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      id: item.documentId,
      name: item.name,
      description: item.description || "",
      image: resolveImageUrl(item.image?.url),
      isPopular: item.isPopular || false,
      variants: transformVariants(item.variants),
    }))

  console.log("[Coffee Menu Items] Transformed:", {
    totalItems: transformedItems.length,
    items: transformedItems.map((i) => ({
      name: i.name,
      hasImage: !!i.image,
      variantsCount: i.variants.length,
    })),
  })

  return transformedItems
}

/**
 * Transform Variants data to UI format
 */
function transformVariants(
  variants: VariantComponent[] | undefined
): MenuVariant[] {
  if (!variants) return []

  return variants
    .filter((variant) => variant.is_active)
    .map((variant) => ({
      id: variant.id,
      label: variant.label,
      price: variant.price,
    }))
}

// ============================================================================
// MAIN GETTER FUNCTIONS
// ============================================================================

/**
 * Get Coffee Menu Hero content
 */
export async function getCoffeeMenuHero(): Promise<CoffeeMenuHero | null> {
  try {
    const pageData = await fetchCoffeeMenuPage()
    return transformCoffeeMenuHero(pageData)
  } catch (error) {
    console.error("[Coffee Menu] Error getting hero:", error)
    return null
  }
}

/**
 * Get Menu Categories with Items
 */
export async function getMenuCategories(): Promise<MenuCategoryUI[]> {
  try {
    const categoriesData = await fetchMenuCategories()
    return transformMenuCategories(categoriesData)
  } catch (error) {
    console.error("[Coffee Menu] Error getting categories:", error)
    return []
  }
}
