# Vercel Environment Variable Setup

## Issue: Site deployed but no data showing

If your site is deployed but showing "Το περιεχόμενο αυτής της σελίδας προετοιμάζεται" (content is being prepared), it means the CMS data is not being fetched.

## Quick Fix: Set Environment Variable in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: `kallitechnia-updated` (or your project name)
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variable
Add the following environment variable:

- **Key:** `NEXT_PUBLIC_CMS_URL`
- **Value:** `https://cms.ftiaxesite.gr`
- **Environment:** Select all (Production, Preview, Development)

### Step 3: Redeploy
After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Make sure "Use existing Build Cache" is **unchecked** (to rebuild with new env vars)

## Verify Setup

After redeploying, check:
1. The site should now fetch data from CMS
2. Check browser console (F12) for any API errors
3. Verify CMS has published content:
   - Tenant with code: `kallitechnia`
   - Published "about" page
   - Published homepage

## Troubleshooting

### Still no data?

1. **Check CMS Access:**
   - Visit: `https://cms.ftiaxesite.gr/api/tenants?where[code][equals]=kallitechnia&limit=1`
   - Should return JSON with tenant data

2. **Check Vercel Build Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → View Build Logs
   - Look for any API errors

3. **Verify CMS has Published Content:**
   - Login to CMS admin: `https://cms.ftiaxesite.gr/admin`
   - Check that:
     - Tenant "kallitechnia" exists
     - Homepage is published (status: published)
     - Pages are published (status: published)

4. **Check CORS (if needed):**
   - CMS should allow requests from your Vercel domain
   - Check CMS CORS settings if API calls fail

## Alternative: Test Locally First

Before deploying, test locally:

1. Create `.env.local` file:
   ```
   NEXT_PUBLIC_CMS_URL=https://cms.ftiaxesite.gr
   ```

2. Run:
   ```bash
   pnpm dev
   ```

3. Visit `http://localhost:3000/about`
4. Check browser console for errors
5. If it works locally, the issue is environment variables in Vercel
