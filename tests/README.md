# Playwright E2E Tests - SixthGear

## 📚 Overview

This directory contains End-to-End (E2E) tests for the SixthGear e-commerce platform using Playwright.

### What's Tested

- ✅ Checkout with Stripe payment
- ✅ Checkout with Cash on Delivery (COD)
- ✅ Payment status verification
- ✅ Order confirmation
- ✅ Email notification content

---

## 🚀 Quick Start

### 1. Install Playwright

```bash
# Install Playwright and browsers
npm install -D @playwright/test
npx playwright install
```

### 2. Start the Application

Make sure your application is running:

```bash
# Terminal 1: Start frontend
cd sixthgear-frontend
npm run dev

# Terminal 2: Start backend (Docker)
cd sixthgear-backend
docker-compose up
```

### 3. Run Tests

```bash
# Run all tests
npm run test:e2e

# Run with browser visible
npm run test:e2e:headed

# Run with Playwright UI (recommended for debugging)
npm run test:e2e:ui

# Run specific test file
npm run test:checkout:stripe
npm run test:checkout:cod

# Run in debug mode
npm run test:e2e:debug
```

---

## 📁 Test Structure

```
tests/
├── e2e/
│   ├── checkout-stripe.spec.ts    # Stripe payment tests
│   └── checkout-cod.spec.ts       # COD payment tests
├── helpers/
│   ├── test-data.ts               # Test data (addresses, cards, etc.)
│   └── checkout-helpers.ts        # Reusable functions
└── README.md                      # This file
```

---

## 🧪 Available Test Commands

### Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with browser visible (headed mode)
npm run test:e2e:headed

# Run tests with Playwright UI (best for development)
npm run test:e2e:ui

# Run tests in debug mode (step through tests)
npm run test:e2e:debug
```

### Run Specific Tests

```bash
# Run only checkout tests
npm run test:checkout

# Run only Stripe checkout tests
npm run test:checkout:stripe

# Run only COD checkout tests
npm run test:checkout:cod

# Run specific test by name
npx playwright test -g "should complete checkout with Stripe"
```

### View Reports

```bash
# Open HTML report
npm run test:e2e:report

# View test results
cat test-results/results.json
```

### Generate Tests

```bash
# Record actions and generate test code
npm run test:e2e:codegen
```

---

## 📊 Test Reports & Artifacts

### Generated Files

After running tests, you'll find:

```
sixthgear-frontend/
├── playwright-report/          # HTML report (open in browser)
│   └── index.html
├── test-results/               # Test artifacts
│   ├── results.json           # JSON results
│   ├── junit.xml              # JUnit format (for CI/CD)
│   └── screenshots/           # Screenshots on failure
│       ├── 01-product-added.png
│       ├── 02-checkout-page.png
│       ├── 03-shipping-filled.png
│       ├── 04-shipping-selected.png
│       └── 05-order-confirmed.png
└── videos/                     # Videos of failed tests
```

### View HTML Report

```bash
npm run test:e2e:report
```

This opens an interactive report showing:

- ✅ Passed tests
- ❌ Failed tests
- 📸 Screenshots
- 🎥 Videos
- 📝 Traces

---

## 🎯 Test Scenarios

### Stripe Checkout Tests

**File**: `tests/e2e/checkout-stripe.spec.ts`

1. **Complete Checkout Flow**

   - Add product to cart
   - Go to checkout
   - Fill shipping address
   - Select shipping method
   - Pay with Stripe
   - Verify order confirmation

2. **Payment Status Verification**

   - Verify "Payment Confirmed" message
   - Verify NO COD warning

3. **Order Summary Display**
   - Verify order items
   - Verify subtotal, shipping, total

### COD Checkout Tests

**File**: `tests/e2e/checkout-cod.spec.ts`

1. **Complete Checkout Flow**

   - Add product to cart
   - Go to checkout
   - Fill shipping address
   - Select shipping method
   - Select COD payment
   - Verify order confirmation

2. **COD Warning Message**

   - Verify "Payment Pending" status
   - Verify "Please prepare exact amount" warning
   - Verify total amount displayed

3. **Contact Information**

   - Verify phone number (0995 093 0157)
   - Verify Facebook link

4. **Payment Status**
   - Verify NO "Payment Confirmed" message
   - Verify "Payment Pending" status

---

## 🔧 Configuration

### Playwright Config

**File**: `playwright.config.ts`

Key settings:

- **Base URL**: `http://localhost:8000`
- **Timeout**: 60 seconds per test
- **Retries**: 2 retries in CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure
- **Browsers**: Chrome, Firefox, Safari, Mobile

### Test Data

**File**: `tests/helpers/test-data.ts`

Contains:

- Test customer info
- Shipping addresses
- Stripe test cards
- Product names

---

## 🐛 Debugging Tests

### Method 1: Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

### Method 2: UI Mode (Best for Development)

```bash
npm run test:e2e:ui
```

Features:

- Watch tests run
- Time travel through test steps
- Inspect DOM at any point
- See network requests
- View console logs

### Method 3: Debug Mode (Step Through)

```bash
npm run test:e2e:debug
```

Features:

- Pause at each step
- Inspect page state
- Run commands in console
- Step through test line by line

### Method 4: Screenshots

Tests automatically take screenshots:

- After each major step
- On failure

Find them in: `test-results/screenshots/`

---

## 📝 Writing New Tests

### 1. Create Test File

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from "@playwright/test"

test.describe("My Feature", () => {
  test("should do something", async ({ page }) => {
    // Your test code here
  })
})
```

### 2. Use Helper Functions

```typescript
import { addProductToCart, goToCheckout } from "../helpers/checkout-helpers"

test("my test", async ({ page }) => {
  await addProductToCart(page)
  await goToCheckout(page)
  // ... more steps
})
```

### 3. Take Screenshots

```typescript
await page.screenshot({
  path: "test-results/screenshots/my-step.png",
  fullPage: true,
})
```

### 4. Add Assertions

```typescript
// Check element is visible
await expect(page.locator("text=Success")).toBeVisible()

// Check URL
await expect(page).toHaveURL(/\/success/)

// Check text content
await expect(page.locator("h1")).toHaveText("Welcome")
```

---

## 🚨 Common Issues

### Issue: Tests Fail with "Timeout"

**Solution**: Increase timeout or check if app is running

```typescript
// In test
await page.waitForSelector('button', { timeout: 30000 });

// Or in config
timeout: 90 * 1000, // 90 seconds
```

### Issue: "Cannot find element"

**Solution**: Use better selectors or wait for element

```typescript
// Wait for element
await page.waitForSelector('button:has-text("Submit")')

// Use multiple selectors
const button = page
  .locator('button:has-text("Submit")')
  .or(page.locator('[type="submit"]'))
```

### Issue: Stripe Payment Fails

**Solution**: Check Stripe test mode is enabled

- Use test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### Issue: Screenshots Not Generated

**Solution**: Create directory first

```bash
mkdir -p test-results/screenshots
```

---

## 📊 Test Results

### Success Output

```
Running 5 tests using 1 worker

  ✓ checkout-stripe.spec.ts:10:3 › should complete checkout with Stripe (45s)
  ✓ checkout-stripe.spec.ts:45:3 › should display correct payment status (32s)
  ✓ checkout-cod.spec.ts:10:3 › should complete checkout with COD (28s)
  ✓ checkout-cod.spec.ts:40:3 › should display COD warning message (25s)
  ✓ checkout-cod.spec.ts:55:3 › should NOT show payment confirmed (22s)

  5 passed (2.5m)

To open last HTML report run:
  npx playwright show-report
```

### Failure Output

```
  ✗ checkout-stripe.spec.ts:10:3 › should complete checkout with Stripe (45s)

    Error: Timeout 30000ms exceeded.
    waiting for locator('button:has-text("Pay with Stripe")') to be visible

    Screenshot: test-results/screenshots/failure-1.png
    Video: test-results/videos/test-1.webm
```

---

## 🎓 Best Practices

### 1. Use Helper Functions

✅ Reuse common actions  
✅ Keep tests readable  
✅ Easy to maintain

### 2. Take Screenshots

✅ Document test flow  
✅ Debug failures  
✅ Visual proof

### 3. Use Descriptive Names

```typescript
// ❌ Bad
test("test 1", async ({ page }) => {})

// ✅ Good
test("should complete checkout with Stripe payment successfully", async ({
  page,
}) => {})
```

### 4. Clean Up After Tests

```typescript
test.beforeEach(async ({ page }) => {
  await clearCart(page)
})
```

### 5. Add Console Logs

```typescript
console.log("Step 1: Adding product to cart...")
await addProductToCart(page)
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## 🎯 Next Steps

1. **Run the tests**: `npm run test:e2e:ui`
2. **View the report**: `npm run test:e2e:report`
3. **Check screenshots**: `test-results/screenshots/`
4. **Add more tests**: Create new `.spec.ts` files

---

**Happy Testing!** 🚀
