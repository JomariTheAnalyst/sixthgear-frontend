import { Page, expect } from "@playwright/test"
import { TEST_SHIPPING_ADDRESS, STRIPE_TEST_CARDS } from "./test-data"

/**
 * Checkout Helper Functions
 *
 * Reusable functions for checkout flow testing
 */

/**
 * Navigate to a product and add it to cart
 */
export async function addProductToCart(
  page: Page,
  productName: string = "Medusa T-Shirt"
) {
  // Go to homepage
  await page.goto("/")

  // Wait for products to load
  await page.waitForSelector("text=Featured Products", { timeout: 10000 })

  // Find and click on the product
  const productCard = page.locator(`text=${productName}`).first()
  await productCard.click()

  // Wait for product page to load
  await page.waitForURL(/\/products\//)

  // Select size if available (for t-shirts)
  const sizeSelector = page.locator('button:has-text("S")').first()
  if (await sizeSelector.isVisible({ timeout: 2000 }).catch(() => false)) {
    await sizeSelector.click()
  }

  // Click "Add to Cart" button
  const addToCartButton = page.locator('button:has-text("Add to cart")').first()
  await addToCartButton.click()

  // Wait for cart to update
  await page.waitForTimeout(1000)
}

/**
 * Navigate to checkout from cart
 */
export async function goToCheckout(page: Page) {
  // Click on cart icon
  const cartButton = page
    .locator('[aria-label="Shopping cart"]')
    .or(page.locator("text=Cart"))
    .first()
  await cartButton.click()

  // Wait for cart drawer/page to open
  await page.waitForTimeout(1000)

  // Click checkout button
  const checkoutButton = page
    .locator('button:has-text("Checkout")')
    .or(page.locator('a:has-text("Checkout")'))
    .first()
  await checkoutButton.click()

  // Wait for checkout page
  await page.waitForURL(/\/checkout/, { timeout: 10000 })
}

/**
 * Fill shipping address form
 */
export async function fillShippingAddress(
  page: Page,
  address = TEST_SHIPPING_ADDRESS
) {
  // Wait for shipping form
  await page.waitForSelector('input[name="shipping_address.first_name"]', {
    timeout: 10000,
  })

  // Fill shipping address
  await page.fill(
    'input[name="shipping_address.first_name"]',
    address.firstName
  )
  await page.fill('input[name="shipping_address.last_name"]', address.lastName)
  await page.fill('input[name="shipping_address.address_1"]', address.address1)
  await page.fill('input[name="shipping_address.city"]', address.city)
  await page.fill(
    'input[name="shipping_address.postal_code"]',
    address.postalCode
  )
  await page.fill('input[name="shipping_address.phone"]', address.phone)

  // Select country if needed
  const countrySelect = page.locator(
    'select[name="shipping_address.country_code"]'
  )
  if (await countrySelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    await countrySelect.selectOption(address.countryCode)
  }

  // Wait a bit for form validation
  await page.waitForTimeout(500)
}

/**
 * Select shipping method
 */
export async function selectShippingMethod(
  page: Page,
  methodName: string = "Standard"
) {
  // Wait for shipping methods to load
  await page.waitForSelector("text=Shipping method", { timeout: 10000 })

  // Select shipping method
  const shippingMethod = page.locator(`text=${methodName}`).first()
  await shippingMethod.click()

  await page.waitForTimeout(500)
}

/**
 * Complete Stripe payment
 */
export async function completeStripePayment(page: Page) {
  // Click "Pay with Stripe" button
  const stripeButton = page
    .locator('button:has-text("Pay with Stripe")')
    .or(page.locator('button:has-text("Stripe")'))
    .first()
  await stripeButton.click()

  // Wait for Stripe checkout page
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 })

  // Fill Stripe form
  await page.waitForSelector('[name="email"]', { timeout: 10000 })
  await page.fill('[name="email"]', "test@example.com")

  // Fill card details
  const cardNumberFrame = page
    .frameLocator('iframe[name*="cardNumber"]')
    .first()
  await cardNumberFrame
    .locator('[name="cardnumber"]')
    .fill(STRIPE_TEST_CARDS.success.number)

  const cardExpiryFrame = page
    .frameLocator('iframe[name*="cardExpiry"]')
    .first()
  await cardExpiryFrame
    .locator('[name="exp-date"]')
    .fill(STRIPE_TEST_CARDS.success.expiry)

  const cardCvcFrame = page.frameLocator('iframe[name*="cardCvc"]').first()
  await cardCvcFrame.locator('[name="cvc"]').fill(STRIPE_TEST_CARDS.success.cvc)

  // Fill billing name
  await page.fill('[name="billingName"]', "Test Customer")

  // Submit payment
  const payButton = page
    .locator('button:has-text("Pay")')
    .or(page.locator('button[type="submit"]'))
    .first()
  await payButton.click()

  // Wait for redirect back to store
  await page.waitForURL(/order\/confirmed/, { timeout: 60000 })
}

/**
 * Complete COD payment
 */
export async function completeCODPayment(page: Page) {
  // Select COD payment method
  const codOption = page
    .locator("text=Cash on Delivery")
    .or(page.locator("text=COD"))
    .first()
  await codOption.click()

  await page.waitForTimeout(500)

  // Click "Place Order" or "Complete Order" button
  const placeOrderButton = page
    .locator('button:has-text("Place Order")')
    .or(page.locator('button:has-text("Complete Order")'))
    .first()
  await placeOrderButton.click()

  // Wait for order confirmation
  await page.waitForURL(/order\/confirmed/, { timeout: 30000 })
}

/**
 * Verify order confirmation page
 */
export async function verifyOrderConfirmation(page: Page) {
  // Check for confirmation message
  await expect(page.locator("text=Thank you")).toBeVisible({ timeout: 10000 })

  // Check for order number
  await expect(
    page.locator("text=Order #").or(page.locator("text=Order ID"))
  ).toBeVisible()

  // Check for order summary
  await expect(
    page.locator("text=Order Summary").or(page.locator("text=Order Items"))
  ).toBeVisible()
}

/**
 * Clear cart before test
 */
export async function clearCart(page: Page) {
  await page.goto("/")

  // Try to open cart
  const cartButton = page
    .locator('[aria-label="Shopping cart"]')
    .or(page.locator("text=Cart"))
    .first()
  if (await cartButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cartButton.click()
    await page.waitForTimeout(1000)

    // Remove all items
    const removeButtons = page
      .locator('button:has-text("Remove")')
      .or(page.locator('[aria-label="Remove"]'))
    const count = await removeButtons.count()

    for (let i = 0; i < count; i++) {
      const button = removeButtons.first()
      if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
        await button.click()
        await page.waitForTimeout(500)
      }
    }
  }
}
