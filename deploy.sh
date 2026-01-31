#!/bin/bash
# Deploy reTHINKit to Cloudflare Pages via Wrangler

set -e

echo "🚀 Deploying reTHINKit to Cloudflare Pages..."
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Uncommitted changes detected"
    echo ""
    git status -s
    echo ""
    read -p "Deploy anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 1
    fi
fi

# Deploy
wrangler pages deploy . --project-name=rethinkit --branch=main --commit-dirty=true

echo ""
echo "✅ Deployment complete!"
echo "🌍 Production: https://rethinkit.pages.dev"
echo "🌍 Custom domain: https://www.rethinkit.ai (once DNS updated)"
