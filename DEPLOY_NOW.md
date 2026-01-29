# Deploy reTHINKit.ai to Cloudflare - Quick Start

## ✅ What's Done

1. ✅ **GitHub repo created:** https://github.com/MrSlothuus/rethinkit-ai
2. ✅ **Code pushed:** 19 files (all HTML, CSS, JS)
3. ✅ **Worker deployed:** qblog-newsletter-api running
4. ✅ **Frontend updated:** API URLs point to production

---

## 🚀 Next: Deploy to Cloudflare Pages (3 Steps)

### Step 1: Create Pages Project (5 minutes)

**Go to:** https://dash.cloudflare.com

1. Click **"Workers & Pages"** in left sidebar
2. Click **"Create Application"**
3. Choose **"Pages"** tab
4. Click **"Connect to Git"**
5. **Connect GitHub** (authorize Cloudflare)
6. **Select repository:** `MrSlothuus/rethinkit-ai`
7. **Configure:**
   - Production branch: `main`
   - Build command: (leave empty)
   - Build output directory: `/`
8. Click **"Save and Deploy"**

**Wait ~2 minutes** for first deployment.

You'll get a URL like: `https://rethinkit-ai.pages.dev`

---

### Step 2: Move DNS to Cloudflare (15 minutes + wait)

**In Cloudflare Dashboard:**

1. Click **"Add a Site"** (top right)
2. Enter: `rethinkit.ai`
3. Choose **"Free"** plan
4. **Wait** while Cloudflare scans DNS
5. Review DNS records (should auto-detect current setup)
6. Click **"Continue"**
7. **Cloudflare gives you 2 nameservers** like:
   ```
   amber.ns.cloudflare.com
   dora.ns.cloudflare.com
   ```

**At Dandomain (your current registrar):**

1. Log in to Dandomain account
2. Find DNS or Nameserver settings for `rethinkit.ai`
3. **Replace:**
   - FROM: `ns.dandomain.dk`, `ns2.dandomain.dk`
   - TO: Cloudflare's nameservers (from step 7 above)
4. Save changes

**Wait:** 2-48 hours (usually 1-2 hours)

**Check status:**
```bash
dig rethinkit.ai NS +short
# Should show Cloudflare nameservers when ready
```

---

### Step 3: Connect Custom Domain (After DNS Active)

**When Cloudflare shows domain as "Active":**

1. Go to **Workers & Pages → rethinkit-ai (your Pages project)**
2. Click **"Custom Domains"** tab
3. Click **"Set up a custom domain"**
4. Enter: `rethinkit.ai`
5. Click **"Continue"**
6. Cloudflare automatically:
   - Creates CNAME record
   - Issues SSL certificate
   - Sets up www redirect

**Done!** Your site is now live at `https://rethinkit.ai` 🎉

---

## 🔧 Step 4: Connect Worker to Custom Domain

**Add API route after DNS is active:**

### Via Dashboard:
1. **Workers & Pages → qblog-newsletter-api**
2. **Settings → Triggers → Routes**
3. **Add Route:**
   - Route: `rethinkit.ai/api/newsletter/*`
   - Zone: `rethinkit.ai`
4. Click **"Add Route"**

### Or via CLI:
```bash
cd ~/clawd/projects/rethinkit/qblog-worker
```

Edit `wrangler.toml`, add:
```toml
[[routes]]
pattern = "rethinkit.ai/api/newsletter/*"
zone_name = "rethinkit.ai"
```

Then:
```bash
wrangler deploy
```

---

## 📝 Step 5: Update Frontend (Final)

**After Worker route is live:**

Edit `qblog.html` line 251:
```javascript
// Change from:
const API_URL = 'https://qblog-newsletter-api.ulrich-8db.workers.dev';

// To:
const API_URL = 'https://rethinkit.ai/api/newsletter';
```

**Deploy:**
```bash
cd ~/clawd/projects/rethinkit
git add qblog.html
git commit -m "Use custom domain for API"
git push
```

Cloudflare Pages auto-deploys in ~30 seconds.

---

## ✅ You're Done!

**Your stack:**
- ✅ `rethinkit.ai` → Cloudflare Pages (static site)
- ✅ `rethinkit.ai/api/newsletter/*` → Cloudflare Workers (qBlog API)
- ✅ Auto-deploy on every git push
- ✅ Global CDN, SSL, DDoS protection
- ✅ $0/month (free tier)

---

## 📧 Bonus: Email DNS (Optional but Recommended)

**After domain is active, add these records for better email deliverability:**

**SPF:**
```
Type: TXT
Name: @
Value: v=spf1 include:relay.mailchannels.net ~all
```

**DMARC:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@rethinkit.ai
```

Add in: Cloudflare Dashboard → DNS → Records → Add Record

---

## 🧪 Test Everything

**1. Test Pages:**
```bash
curl -I https://rethinkit.ai
# Should return 200 OK
```

**2. Test Worker API:**
```bash
curl https://rethinkit.ai/api/newsletter/health
# Should return: {"status":"ok","service":"qBlog Newsletter API"}
```

**3. Test Full Flow:**
1. Visit `https://rethinkit.ai/qblog.html`
2. Sign up via Clerk
3. Subscribe to topics
4. Check Clerk dashboard for metadata
5. Trigger newsletter cron (or wait for 8 AM UTC)
6. Verify email delivery

---

## 📞 Need Help?

**Check DNS propagation:**
- https://dnschecker.org/#NS/rethinkit.ai

**Cloudflare Dashboard:**
- https://dash.cloudflare.com

**GitHub Repo:**
- https://github.com/MrSlothuus/rethinkit-ai

---

**START HERE:** https://dash.cloudflare.com → Create Pages Project 🚀
