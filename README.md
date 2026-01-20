# Sixthgear Frontend - Next.js Storefront

> **Modern, responsive e-commerce storefront for motorcycle parts, service booking, and café**

This is the customer-facing website for Sixthgear Moto Supply & Café, built with Next.js 15 and React 19.

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 About

Sixthgear Frontend is a modern, high-performance e-commerce storefront that provides:

- **Online Shopping** - Browse and purchase motorcycle parts, accessories, and gear
- **Service Booking** - Schedule motorcycle maintenance and repairs (coming soon)
- **Café Experience** - View menu and order coffee products (coming soon)
- **User Accounts** - Manage profile, orders, and addresses
- **Community Hub** - Read rider stories, testimonials, and team profiles

---

## ✨ Features

### Shopping Experience
- ✅ Product catalog with search and filtering
- ✅ Product detail pages with variants (size, color)
- ✅ Shopping cart with real-time updates
- ✅ Secure checkout process
- ✅ Guest and registered checkout
- ✅ Order tracking and history

### User Features
- ✅ User registration and login
- ✅ Profile management
- ✅ Address book
- ✅ Order history
- ✅ Password reset

### Content & Marketing
- ✅ Dynamic homepage with 18 sections
- ✅ Marketing banners and popups
- ✅ Customer testimonials
- ✅ Rider stories and blog
- ✅ Team member profiles
- ✅ Franchise information
- ✅ Service showcase
- ✅ Café showcase

### Technical Features
- ✅ Server-side rendering (SSR)
- ✅ Incremental Static Regeneration (ISR)
- ✅ Image optimization
- ✅ Mobile-responsive design
- ✅ SEO-friendly
- ✅ Fast page loads (< 3s)
- ✅ Accessibility compliant

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 3
- **API Client:** Medusa JS SDK
- **Language:** TypeScript
- **Package Manager:** npm/yarn
- **Deployment:** Vercel (recommended)

---

## 📦 Prerequisites

Before you begin, ensure you have:

### Required Software

1. **Node.js** (v20 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify npm: `npm --version`
   - Or install yarn: `npm install -g yarn`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Required Services

1. **Sixthgear Backend** (must be running)
   - See backend README for setup instructions
   - Default URL: http://localhost:9000

2. **Publishable API Key** (from backend)
   - Create in Medusa Admin: Settings > Publishable API Keys
   - You'll need this for the `.env` file

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone the main project (if not already done)
git clone https://github.com/yourusername/sixthgear.git

# Navigate to frontend directory
cd sixthgear/sixthgear-frontend
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This will install all required packages including:
- Next.js 15
- React 19
- Tailwind CSS
- Medusa JS SDK
- And all other dependencies

---

## ⚙️ Configuration

### Step 1: Set Up Environment Variables

1. **Copy the template file:**

```bash
# Windows
copy .env.template .env

# Mac/Linux
cp .env.template .env
```

2. **Edit the `.env` file:**

```env
# Medusa Backend Configuration
# The URL of your Medusa backend server
# Development: http://localhost:9000
# Production: https://api.yourdomain.com
MEDUSA_BACKEND_URL=http://localhost:9000

# Required: Publishable API Key from Medusa Admin
# Get this from: Medusa Admin > Settings > Publishable API Keys
# It should start with "pk_"
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here

# Default Region
# The default region ID for the storefront (usually country code)
NEXT_PUBLIC_DEFAULT_REGION=ph

# Optional: Medusa Cloud S3 Configuration
# Only needed if using Medusa Cloud for file storage
MEDUSA_CLOUD_S3_HOSTNAME=
MEDUSA_CLOUD_S3_PATHNAME=

# Optional: Revalidation Secret
# Secret for on-demand revalidation of Next.js cache
REVALIDATE_SECRET=
```

### Step 2: Get Your Publishable API Key

1. **Start the backend** (if not already running):
```bash
cd ../sixthgear-backend
npm run dev
```

2. **Open Medusa Admin:**
   - Go to http://localhost:9000/app
   - Log in with your admin credentials

3. **Create API Key:**
   - Navigate to **Settings** > **Publishable API Keys**
   - Click **"Create API Key"**
   - Give it a name (e.g., "Storefront")
   - Select the sales channel (usually "Default Sales Channel")
   - Click **"Save"**
   - Copy the generated key (starts with `pk_`)

4. **Update `.env` file:**
```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_a8afb55768f5ef3e1c83c7cc8d69185b5314906196df52fea4fca5ce199343a6
```

### Step 3: Verify Backend Connection

Make sure your backend is running and accessible:

```bash
# Test backend connection
curl http://localhost:9000/health

# Should return: {"status":"ok"}
```

---

## 🏃 Running the Project

### Step 1: Start the Development Server

```bash
# Start in development mode
npm run dev

# Or with yarn
yarn dev
```

The frontend will start on **http://localhost:8000**

You should see:
```
▲ Next.js 15.5.9
- Local:        http://localhost:8000
- Environments: .env

✓ Ready in 2.5s
```

### Step 2: Open in Browser

1. Open your browser and go to: **http://localhost:8000**
2. You should see the Sixthgear homepage
3. Browse products, add to cart, and test the checkout flow!

### Step 3: Test Key Features

**Homepage:**
- Hero section with call-to-action
- Product sections (Hot Deals, Best Sellers, New Arrivals)
- Services showcase
- Customer testimonials
- Team profiles
- Franchise information

**Shopping:**
- Browse products: http://localhost:8000/store
- View product details
- Add items to cart
- Proceed to checkout

**User Account:**
- Register: http://localhost:8000/account/register
- Login: http://localhost:8000/account/login
- View profile and orders

---

## 📁 Project Structure

```
sixthgear-frontend/
├── public/                          # Static files
│   ├── images/                     # Images and assets
│   │   ├── favicon/               # Favicon files
│   │   ├── logo/                  # Logo variations
│   │   ├── brands/                # Brand logos
│   │   └── homepage/              # Homepage images
│   └── ...
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── [countryCode]/         # Country-specific routes
│   │   │   ├── (main)/            # Main layout group
│   │   │   │   ├── page.tsx       # Homepage
│   │   │   │   ├── store/         # Product listing
│   │   │   │   ├── products/      # Product details
│   │   │   │   ├── cart/          # Shopping cart
│   │   │   │   ├── checkout/      # Checkout flow
│   │   │   │   ├── account/       # User account
│   │   │   │   ├── contact/       # Contact page
│   │   │   │   └── ...
│   │   │   └── layout.tsx         # Country layout
│   │   ├── layout.tsx             # Root layout
│   │   └── not-found.tsx          # 404 page
│   ├── lib/                        # Utilities and helpers
│   │   ├── config.ts              # Medusa SDK configuration
│   │   ├── data/                  # Data fetching functions
│   │   │   ├── products.ts        # Product queries
│   │   │   ├── cart.ts            # Cart operations
│   │   │   ├── customer.ts        # Customer data
│   │   │   ├── marketing.ts       # Marketing content
│   │   │   └── ...
│   │   ├── util/                  # Utility functions
│   │   └── company-data.ts        # Company information
│   ├── modules/                    # Feature modules
│   │   ├── home/                  # Homepage components
│   │   │   └── components/
│   │   │       ├── hero/          # Hero section
│   │   │       ├── about/         # About section
│   │   │       ├── our-services/  # Services showcase
│   │   │       ├── our-team/      # Team profiles
│   │   │       ├── brands/        # Brand logos
│   │   │       ├── franchise/     # Franchise info
│   │   │       └── ...
│   │   ├── products/              # Product components
│   │   ├── cart/                  # Cart components
│   │   ├── checkout/              # Checkout components
│   │   ├── account/               # Account components
│   │   ├── layout/                # Layout components
│   │   │   ├── templates/
│   │   │   │   ├── nav/          # Navigation
│   │   │   │   └── footer/       # Footer
│   │   │   └── ...
│   │   └── marketing/             # Marketing components
│   ├── styles/                     # Global styles
│   │   └── globals.css            # Tailwind CSS
│   └── types/                      # TypeScript types
├── .env                            # Environment variables (create from template)
├── .env.template                   # Environment template
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

---

## 🎨 Customization

### Updating Company Information

Edit `src/lib/company-data.ts` to update:
- Company name and description
- Services offered
- Team members
- Contact information
- Business hours

### Styling

The project uses Tailwind CSS. Main configuration in:
- `tailwind.config.js` - Tailwind configuration
- `src/styles/globals.css` - Global styles
- Brand colors:
  - Primary: `#fca311` (Orange/Yellow)
  - Secondary: `#0A0A0A` (Dark Black)
  - Accent: `#F16D34` (Orange)

### Adding New Pages

1. Create a new file in `src/app/[countryCode]/(main)/your-page/page.tsx`
2. Add metadata and content
3. Link to it from navigation or other pages

Example:
```tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Page",
  description: "Your page description",
}

export default function YourPage() {
  return (
    <div>
      <h1>Your Page Content</h1>
    </div>
  )
}
```

---

## 🚀 Deployment

### Recommended Platform: Vercel

Vercel is the easiest way to deploy Next.js applications.

#### Step 1: Prepare for Deployment

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Update environment variables for production:**
```env
MEDUSA_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_production_key
NEXT_PUBLIC_DEFAULT_REGION=ph
```

#### Step 2: Deploy to Vercel

1. **Sign up at Vercel:**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Select `sixthgear-frontend` directory

3. **Configure Project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `sixthgear-frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add all variables from your `.env` file
   - Use production values (not localhost)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Your site will be live at `https://your-project.vercel.app`

6. **Add Custom Domain (Optional):**
   - Go to Project Settings > Domains
   - Add your custom domain (e.g., sixthgearmoto.com)
   - Follow DNS configuration instructions

### Alternative Platforms

**Netlify:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

**Railway:**
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

**DigitalOcean App Platform:**
1. Create app from GitHub
2. Configure build settings
3. Add environment variables
4. Deploy

### Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Update `MEDUSA_BACKEND_URL` to production URL
- [ ] Update `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` to production key
- [ ] Test all pages and features
- [ ] Verify checkout flow works
- [ ] Check mobile responsiveness
- [ ] Test payment processing
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up analytics (Google Analytics)
- [ ] Test performance (Lighthouse score)
- [ ] Set up error monitoring (Sentry)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to fetch products"

**Solution:**
- Check if backend is running: `curl http://localhost:9000/health`
- Verify `MEDUSA_BACKEND_URL` in `.env`
- Check if publishable key is correct
- Look at browser console for errors

#### 2. "Invalid publishable key"

**Solution:**
- Verify the key starts with `pk_`
- Check if key is from the correct backend
- Regenerate key in Medusa Admin if needed
- Restart frontend after updating `.env`

#### 3. "Port 8000 already in use"

**Solution:**
- Check what's using the port: `netstat -ano | findstr :8000` (Windows)
- Kill the process or use a different port:
```bash
npm run dev -- -p 3000
```

#### 4. "Module not found" errors

**Solution:**
- Delete `node_modules` and `.next`:
```bash
rm -rf node_modules .next
npm install
```

#### 5. "Images not loading"

**Solution:**
- Check if images exist in `public/images/`
- Verify image paths are correct
- Check `next.config.js` for image domain configuration
- Clear Next.js cache: `rm -rf .next`

#### 6. "Checkout not working"

**Solution:**
- Verify backend is running
- Check if region is configured in backend
- Ensure publishable key has correct permissions
- Check browser console for API errors

### Getting Help

- **Next.js Documentation:** https://nextjs.org/docs
- **Medusa Documentation:** https://docs.medusajs.com
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Sixthgear Support:** info@sixthgear.ph

---

## 📝 Scripts Reference

```bash
# Development
npm run dev              # Start development server (port 8000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Analysis
npm run analyze          # Analyze bundle size
```

---

## 🧪 Testing

### Manual Testing Checklist

**Homepage:**
- [ ] Hero section loads correctly
- [ ] All sections display properly
- [ ] Images load correctly
- [ ] Links work
- [ ] Mobile responsive

**Products:**
- [ ] Product listing loads
- [ ] Filters work
- [ ] Sorting works
- [ ] Product details display
- [ ] Add to cart works

**Cart:**
- [ ] Items display correctly
- [ ] Quantity updates work
- [ ] Remove items works
- [ ] Total calculates correctly

**Checkout:**
- [ ] Address form works
- [ ] Shipping selection works
- [ ] Payment form displays
- [ ] Order confirmation shows

**Account:**
- [ ] Registration works
- [ ] Login works
- [ ] Profile updates work
- [ ] Order history displays
- [ ] Address management works

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential.  
© 2026 Sixthgear Moto Supply & Café. All rights reserved.

---

## 📞 Support

- **Email:** info@sixthgear.ph
- **Phone:** 0995 093 0157
- **Address:** 3610 Bautista St, Makati City, Metro Manila
- **Website:** https://sixthgearmoto.com
- **Facebook:** facebook.com/camille.sixthgear
- **Instagram:** @sixthgear_moto_supply
- **TikTok:** @sixthgear.moto.su

---

**Happy Coding! 🏍️☕**
