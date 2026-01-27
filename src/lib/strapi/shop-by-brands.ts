/**
 * Strapi Shop-by-Brands Content Fetcher
 *
 * Fetches shop-by-brands section content from Strapi CMS for the homepage.
 */

import { StrapiImage } from "./home"
import { pickText, pickMediaUrl, pickBool } from "../cms/fallback"

// Type definitions for Shop-by-Brands block (Strapi v5 structure)
export interface BrandItem {
  id: number
  brand_name: string
  brand_image: StrapiImage[] | null
  enabled: boolean
  button_name: string
  button_link: string
}

export interface ShopByBrandsBlock {
  __component: "sections.shop-by-brands"
  id: number
  section_title: string
  brands: BrandItem[]
  enable: boolean
}

export interface ShopByBrandsContent {
  sectionTitle: string
  brands: Array<{
    id: number
    name: string
    imageUrl: string
    link: string
    buttonText: string
  }>
  isSectionEnabled: boolean
  showNavDesktop: boolean
}

// Hardcoded fallback values
const SHOP_BY_BRANDS_FALLBACKS = {
  sectionTitle: "BRANDS WE ARE PARTNER WITH",
  brands: [
    {
      id: 1,
      name: "AKRAPOVIC",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      link: "/store?brand=akrapovic",
      buttonText: "SHOP NOW",
    },
    {
      id: 2,
      name: "SEC MOTO",
      imageUrl:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop",
      link: "/store?brand=sec-moto",
      buttonText: "SHOP NOW",
    },
    {
      id: 3,
      name: "MOTOHUB",
      imageUrl:
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop",
      link: "/store?brand=motohub",
      buttonText: "SHOP NOW",
    },
    {
      id: 4,
      name: "MOTUL",
      imageUrl:
        "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&h=600&fit=crop",
      link: "/store?brand=motul",
      buttonText: "SHOP NOW",
    },
  ],
}

/**
 * Generate slug from brand name
 * Converts "Akrapovic" to "akrapovic", "SEC Moto" to "sec-moto"
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Extract shop-by-brands content from home page data
 *
 * @param homeContent - Full home page content from Strapi
 * @returns Formatted shop-by-brands content or null if not found/disabled
 */
export function extractShopByBrandsContent(
  homeContent: any
): ShopByBrandsContent | null {
  if (!homeContent?.data?.blocks) {
    console.log("[extractShopByBrands] No blocks found in homeContent")
    return null
  }

  // Find the shop-by-brands block
  const brandsBlock = homeContent.data.blocks.find(
    (block: any): block is ShopByBrandsBlock =>
      block.__component === "sections.shop-by-brands"
  )

  if (!brandsBlock) {
    console.log("[extractShopByBrands] No shop-by-brands block found")
    return null
  }

  // Check if section is enabled
  const isSectionEnabled = pickBool(brandsBlock.enable, true)
  if (!isSectionEnabled) {
    console.log("[extractShopByBrands] Section disabled in CMS")
    return null
  }

  console.log("[extractShopByBrands] Found brands block:", {
    section_title: brandsBlock.section_title,
    brandsCount: brandsBlock.brands?.length || 0,
    enable: brandsBlock.enable,
  })

  // If no brands in CMS, return null to trigger fallback
  if (!brandsBlock.brands || brandsBlock.brands.length === 0) {
    console.log("[extractShopByBrands] No brands in CMS, will use fallbacks")
    return {
      sectionTitle: pickText(
        brandsBlock.section_title,
        SHOP_BY_BRANDS_FALLBACKS.sectionTitle
      ),
      brands: [],
      isSectionEnabled: true,
      showNavDesktop: false,
    }
  }

  // Filter and transform brand items (only enabled ones)
  const brands = brandsBlock.brands
    .filter((brand) => {
      const isEnabled = pickBool(brand.enabled, true)
      console.log(`[extractShopByBrands] Brand "${brand.brand_name}":`, {
        id: brand.id,
        enabled: brand.enabled,
        isEnabled,
        hasImage: !!brand.brand_image,
        imageCount: Array.isArray(brand.brand_image)
          ? brand.brand_image.length
          : 0,
        imageData: brand.brand_image,
      })
      return isEnabled
    })
    .map((brand) => {
      // Use first image from Multiple Media field
      const firstImage =
        Array.isArray(brand.brand_image) && brand.brand_image.length > 0
          ? brand.brand_image[0]
          : null

      console.log(`[extractShopByBrands] Processing "${brand.brand_name}":`, {
        firstImage,
        hasUrl: !!firstImage?.url,
      })

      const imageUrl = firstImage ? pickMediaUrl(firstImage, "") : ""

      const brandSlug = generateSlug(brand.brand_name || "brand")
      const defaultLink = `/store?brand=${brandSlug}`

      const mappedBrand = {
        id: brand.id,
        name: pickText(brand.brand_name, "Brand"),
        imageUrl,
        link: pickText(brand.button_link, defaultLink),
        buttonText: pickText(brand.button_name, "SHOP NOW"),
      }

      console.log(`[extractShopByBrands] Mapped brand:`, mappedBrand)

      return mappedBrand
    })
    .filter((brand) => {
      const isValid = brand.name && brand.imageUrl
      if (!isValid) {
        console.log(
          `[extractShopByBrands] Filtering out invalid brand (missing name or image):`,
          brand
        )
      }
      return isValid
    })

  console.log("[extractShopByBrands] Final enabled brands:", {
    count: brands.length,
    brands,
  })

  // Compute desktop nav visibility (show arrows only if > 4 brands)
  const showNavDesktop = brands.length > 4

  // Transform to frontend format
  const result: ShopByBrandsContent = {
    sectionTitle: pickText(
      brandsBlock.section_title,
      SHOP_BY_BRANDS_FALLBACKS.sectionTitle
    ),
    brands,
    isSectionEnabled: true,
    showNavDesktop,
  }

  console.log("[extractShopByBrands] Returning result:", {
    sectionTitle: result.sectionTitle,
    brandsCount: brands.length,
    showNavDesktop,
  })
  return result
}

/**
 * Get shop-by-brands content with fallbacks
 *
 * Fetches shop-by-brands content from Strapi and returns formatted data.
 * Uses per-brand fallbacks: if CMS has brands, use them; otherwise use fallback brands.
 *
 * @param homeContent - Home content already fetched (to avoid duplicate requests)
 * @returns Shop-by-brands content with fallbacks applied
 */
export function getShopByBrandsWithFallbacks(
  homeContent: any
): ShopByBrandsContent {
  try {
    const cmsContent = extractShopByBrandsContent(homeContent)

    if (!cmsContent) {
      console.log("[ShopByBrands] No CMS data, using all fallbacks")
      return {
        ...SHOP_BY_BRANDS_FALLBACKS,
        isSectionEnabled: true,
        showNavDesktop: SHOP_BY_BRANDS_FALLBACKS.brands.length > 4,
      }
    }

    // If CMS has brands (even if empty array), use them; otherwise use fallbacks
    const finalBrands =
      cmsContent.brands.length > 0
        ? cmsContent.brands
        : SHOP_BY_BRANDS_FALLBACKS.brands

    const result: ShopByBrandsContent = {
      sectionTitle: cmsContent.sectionTitle,
      brands: finalBrands,
      isSectionEnabled: cmsContent.isSectionEnabled,
      showNavDesktop: finalBrands.length > 4,
    }

    console.log("[ShopByBrands] Applied fallbacks:", {
      usedCmsTitle: !!cmsContent.sectionTitle,
      brandsCount: result.brands.length,
      showNavDesktop: result.showNavDesktop,
    })

    return result
  } catch (error) {
    console.error(
      "[ShopByBrands] Error fetching content, using fallbacks:",
      error
    )
    return {
      ...SHOP_BY_BRANDS_FALLBACKS,
      isSectionEnabled: true,
      showNavDesktop: SHOP_BY_BRANDS_FALLBACKS.brands.length > 4,
    }
  }
}
