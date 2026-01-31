# Deploy reTHINKit - Wrangler Method

**Status:** GitHub auto-deploy disabled. Using Wrangler CLI for manual deployments.

---

## 🚀 Quick Deploy

```bash
cd ~/clawd/projects/rethinkit
./deploy.sh
```

Or manually:

```bash
wrangler pages deploy . --project-name=rethinkit --branch=main --commit-dirty=true
```

---

## 📋 Workflow

### 1. Make Changes

Edit files in `~/clawd/projects/rethinkit/`:
- `index.html`, `qreview.html`, `qassist.html`, etc.
- `styles.css`, `product.css`
- Any other assets

### 2. Test Locally (Optional)

```bash
cd ~/clawd/projects/rethinkit
python3 -m http.server 8000
# Visit http://localhost:8000
```

### 3. Commit to Git

```bash
git add .
git commit -m "Your changes"
git push
```

**Note:** GitHub push does NOT auto-deploy anymore. You must deploy manually.

### 4. Deploy to Cloudflare

```bash
./deploy.sh
```

This will:
- ✅ Check for uncommitted changes (warns if any)
- ✅ Deploy to Cloudflare Pages via Wrangler
- ✅ Show deployment URL

---

## 🌍 URLs

**Primary (Cloudflare Pages):**
- Production: https://rethinkit.pages.dev
- Latest deployment: https://[hash].rethinkit.pages.dev

**Custom Domain (once DNS updated):**
- https://www.rethinkit.ai
- https://rethinkit.ai

---

## 🔧 First-Time Setup (Already Done)

```bash
# Login to Cloudflare (one-time)
wrangler login

# Create wrangler.toml (already exists)
# Create deploy.sh (already exists)
```

---

## 📝 Deployment Notes

- **GitHub:** Repo at https://github.com/MrSlothuus/rethinkit-ai
  - Used for version control only
  - Auto-deploy integration disconnected
  
- **Cloudflare Pages:** Project name `rethinkit`
  - Manual deployments via Wrangler CLI
  - Each deploy gets unique hash URL for testing
  
- **DNS:** Managed at Dandomain
  - Waiting for support to update DNS records
  - Email stays at Dandomain (MX records unchanged)

---

## 🐛 Troubleshooting

**Error: "Not authenticated"**
```bash
wrangler login
```

**Error: "Project not found"**
Check project name in Cloudflare dashboard - should be `rethinkit`

**Deployment stuck**
- Check internet connection
- Try: `wrangler pages deploy . --project-name=rethinkit --branch=main`

---

## ✅ Post-Deployment Checklist

After deploying:
- [ ] Check deployment URL (shown in terminal)
- [ ] Verify changes at https://rethinkit.pages.dev
- [ ] Test functionality (forms, links, auth if applicable)
- [ ] Once DNS updated: verify www.rethinkit.ai

---

**Last Updated:** 2026-01-31  
**Deployment Method:** Wrangler CLI (manual)
