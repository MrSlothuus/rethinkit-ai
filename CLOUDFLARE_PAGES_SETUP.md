# Cloudflare Pages Setup for reTHINKit.ai

**Repository:** https://github.com/MrSlothuus/rethinkit-ai  
**Goal:** Deploy static site to Cloudflare Pages + use custom domain rethinkit.ai

---

## ✅ Step 1: GitHub Repository Created

**Repo:** `MrSlothuus/rethinkit-ai`  
**Branch:** `main`  
**Files:** 19 files (HTML, CSS, JS, assets)

---

## 📋 Step 2: Create Cloudflare Pages Project

### Via Cloudflare Dashboard (Recommended)

1. **Go to:** https://dash.cloudflare.com
2. **Navigate to:** Workers & Pages → Create Application → Pages → Connect to Git
3. **Connect GitHub:** Authorize Cloudflare to access your GitHub account
4. **Select Repository:** `MrSlothuus/rethinkit-ai`
5. **Configure Build:**
   - **Production branch:** `main`
   - **Build command:** (leave empty - static HTML)
   - **Build output directory:** `/` (root)
   - **Root directory:** `/`
6. **Click:** Save and Deploy

**Pages URL will be:** `rethinkit-ai.pages.dev`

---

## 🌐 Step 3: Add Custom Domain

**After Pages deployment completes:**

1. **In Pages Project:** Go to Custom Domains tab
2. **Click:** Set up a custom domain
3. **Enter:** `rethinkit.ai`
4. **Cloudflare will:**
   - Detect that you don't have the domain in Cloudflare DNS yet
   - Show instructions to add domain to Cloudflare

---

## 📡 Step 4: Move DNS to Cloudflare

### Current DNS: Dandomain
- Nameservers: `ns.dandomain.dk`, `ns2.dandomain.dk`
- Current IP: `34.111.179.208` (Google Cloud)

### Move to Cloudflare:

1. **Add Site to Cloudflare:**
   - Dashboard → Add a Site → `rethinkit.ai`
   - Choose Free Plan
   - Cloudflare scans your DNS records

2. **You'll get Cloudflare nameservers like:**
   ```
   amber.ns.cloudflare.com
   dora.ns.cloudflare.com
   ```

3. **Update at Dandomain:**
   - Log in to Dandomain control panel
   - Go to DNS/Nameserver settings
   - Replace nameservers with Cloudflare's
   - Save

4. **Wait for propagation:** 24-48 hours (usually faster)

5. **Verify:** Cloudflare dashboard will show "Active" status

---

## 🔗 Step 5: Connect Pages to Custom Domain

**After DNS is active in Cloudflare:**

1. **Pages Project → Custom Domains**
2. **Add:** `rethinkit.ai`
3. **Cloudflare automatically:**
   - Creates DNS records (CNAME to Pages)
   - Issues SSL certificate
   - Sets up `www.rethinkit.ai` redirect

---

## 🔧 Step 6: Add Worker Route for API

**Connect your qBlog Newsletter Worker to the custom domain:**

### Option A: Via Dashboard
1. **Workers & Pages → qblog-newsletter-api → Settings → Triggers**
2. **Add Route:** `rethinkit.ai/api/newsletter/*`
3. **Zone:** `rethinkit.ai`

### Option B: Via wrangler.toml
Edit `~/clawd/projects/rethinkit/qblog-worker/wrangler.toml`:

```toml
[[routes]]
pattern = "rethinkit.ai/api/newsletter/*"
zone_name = "rethinkit.ai"
```

Then deploy:
```bash
cd ~/clawd/projects/rethinkit/qblog-worker
wrangler deploy
```

---

## 📝 Step 7: Update Frontend API URL (After Route is Live)

**File:** `qblog.html` (line 251)

**Change from:**
```javascript
const API_URL = 'https://qblog-newsletter-api.ulrich-8db.workers.dev';
```

**To:**
```javascript
const API_URL = 'https://rethinkit.ai/api/newsletter';
```

**Then commit and push:**
```bash
cd ~/clawd/projects/rethinkit
git add qblog.html
git commit -m "Update API URL to custom domain"
git push
```

Cloudflare Pages will auto-deploy the update.

---

## 🎯 Final Architecture

```
┌─────────────────────────────────────────────────┐
│           rethinkit.ai (Cloudflare DNS)         │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┴──────────────┐
        │                          │
        ▼                          ▼
┌───────────────┐          ┌──────────────────┐
│ Cloudflare    │          │ Cloudflare       │
│ Pages         │          │ Workers          │
│ (Static Site) │          │ (qBlog API)      │
└───────────────┘          └──────────────────┘
        │                          │
        │                          │
 rethinkit.ai              /api/newsletter/*
 www.rethinkit.ai
```

---

## ✅ Checklist

### Now (Manual Steps)
- [ ] Go to dash.cloudflare.com
- [ ] Create Pages project from GitHub (rethinkit-ai repo)
- [ ] Wait for initial deployment
- [ ] Add rethinkit.ai as custom domain
- [ ] Add rethinkit.ai to Cloudflare (Add a Site)
- [ ] Update nameservers at Dandomain
- [ ] Wait for DNS propagation (check: `dig rethinkit.ai NS`)

### After DNS is Active
- [ ] Verify Pages is serving rethinkit.ai
- [ ] Add Worker route: `rethinkit.ai/api/newsletter/*`
- [ ] Update API_URL in qblog.html
- [ ] Test full signup flow
- [ ] Add SPF/DMARC DNS records for email

---

## 🧪 Testing

**Check DNS propagation:**
```bash
dig rethinkit.ai NS +short
# Should show Cloudflare nameservers
```

**Check Pages deployment:**
```bash
curl -I https://rethinkit.ai
# Should return 200 OK with Cloudflare headers
```

**Check Worker route:**
```bash
curl https://rethinkit.ai/api/newsletter/health
# Should return: {"status":"ok","service":"qBlog Newsletter API"}
```

---

## 📧 Email DNS Records (Add After Domain is Active)

**For better email deliverability:**

### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:relay.mailchannels.net ~all
TTL: Auto
```

### DMARC Record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@rethinkit.ai
TTL: Auto
```

---

## 🚀 Automatic Deployments

**Every time you push to GitHub:**
```bash
cd ~/clawd/projects/rethinkit
git add .
git commit -m "Update content"
git push
```

**Cloudflare Pages automatically:**
- Detects the push
- Builds and deploys
- Updates live site in ~30 seconds

**View deployments:** https://dash.cloudflare.com → Pages → rethinkit-ai → Deployments

---

## 🆘 Troubleshooting

**Pages deployment failed:**
- Check build logs in Cloudflare dashboard
- Ensure no build command is set (static HTML)
- Verify all HTML files are in repo root

**Custom domain not working:**
- Wait for DNS propagation (use https://dnschecker.org)
- Check SSL certificate status in Pages settings
- Verify CNAME record points to Pages URL

**Worker route not working:**
- Ensure domain is active in Cloudflare DNS
- Check route pattern matches exactly
- Verify worker is deployed

---

## 📞 Resources

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Custom Domains:** https://developers.cloudflare.com/pages/configuration/custom-domains/
- **Workers Routes:** https://developers.cloudflare.com/workers/configuration/routing/routes/

---

**Start here:** https://dash.cloudflare.com → Create Pages Project 🚀
