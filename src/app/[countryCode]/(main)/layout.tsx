import { Metadata } from "next"
import { draftMode } from "next/headers"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getMarketingForPath } from "@lib/data/marketing"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import CartDrawerWrapper from "@modules/cart/components/cart-drawer-wrapper"
import { MarketingProvider } from "@modules/marketing"
import PreviewBanner from "@modules/marketing/components/preview-banner"
import { SelectedItemsProvider } from "@lib/context/selected-cart-items-context"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  const draft = await draftMode()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  // Fetch marketing content for the layout (strip only at this level)
  const marketing = await getMarketingForPath("/")

  return (
    <SelectedItemsProvider>
      <CartDrawerWrapper cart={cart}>
        <MarketingProvider marketing={marketing}>
          <Nav />
          {customer && cart && (
            <CartMismatchBanner customer={customer} cart={cart} />
          )}

          {cart && (
            <FreeShippingPriceNudge
              variant="popup"
              cart={cart}
              shippingOptions={shippingOptions}
            />
          )}
          {props.children}
          <Footer />

          {/* Preview Mode Banner */}
          <PreviewBanner isPreview={draft.isEnabled} />
        </MarketingProvider>
      </CartDrawerWrapper>
    </SelectedItemsProvider>
  )
}
