#!/bin/bash
cd "$(dirname "$0")"
git add .
git commit -m "auto-update: $(date '+%Y-%m-%d %H:%M')"
git push
echo ""
echo "✅ Done! Your site will update on Vercel in ~30 seconds."
