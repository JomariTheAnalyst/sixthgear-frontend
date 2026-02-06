# Playwright Setup Guide - Quick Start

## 🚀 Installation Steps

### Step 1: Install Playwright (5 minutes)

```bash
cd sixthgear-frontend

# Install Playwright
npm install -D @playwright/test

# Install browsers (Chrome, Firefox, Safari)
npx playwright install
```

**What this does**:

- Installs Playwright testing framework
- Downloads Chrome, Firefox, and Safari browsers
- Sets up everything needed for testing

---

### Step 2: Verify Installation

```bash
# Check Playwright version
npx playwright --version

# Should show: Version 1.x.x
```

---

### Step 3: Start Your Application

**Terminal 1 - Backend**:

```bash
cd sixthgear-backend
docker-compose up
```

**Terminal 2 - Frontend**:

```bash
cd sixthgear-frontend
npm run dev
```

**Wait for**:

- Backend: `✓ Ready on http://localhost:9000`
- Frontend: `✓ Ready on http://localhost:8000`

---

### Step 4: Run Your First Test

```bash
# Run tests with UI (recommended for first time)
npm run test:e2e:ui
```

**What you'll see**:

1. Playwright UI opens
2. List of tests on the left
3. Click "Run all" button
4. Watch tests execute in real-time!

---

## 🎯 Quick Test Commands

### For Development (See What's Happening)

```bash
# Best for development - Interactive UI
npm run test:e2e:ui

# See browser while testing
npm run test:e2e:headed

# Step through test line by line
npm run test:e2e:debug
```

### For Quick Checks (Headless)

```bash
# Run all tests (no browser window)
npm run test:e2e

# Run only Stripe tests
npm run test:checkout:stripe

# Run only COD tests
npm run test:checkout:cod
```

### View Results

```bash
# Open HTML report
npm run test:e2e:report

# View screenshots
# Windows: explorer test-results\screenshots
# Mac/Linux: open test-results/screenshots
```

---

## 📊 What Gets Generated

After running tests, you'll have:

```
sixthgear-frontend/
├── playwright-report/              # 📊 HTML Report
│   └── index.html                 # Open this in browser
│
├── test-results/
│   ├── screenshots/               # 📸 Screenshots
│   │   ├── 01-product-added.png
│   │   ├── 02-checkout-page.png
│   │   ├── 03-shipping-filled.png
│   │   ├── 04-shipping-selected.png
│   │   └── 05-order-confirmed.png
│   │
│   ├── results.json               # 📄 JSON Results
│   └── junit.xml                  # 📄 JUnit Format
│
└── videos/                         # 🎥 Videos (on failure)
```

---

## ✅ Verify Everything Works

### Test 1: Stripe Checkout

```bash
npm run test:checkout:stripe
```

**Expected**:

- ✅ Test passes
- ✅ Screenshots generated
- ✅ Report shows success

### Test 2: COD Checkout

```bash
npm run test:checkout:cod
```

**Expected**:

- ✅ Test passes
- ✅ COD warning verified
- ✅ Screenshots generated

### Test 3: View Report

```bash
npm run test:e2e:report
```

**Expected**:

- Browser opens
- Shows test results
- Can view screenshots
- Can see test timeline

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@playwright/test'"

**Solution**:

```bash
npm install -D @playwright/test
```

### Issue: "Browsers not installed"

**Solution**:

```bash
npx playwright install
```

### Issue: "Connection refused" or "Timeout"

**Solution**: Make sure app is running

```bash
# Check frontend
curl http://localhost:8000

# Check backend
curl http://localhost:9000/health
```

### Issue: Tests fail with "Element not found"

**Solution**: App might be slow to load

- Increase timeout in `playwright.config.ts`
- Or wait for app to fully start before running tests

### Issue: Stripe payment fails

**Solution**: Check test mode

- Stripe must be in TEST mode
- Use test card: `4242 4242 4242 4242`

---

## 📝 Next Steps

1. ✅ **Installation complete**
2. ✅ **Tests running**
3. ✅ **Reports generated**

**Now you can**:

- Run tests before deploying
- Add more test scenarios
- Integrate with CI/CD
- Show reports to team

---

## 🎓 Quick Tips

### Tip 1: Use UI Mode for Development

```bash
npm run test:e2e:ui
```

- See tests run
- Pause and inspect
- Time travel through steps

### Tip 2: Take Screenshots

Tests automatically take screenshots at each step!

### Tip 3: Check Reports

```bash
npm run test:e2e:report
```

Visual proof that tests passed!

### Tip 4: Run Specific Tests

```bash
# Run one test file
npx playwright test checkout-stripe

# Run one test by name
npx playwright test -g "should complete checkout"
```

---

## 🎉 You're Ready!

Your Playwright setup is complete. You can now:

- ✅ Run automated tests
- ✅ Generate reports
- ✅ Take screenshots
- ✅ Debug issues
- ✅ Verify features work

**Start testing**: `npm run test:e2e:ui`

---

## 📞 Need Help?

Check the detailed guide: `tests/README.md`

Or run:

```bash
npx playwright --help
```
