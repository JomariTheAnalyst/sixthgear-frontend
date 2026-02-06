import { test, expect } from "@playwright/test"
import {
  addProductToCart,
  goToCheckout,
  fillShippingAddress,
  selectShippingMethod,
  completeCODPayment,
  verifyOrderConfirmation,
  clearCart,
} from "../helpers/checkout-helpers"

/**
 * E2E Test: Checkout with Cash on Delivery (COD)
 *
 * Tests the complete checkout flow using COD payment:
 * 1. Add product to cart
 * 2. Go to checkout
 * 3. Fill shipping address
 * 4. Select shipping method
 * 5. Select COD payment
 * 6. Verify order confirmation with COD warning
 */

test.describe("Checkout with Cash on Delivery (COD)", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cart before each test
    await clearCart(page)
  })

  test("should complete checkout with COD payment successfully", async ({
    page,
  }) => {
    // Step 1: Add product to cart
    console.log("Step 1: Adding product to cart...")
    await addProductToCart(page, "Medusa T-Shirt")

    // Take screenshot after adding to cart
    await page.screenshot({
      path: "test-results/screenshots/cod-01-product-added.png",
      fullPage: true,
    })

    // Step 2: Go to checkout
    console.log("Step 2: Going to checkout...")
    await goToCheckout(page)

    // Verify we're on checkout page
    await expect(page).toHaveURL(/\/checkout/)
    await page.screenshot({
      path: "test-results/screenshots/cod-02-checkout-page.png",
      fullPage: true,
    })

    // Step 3: Fill shipping address
    console.log("Step 3: Filling shipping address...")
    await fillShippingAddress(page)

    await page.screenshot({
      path: "test-results/screenshots/cod-03-shipping-filled.png",
      fullPage: true,
    })

    // Step 4: Select shipping method
    console.log("Step 4: Selecting shipping method...")
    await selectShippingMethod(page)

    await page.screenshot({
      path: "test-results/screenshots/cod-04-shipping-selected.png",
      fullPage: true,
    })

    // Step 5: Complete COD payment
    console.log("Step 5: Selecting COD payment...")
    await completeCODPayment(page)

    // Step 6: Verify order confirmation
    console.log("Step 6: Verifying order confirmation...")
    await verifyOrderConfirmation(page)

    // Take final screenshot
    await page.screenshot({
      path: "test-results/screenshots/cod-05-order-confirmed.png",
      fullPage: true,
    })

    console.log("✅ COD checkout test completed successfully!")
  })

  test("should display COD warning message on confirmation page", async ({
    page,
  }) => {
    // Complete checkout with COD
    await addProductToCart(page)
    await goToCheckout(page)
    await fillShippingAddress(page)
    await selectShippingMethod(page)
    await completeCODPayment(page)

    // Verify COD-specific messages
    await expect(
      page.locator("text=Cash on Delivery").or(page.locator("text=COD"))
    ).toBeVisible({ timeout: 5000 })
    await expect(
      page.locator("text=Payment Pending").or(page.locator("text=Pending"))
    ).toBeVisible()

    // Verify COD warning about exact amount
    await expect(
      page
        .locator("text=Please prepare exact amount")
        .or(page.locator("text=exact amount"))
    ).toBeVisible()

    // Take screenshot of COD warning
    await page.screenshot({
      path: "test-results/screenshots/cod-warning-message.png",
      fullPage: true,
    })
  })

  test("should NOT show payment confirmed for COD orders", async ({ page }) => {
    // Complete checkout with COD
    await addProductToCart(page)
    await goToCheckout(page)
    await fillShippingAddress(page)
    await selectShippingMethod(page)
    await completeCODPayment(page)

    // Verify payment status shows as pending, NOT confirmed
    await expect(
      page.locator("text=Payment Pending").or(page.locator("text=Pending"))
    ).toBeVisible()

    // Verify NO "Payment Confirmed" message
    await expect(page.locator("text=Payment Confirmed")).not.toBeVisible()
  })

  test("should show contact information in confirmation email preview", async ({
    page,
  }) => {
    // Complete checkout with COD
    await addProductToCart(page)
    await goToCheckout(page)
    await fillShippingAddress(page)
    await selectShippingMethod(page)
    await completeCODPayment(page)

    // Verify contact information is visible
    await expect(
      page
        .locator("text=0995 093 0157")
        .or(page.locator("text=Questions or concerns"))
    ).toBeVisible({ timeout: 5000 })
    await expect(
      page
        .locator("text=facebook.com/camille.sixthgear")
        .or(page.locator('a[href*="facebook.com/camille.sixthgear"]'))
    ).toBeVisible()
  })

  test("should display order total amount for COD", async ({ page }) => {
    // Complete checkout with COD
    await addProductToCart(page)
    await goToCheckout(page)
    await fillShippingAddress(page)
    await selectShippingMethod(page)
    await completeCODPayment(page)

    // Verify total amount is displayed
    await expect(
      page.locator("text=Total").or(page.locator("text=Total amount"))
    ).toBeVisible()

    // Verify amount format (₱ or PHP)
    await expect(
      page.locator("text=₱").or(page.locator("text=PHP"))
    ).toBeVisible()
  })
})
