# Deploy reTHINKit.ai - Keep Dandomain DNS

**Goal:** Host website on Cloudflare Pages, keep DNS and email at Dandomain

---

## ✅ What's Ready

- ✅ GitHub repo: https://github.com/MrSlothuus/rethinkit-ai
- ✅ qBlog API Worker: https://qblog-newsletter-api.ulrich-8db.workers.dev
- ✅ Frontend updated to use Worker API

---

## 🚀 Deploy Steps

### Step 1: Create Cloudflare Pages Project (5 min)

**Go to:** https://dash.cloudflare.com

1. Click **"Workers & Pages"** (left sidebar)
2. Click **"Create Application"**
3. Choose **"Pages"** tab
4. Click **"Connect to Git"**
5. **Authorize GitHub** (if needed)
6. **Select repo:** `MrSlothuus/rethinkit-ai`
7. **Configure:**
   - Production branch: `main`
   - Build command: **(leave empty - static HTML)**
   - Build output directory: `/`
   - Root directory: `/`
8. Click **"Save and Deploy"**

**Wait ~2 minutes.** You'll get a URL like:
```
https://rethinkit-ai.pages.dev
```

✅ **Test it:** Visit that URL - your site should be live!

---

### Step 2: Add Custom Domain in Cloudflare (2 min)

**In your Pages project:**

1. Click **"Custom Domains"** tab
2. Click **"Set up a custom domain"**
3. Enter: `rethinkit.ai`
4. **Cloudflare will say:** "We need to verify you own this domain"
5. It will show you **DNS records to add**

**Important:** Write down the CNAME record it shows. It will be something like:
```
Type: CNAME
Name: rethinkit.ai (or @)
Value: rethinkit-ai.pages.dev
```

---

### Step 3: Add DNS Records at Dandomain (5 min)

**Log in to Dandomain control panel:**

1. Go to DNS management for `rethinkit.ai`
2. **Add/Update CNAME record:**
   ```
   Type: CNAME
   Name: @ (or root/apex - depending on Dandomain's interface)
   Value: rethinkit-ai.pages.dev
   TTL: 3600 (or Auto)
   ```

3. **If Dandomain doesn't support CNAME for root domain:**
   Use A records instead (Cloudflare Pages IPs):
   ```
   Type: A
   Name: @
   Value: 192.0.2.1  (Cloudflare will show the correct IPs in Pages dashboard)
   
   Type: AAAA (IPv6)
   Name: @
   Value: 100::  (Cloudflare will show the correct IPv6)
   ```

4. **Add www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: rethinkit-ai.pages.dev
   ```

5. **Save** changes

**Wait:** 5-30 minutes for DNS propagation

---

### Step 4: Verify Custom Domain (After DNS updates)

**Back in Cloudflare Pages:**

1. **Custom Domains** tab
2. Check status of `rethinkit.ai`
3. When DNS propagates, Cloudflare will:
   - ✅ Verify domain ownership
   - ✅ Issue SSL certificate (automatic)
   - ✅ Activate domain

**Test:**
```bash
curl -I https://rethinkit.ai
# Should return 200 OK with Cloudflare headers
```

---

## ✅ Final Architecture

```
┌──────────────────────────────────────────┐
│  rethinkit.ai (Dandomain DNS)            │
│  CNAME → rethinkit-ai.pages.dev          │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│  Cloudflare Pages                        │
│  Static Website (HTML/CSS/JS)            │
└──────────────────────────────────────────┘
                    ↓
              API Calls to:
┌──────────────────────────────────────────┐
│  qblog-newsletter-api.ulrich-8db.       │
│  workers.dev (Cloudflare Worker)         │
└──────────────────────────────────────────┘
```

**Benefits:**
- ✅ DNS stays at Dandomain (email unaffected)
- ✅ Website on Cloudflare CDN (fast, secure)
- ✅ API on Workers (serverless, global)
- ✅ Auto-deploy on git push
- ✅ Free SSL certificate

---

## 🔧 Alternative: Subdomain for API (Optional)

If you want a nicer API URL, add at Dandomain:

```
Type: CNAME
Name: api
Value: qblog-newsletter-api.ulrich-8db.workers.dev
```

Then update `qblog.html`:
```javascript
const API_URL = 'https://api.rethinkit.ai';
```

---

## 📧 Email Stays at Dandomain

**No changes needed!** Your email setup remains exactly as is:
- MX records → Dandomain email servers
- SPF/DKIM → Existing configuration
- Email accounts → Unchanged

---

## 🧪 Testing Checklist

After deployment:

- [ ] Visit `https://rethinkit-ai.pages.dev` (should work immediately)
- [ ] Visit `https://rethinkit.ai` (after DNS propagation)
- [ ] Test newsletter signup: `rethinkit.ai/qblog.html`
- [ ] Verify API calls work (check browser console)
- [ ] Sign up, subscribe, check Clerk metadata

---

## 🔄 Future Updates

**Make changes to your site:**

```bash
cd ~/clawd/projects/rethinkit
# Edit files
git add .
git commit -m "Update content"
git push
```

**Cloudflare Pages auto-deploys** in ~30 seconds!

---

## 📚 DNS Records Summary

**At Dandomain for rethinkit.ai:**

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| CNAME/A | @ | rethinkit-ai.pages.dev | Main site |
| CNAME | www | rethinkit-ai.pages.dev | WWW redirect |
| CNAME | api | qblog-newsletter-api.ulrich-8db.workers.dev | API (optional) |
| MX | @ | (existing) | Email - don't touch |
| TXT | @ | (existing SPF) | Email - don't touch |

---

**START:** https://dash.cloudflare.com → Create Pages Project 🚀
