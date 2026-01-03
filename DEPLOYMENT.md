# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository connected: `https://github.com/SidebySideWeb/kallitechnia-updated.git`

## Environment Variables

Set the following environment variable in Vercel:

- `NEXT_PUBLIC_CMS_URL` = `https://cms.ftiaxesite.gr` (or your CMS URL)

## Deployment Methods

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel:**
   ```bash
   pnpm vercel login
   ```

2. **Deploy to production:**
   ```bash
   pnpm vercel --prod
   ```

   Or deploy to preview first:
   ```bash
   pnpm vercel
   ```

3. **Set environment variables (if not set during deployment):**
   ```bash
   pnpm vercel env add NEXT_PUBLIC_CMS_URL production
   # Enter: https://cms.ftiaxesite.gr
   ```

### Method 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository: `SidebySideWeb/kallitechnia-updated`
3. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `pnpm build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `pnpm install` (auto-detected)
4. Add Environment Variable:
   - Key: `NEXT_PUBLIC_CMS_URL`
   - Value: `https://cms.ftiaxesite.gr`
5. Click **Deploy**

## Post-Deployment

After deployment, Vercel will provide you with:
- Production URL: `https://your-project.vercel.app`
- Preview URLs for each commit/PR

## Continuous Deployment

Once connected, Vercel will automatically deploy:
- Every push to `main` branch → Production
- Every pull request → Preview deployment

## Troubleshooting

### Build Fails
- Check that `NEXT_PUBLIC_CMS_URL` is set correctly
- Verify the CMS is accessible from Vercel's servers
- Check build logs in Vercel dashboard

### Images Not Loading
- Verify `next.config.mjs` has correct `remotePatterns` for your CMS domain
- Check that images are publicly accessible

### API Errors
- Ensure CMS access control allows public read access
- Verify CORS settings on CMS if needed
