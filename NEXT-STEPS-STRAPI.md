# Next Steps - Strapi CMS Integration

## Quick Start Checklist

Follow these steps to complete the Strapi CMS integration for the Hero section.

---

## ✅ Step 1: Verify Docker Services Running

```bash
# Check if all services are running
docker compose ps

# Expected output:
# - sixthgear-redis (running)
# - sixthgear-medusa (running)
# - sixthgear-strapi-db (running)
# - sixthgear-strapi (running)

# If not running, start them:
docker compose up -d
```

---

## ✅ Step 2: Access Strapi Admin

1. Open browser: http://localhost:1337/admin

2. **First time setup:**
   - Create admin account
   - Email: your-email@example.com
   - Password: (choose a strong password)
   - Name: Your Name
   - Click "Let's start"

3. **Already have account:**
   - Log in with your credentials

---

## ✅ Step 3: Create Content Type Structure

### 3.1 Create "Home" Single Type

1. Click **Content-Type Builder** (left sidebar)
2. Click **"Create new single type"**
3. Display name: `Home`
4. Click **Continue**

### 3.2 Add Dynamic Zone

1. Click **"Add another field to this single type"**
2. Select **"Dynamic Zone"**
3. Name: `blocks`
4. Click **"Add components to the zone"**
5. Click **"Create new component"**

### 3.3 Create Hero Component

1. **Component settings:**
   - Display name: `Hero`
   - Category: `sections` (type it, will create new)
   - Icon: Choose any (e.g., star ⭐)
   - Click **Continue**

2. **Add these 8 fields:**

   | Order | Field Type   | Name                 | Settings      |
   | ----- | ------------ | -------------------- | ------------- |
   | 1     | Text (short) | `trust_badge`        | Required      |
   | 2     | Text (long)  | `title`              | Required      |
   | 3     | Text (long)  | `description`        | Required      |
   | 4     | Text (short) | `primary_cta_text`   | Required      |
   | 5     | Text (short) | `primary_cta_link`   | Required      |
   | 6     | Text (short) | `secondary_cta_text` | Required      |
   | 7     | Text (short) | `secondary_cta_link` | Required      |
   | 8     | Boolean      | `enabled`            | Default: true |

3. Click **Finish** after adding all fields
4. Click **Save** (top right)

### 3.4 Restart Strapi

```bash
# Required after content type changes
docker compose restart strapi

# Wait 30 seconds for Strapi to restart
# Check logs if needed:
docker compose logs -f strapi
```

---

## ✅ Step 4: Generate API Token

1. In Strapi admin, go to **Settings** → **API Tokens**
2. Click **"Create new API Token"**
3. Configure:
   - **Name:** `Frontend Access`
   - **Description:** `Token for Next.js frontend to fetch content`
   - **Token duration:** `Unlimited`
   - **Token type:** `Read-only`
4. Click **Save**
5. **IMPORTANT:** Copy the token immediately (you won't see it again!)

### 4.1 Add Token to Frontend

1. Open `sixthgear-frontend/.env`
2. Replace the empty `STRAPI_TOKEN=` line:
   ```env
   STRAPI_TOKEN=paste_your_token_here
   ```
3. Save the file

---

## ✅ Step 5: Add Hero Content

1. Go to **Content Manager** → **Single Types** → **Home**
2. Click **"Add a component"** in the blocks zone
3. Select **Hero** component
4. Fill in the content:

   ```
   Trust Badge:
   Trusted by 500+ Riders

   Title:
   Best Bike
   Repair & Service

   Description:
   Professional servicing, repairs, detailing & performance upgrades. Trusted by riders for precision and care.

   Primary CTA Text:
   More About Us

   Primary CTA Link:
   /about

   Secondary CTA Text:
   View Services

   Secondary CTA Link:
   /services

   Enabled:
   ✓ (checked)
   ```

5. Click **Save** (top right)
6. Click **Publish** (top right)

---

## ✅ Step 6: Test the Integration

### 6.1 Test Strapi API

Open in browser or use PowerShell:

```powershell
# Replace YOUR_TOKEN with the token from Step 4
$token = "YOUR_TOKEN"
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:1337/api/home?populate[blocks]=*" -Headers $headers | ConvertTo-Json -Depth 10
```

**Expected:** JSON response with hero content

### 6.2 Test Frontend

1. **Start frontend dev server:**

   ```bash
   cd sixthgear-frontend
   npm run dev
   ```

2. **Open browser:** http://localhost:8000 (or your configured port)

3. **Verify:**
   - Hero section displays content from Strapi
   - Trust badge shows your text
   - Title shows your heading
   - Description shows your text
   - Buttons show your CTA text

### 6.3 Test Content Updates

1. Go back to Strapi admin
2. Edit the Hero content (change title or description)
3. Save and Publish
4. Wait 60 seconds
5. Refresh frontend page
6. **Verify:** Changes appear on the page

### 6.4 Test Fallback

1. Stop Strapi: `docker compose stop strapi`
2. Refresh frontend page
3. **Verify:** Hero still displays (using fallback values)
4. Restart Strapi: `docker compose start strapi`

---

## ✅ Step 7: Verify Everything Works

### Checklist

- [ ] Strapi admin accessible at http://localhost:1337/admin
- [ ] "Home" single type created with hero component
- [ ] API token generated and added to `sixthgear-frontend/.env`
- [ ] Hero content added and published in Strapi
- [ ] Frontend shows CMS content (not hardcoded defaults)
- [ ] Content updates reflect within 60 seconds
- [ ] Stopping Strapi shows fallback content (graceful)
- [ ] No errors in browser console
- [ ] No errors in terminal logs

---

## 🎉 Success!

If all checks pass, your Strapi CMS integration is complete!

### What You Can Do Now

1. **Update content anytime:**
   - Log in to Strapi admin
   - Edit Home → Hero component
   - Save and Publish
   - Changes appear within 60 seconds

2. **Disable CMS content:**
   - Uncheck "Enabled" in Hero component
   - Frontend will use fallback values

3. **Add more content types:**
   - Follow similar pattern for other sections
   - See `STRAPI-CONTENT-STRUCTURE.md` for ideas

---

## 🐛 Troubleshooting

### Issue: Frontend still shows hardcoded content

**Solutions:**

1. Verify API token is correct in `.env`
2. Check content is published (not draft) in Strapi
3. Restart frontend dev server
4. Clear browser cache (Ctrl+Shift+R)
5. Wait 60 seconds for ISR revalidation

### Issue: Strapi admin not loading

**Solutions:**

1. Check Strapi is running: `docker compose ps`
2. Check logs: `docker compose logs strapi`
3. Restart Strapi: `docker compose restart strapi`
4. Check port 1337 is not in use

### Issue: API returns 403 Forbidden

**Solutions:**

1. Verify token is correct
2. Check token type is "Read-only" or higher
3. Regenerate token if needed

### Issue: Content not updating after 60 seconds

**Solutions:**

1. Hard refresh browser (Ctrl+Shift+R)
2. Check content is published in Strapi
3. Check frontend logs for errors
4. Verify STRAPI_URL is correct

---

## 📚 Documentation

- **Setup Guide:** `STRAPI-HERO-SETUP-GUIDE.md` - Detailed setup instructions
- **Content Structure:** `STRAPI-CONTENT-STRUCTURE.md` - API reference
- **Implementation Summary:** `STRAPI-INTEGRATION-SUMMARY.md` - Technical overview

---

## 🚀 Production Deployment

When ready to deploy to production:

1. **Deploy Strapi:**
   - Use Railway, Heroku, or VPS
   - Use production database (not Docker Postgres)
   - Enable HTTPS
   - Generate production API token

2. **Update Vercel Environment Variables:**

   ```env
   STRAPI_URL=https://your-strapi-domain.com
   STRAPI_TOKEN=your_production_token
   ```

3. **Redeploy frontend** on Vercel

4. **Test production** site

---

**Need Help?**

- Check troubleshooting section above
- Review documentation files
- Check Docker logs: `docker compose logs`
- Check Strapi docs: https://docs.strapi.io

---

**Last Updated:** January 22, 2025
