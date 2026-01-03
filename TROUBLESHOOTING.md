# Frontend Not Fetching Data from CMS - Troubleshooting Guide

## Quick Checks

### 1. Environment Variable in Vercel
**CRITICAL:** The `NEXT_PUBLIC_CMS_URL` environment variable MUST be set in Vercel.

**Steps:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify `NEXT_PUBLIC_CMS_URL` exists and equals `https://cms.ftiaxesite.gr`
5. Make sure it's set for **Production**, **Preview**, and **Development**
6. **Redeploy** after adding/changing environment variables (uncheck "Use existing Build Cache")

### 2. Test CMS Accessibility
Visit these URLs directly in your browser:

- **Tenants API:** https://cms.ftiaxesite.gr/api/tenants?where[code][equals]=kallitechnia&limit=1
- **Homepages API:** https://cms.ftiaxesite.gr/api/homepages?where[status][equals]=published&limit=1

**Expected:** Should return JSON data, not an error.

### 3. Check Debug Page
After deploying, visit: `https://your-site.vercel.app/debug`

This page will show:
- Current environment variable value
- API test results
- Error messages if any

### 4. Verify CMS Has Published Content
Login to CMS admin: https://cms.ftiaxesite.gr/admin

Check:
- ✅ Tenant exists with code: `kallitechnia`
- ✅ Homepage exists and status is **published** (not draft)
- ✅ Pages exist and status is **published**

### 5. Check Vercel Build Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. Click **View Build Logs**
4. Look for:
   - `[API] Fetching tenant from: ...`
   - `[API] Tenant response status: ...`
   - Any error messages

### 6. Check Browser Console
1. Visit your deployed site
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Look for API error messages
5. Go to **Network** tab
6. Filter by "api" or "tenants"
7. Check if requests are being made and their status

## Common Issues

### Issue: Environment Variable Not Set
**Symptom:** Debug page shows `NEXT_PUBLIC_CMS_URL: NOT SET`

**Fix:** Add environment variable in Vercel and redeploy

### Issue: 403 Forbidden
**Symptom:** API returns 403 status

**Fix:** 
- Check CMS access control allows public read access
- Verify `tenantAccess.ts` and `tenantReadOnly.ts` allow public access
- Update CMS on Hetzner server with latest code

### Issue: 404 Not Found
**Symptom:** API returns 404 status

**Fix:**
- Verify CMS URL is correct: `https://cms.ftiaxesite.gr`
- Check CMS is running on Hetzner server
- Verify API routes are accessible

### Issue: CORS Error
**Symptom:** Browser console shows CORS error

**Fix:**
- Check CMS CORS settings
- Verify CMS allows requests from your Vercel domain

### Issue: Network Error / Timeout
**Symptom:** Request fails or times out

**Fix:**
- Check CMS server is running: `pm2 status` on Hetzner
- Check CMS logs: `pm2 logs cmsftiaxesite`
- Verify CMS is accessible from internet

## Testing Locally

Before deploying to Vercel, test locally:

1. Create `.env.local` file:
   ```
   NEXT_PUBLIC_CMS_URL=https://cms.ftiaxesite.gr
   ```

2. Run:
   ```bash
   pnpm dev
   ```

3. Visit:
   - http://localhost:3000 (homepage)
   - http://localhost:3000/debug (debug page)
   - http://localhost:3000/about (about page)

4. Check browser console for API calls

If it works locally but not on Vercel, the issue is environment variables.

## Next Steps

1. ✅ Set `NEXT_PUBLIC_CMS_URL` in Vercel
2. ✅ Redeploy (without build cache)
3. ✅ Visit `/debug` page to see what's happening
4. ✅ Check Vercel build logs
5. ✅ Verify CMS has published content
6. ✅ Check browser console for errors
